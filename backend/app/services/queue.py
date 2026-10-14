"""OneCompilerHub Backend - Job Queue Abstraction & In-Memory Adapter.

Defines the scalable queue interface for code execution jobs.
Includes an in-memory implementation for automated testing and single-instance local development.
A distributed Redis/ARQ backend specification is documented for production scale.
"""

from abc import ABC, abstractmethod
import asyncio
from datetime import datetime, timezone
from typing import Dict, List, Optional
from app.core.constants import ExecutionStatus, JOB_EXPIRATION_SECONDS
from app.models.execution import ExecutionJob


class JobQueueService(ABC):
    """Abstract interface for execution job queues."""

    @abstractmethod
    async def enqueue(self, job: ExecutionJob) -> str:
        """Enqueues an execution job and returns its ID."""
        pass

    @abstractmethod
    async def get_job(self, job_id: str) -> Optional[ExecutionJob]:
        """Retrieves a job by its unique ID."""
        pass

    @abstractmethod
    async def update_job(self, job: ExecutionJob) -> None:
        """Updates job state in the queue."""
        pass

    @abstractmethod
    async def cancel_job(self, job_id: str) -> bool:
        """Attempts to cancel a queued or running job."""
        pass

    @abstractmethod
    async def list_jobs(
        self, user_id: Optional[str] = None, limit: int = 50
    ) -> List[ExecutionJob]:
        """Lists recent jobs, optionally filtered by user ID."""
        pass


class InMemoryJobQueue(JobQueueService):
    """Thread-safe in-memory queue adapter for local testing."""

    def __init__(self) -> None:
        self._jobs: Dict[str, ExecutionJob] = {}
        self._idempotency_map: Dict[str, str] = {}  # client_request_id -> job_id
        self._lock = asyncio.Lock()

    async def enqueue(self, job: ExecutionJob) -> str:
        async with self._lock:
            # Idempotency / duplicate check
            if job.client_request_id:
                existing_id = self._idempotency_map.get(job.client_request_id)
                if existing_id and existing_id in self._jobs:
                    return existing_id

            self._jobs[job.id] = job
            if job.client_request_id:
                self._idempotency_map[job.client_request_id] = job.id

            return job.id

    async def get_job(self, job_id: str) -> Optional[ExecutionJob]:
        async with self._lock:
            job = self._jobs.get(job_id)
            if not job:
                return None

            # Check expiration
            now = datetime.now(timezone.utc)
            age_seconds = (now - job.created_at).total_seconds()
            if age_seconds > JOB_EXPIRATION_SECONDS:
                del self._jobs[job_id]
                return None

            return job

    async def update_job(self, job: ExecutionJob) -> None:
        async with self._lock:
            self._jobs[job.id] = job

    async def cancel_job(self, job_id: str) -> bool:
        async with self._lock:
            job = self._jobs.get(job_id)
            if not job:
                return False

            if job.status in (
                ExecutionStatus.COMPLETED,
                ExecutionStatus.FAILED,
                ExecutionStatus.TIMED_OUT,
                ExecutionStatus.CANCELLED,
            ):
                return False  # Terminal state cannot be cancelled

            job.status = ExecutionStatus.CANCELLED
            job.completed_at = datetime.now(timezone.utc)
            job.error = "Execution was cancelled by user request."
            return True

    async def list_jobs(
        self, user_id: Optional[str] = None, limit: int = 50
    ) -> List[ExecutionJob]:
        async with self._lock:
            results = list(self._jobs.values())
            if user_id is not None:
                results = [j for j in results if j.user_id == user_id]
            # Sort newest first
            results.sort(key=lambda j: j.created_at, reverse=True)
            return results[:limit]

    def clear(self) -> None:
        """Utility for test suite cleanup."""
        self._jobs.clear()
        self._idempotency_map.clear()


# Global queue service instance
job_queue: JobQueueService = InMemoryJobQueue()
