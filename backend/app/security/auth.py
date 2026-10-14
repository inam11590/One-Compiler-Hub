"""OneCompilerHub Backend - Supabase Authentication & Authorization.

Validates Supabase JWTs cryptographically server-side.
Never trusts client-supplied user IDs from request bodies or headers.
Supports both public/anonymous access and authenticated user access.
"""

from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import jwt
from pydantic import BaseModel
from app.core.config import settings
from app.core.logging import log_security_event

security = HTTPBearer(auto_error=False)


class AuthenticatedUser(BaseModel):
    user_id: str
    email: Optional[str] = None
    role: str = "authenticated"


def verify_supabase_jwt(token: str) -> AuthenticatedUser:
    """Verifies a Supabase JWT token and extracts verified claims."""
    # Check for test-mode shortcut tokens in test/dev environments ONLY
    if settings.ENVIRONMENT in ("test", "development"):
        if token.startswith("test-token-user-"):
            uid = token.replace("test-token-user-", "")
            return AuthenticatedUser(user_id=uid, email=f"{uid}@example.com")
        if token == "test-token-anonymous":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired authentication token.",
                headers={"WWW-Authenticate": "Bearer"},
            )

    jwt_secret = settings.SUPABASE_JWT_SECRET
    if not jwt_secret:
        # If JWT secret is not configured in environment, attempt decoding without verification only in non-prod
        if settings.ENVIRONMENT in ("test", "development"):
            try:
                unverified_claims = jwt.decode(token, options={"verify_signature": False})
                user_id = unverified_claims.get("sub")
                if not user_id:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Invalid token: missing subject (sub) claim.",
                    )
                return AuthenticatedUser(
                    user_id=user_id,
                    email=unverified_claims.get("email"),
                    role=unverified_claims.get("role", "authenticated"),
                )
            except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail=f"Invalid authentication token: {str(e)}",
                )

        # In production without secret: fail closed
        log_security_event("AUTH_CONFIGURATION_ERROR", "SUPABASE_JWT_SECRET is missing in production")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authentication server verification configuration error.",
        )

    try:
        # Supabase default algorithm is HS256 with project JWT secret
        payload = jwt.decode(
            token,
            jwt_secret,
            algorithms=["HS256", "RS256", "ES256"],
            options={"verify_exp": True, "verify_aud": False},
        )

        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token is missing sub claim.",
            )

        return AuthenticatedUser(
            user_id=user_id,
            email=payload.get("email"),
            role=payload.get("role", "authenticated"),
        )
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token has expired. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError as e:
        log_security_event("INVALID_TOKEN_ATTEMPT", f"Rejected invalid JWT token: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token.",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> Optional[AuthenticatedUser]:
    """Retrieves authenticated user if Bearer token is provided, otherwise None."""
    if not credentials or not credentials.credentials:
        return None
    return verify_supabase_jwt(credentials.credentials)


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> AuthenticatedUser:
    """Enforces authentication and returns verified user claims."""
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials required.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return verify_supabase_jwt(credentials.credentials)
