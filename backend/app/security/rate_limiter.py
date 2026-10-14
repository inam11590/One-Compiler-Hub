"""OneCompilerHub Backend - Rate Limiting & Abuse Prevention.

Provides a pluggable rate limiting interface with an in-memory sliding window
for development and testing, and architectural design for Redis-backed distributed
token buckets in production clusters.
"""

from abc import ABC, abstractmethod
import asyncio
import time
from typing import Dict, List, Optional, Tuple
from fastapi import HTTPException, Request, status
from app.core.config import settings
from app.core.logging import log_security_event
from app.security.auth import AuthenticatedUser


class BaseRateLimiter(ABC):
    """Abstract interface for rate limiting implementations."""

    @abstractmethod
    async def check(
        self, key: str, max_requests: int, window_seconds: int = 60
    ) -> Tuple[bool, int, int]:
        """Checks if key exceeds limit.

        Returns (is_limited, current_requests, retry_after_seconds).
        """
        pass


class InMemoryRateLimiter(BaseRateLimiter):
    """In-memory sliding window rate limiter for testing and single-node development."""

    def __init__(self) -> None:
        self._requests: Dict[str, List[float]] = {}
        self._lock = asyncio.Lock()

    async def check(
        self, key: str, max_requests: int, window_seconds: int = 60
    ) -> Tuple[bool, int, int]:
        now = time.time()
        window_start = now - window_seconds

        async with self._lock:
            timestamps = self._requests.get(key, [])
            # Filter timestamps outside sliding window
            timestamps = [ts for ts in timestamps if ts > window_start]

            if len(timestamps) >= max_requests:
                oldest = timestamps[0]
                retry_after = int(oldest + window_seconds - now) + 1
                self._requests[key] = timestamps
                return True, len(timestamps), max(1, retry_after)

            timestamps.append(now)
            self._requests[key] = timestamps
            return False, len(timestamps), 0

    def reset(self) -> None:
        """Utility for test suite resets."""
        self._requests.clear()


rate_limiter: BaseRateLimiter = InMemoryRateLimiter()


async def enforce_rate_limit(
    request: Request, user: Optional[AuthenticatedUser] = None
) -> None:
    """FastAPI dependency to enforce rate limits per IP or authenticated user."""
    if user:
        key = f"user:{user.user_id}"
        limit = settings.RATE_LIMIT_AUTH_PER_MINUTE
    else:
        # Resolve client IP safely
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            client_ip = forwarded_for.split(",")[0].strip()
        else:
            client_ip = request.client.host if request.client else "unknown"
        key = f"ip:{client_ip}"
        limit = settings.RATE_LIMIT_ANON_PER_MINUTE

    is_limited, current, retry_after = await rate_limiter.check(
        key=key, max_requests=limit, window_seconds=60
    )

    if is_limited:
        log_security_event(
            event="RATE_LIMIT_EXCEEDED",
            message=f"Rate limit exceeded for key {key}. Requests: {current}/{limit}",
            client_ip=key,
            user_id=user.user_id if user else None,
            extra={"retry_after": retry_after},
        )
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Rate limit exceeded. Maximum {limit} requests per minute allowed.",
            headers={"Retry-After": str(retry_after)},
        )
