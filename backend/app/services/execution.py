"""OneCompilerHub Backend - Code Execution Service.

Coordinates language verification, security policy checks, queueing,
and sandbox worker dispatch.

SAFETY ENFORCEMENT:
In Step 5, code execution submission is DISABLED by default in production.
"""

from typing import Optional
from fastapi import HTTPException, status
from app.core.config import settings
from app.core.constants import ExecutionStatus
from app.core.logging import log_security_event, logger
from app.models.execution import ExecutionJob
from app.schemas.execution import (
    ExecutionCancelResponse,
    ExecutionCreateRequest,
    ExecutionResponse,
)
from app.security.auth import AuthenticatedUser
from app.services.queue import JobQueueService, job_queue
from app.services.registry import language_registry
from app.workers.base import BaseExecutionWorker
from app.workers.mock import MockExecutionWorker


class ExecutionService:
    """Core domain service for managing execution jobs."""

    def __init__(
        self,
        queue: JobQueueService = job_queue,
        worker: Optional[BaseExecutionWorker] = None,
    ) -> None:
        self.queue = queue
        self._worker = worker

    def _get_worker(self) -> BaseExecutionWorker:
        if self._worker:
            return self._worker

        if settings.MOCK_WORKER_ENABLED and settings.ENVIRONMENT in ("test", "development"):
            self._worker = MockExecutionWorker()
            return self._worker

        raise RuntimeError("No execution worker registered or available for this environment.")

    async def submit_execution(
        self,
        request: ExecutionCreateRequest,
        user: Optional[AuthenticatedUser] = None,
    ) -> ExecutionResponse:
        """Validates and submits an execution job."""
        # 1. Verify language exists in registry
        lang_entry = language_registry.get_by_id(request.language)
        if not lang_entry:
            log_security_event(
                "UNSUPPORTED_LANGUAGE_ATTEMPT",
                f"Attempted execution of unsupported language: '{request.language}'",
                user_id=user.user_id if user else None,
            )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported language identifier: '{request.language}'. View /api/v1/languages for supported tools.",
            )

        # 2. Check if code execution is enabled on this instance (Disabled in production for Step 5)
        if not settings.EXECUTION_ENABLED:
            logger.info(
                f"Execution rejected: backend execution engine is currently disabled (Step 5 security default). Language: {request.language}"
            )
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Code execution is currently disabled pending sandbox security verification.",
            )

        # 3. Create job
        job = ExecutionJob(
            language=lang_entry.id,
            source_code=request.source_code,
            stdin=request.stdin,
            user_id=user.user_id if user else None,
            client_request_id=request.client_request_id,
            status=ExecutionStatus.QUEUED,
        )

        await self.queue.enqueue(job)

        # 4. If mock worker is enabled (test mode), process job synchronously or async
        if settings.MOCK_WORKER_ENABLED:
            worker = self._get_worker()
            job = await worker.execute(job)
            await self.queue.update_job(job)

        return self._to_response(job)

    async def get_execution(
        self,
        execution_id: str,
        user: Optional[AuthenticatedUser] = None,
    ) -> ExecutionResponse:
        """Retrieves an execution job by ID with authorization checks."""
        job = await self.queue.get_job(execution_id)
        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Execution with ID '{execution_id}' was not found or has expired.",
            )

        # Authorization: If job belongs to a registered user, restrict access to owner
        if job.user_id:
            if not user or user.user_id != job.user_id:
                log_security_event(
                    "UNAUTHORIZED_EXECUTION_ACCESS",
                    f"User {user.user_id if user else 'anonymous'} attempted unauthorized access to job {execution_id}",
                    user_id=user.user_id if user else None,
                )
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You do not have permission to view this execution.",
                )

        return self._to_response(job)

    async def cancel_execution(
        self,
        execution_id: str,
        user: Optional[AuthenticatedUser] = None,
    ) -> ExecutionCancelResponse:
        """Cancels an active or queued execution job with authorization checks."""
        job = await self.queue.get_job(execution_id)
        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Execution with ID '{execution_id}' was not found.",
            )

        # Authorization: Only owner can cancel
        if job.user_id:
            if not user or user.user_id != job.user_id:
                log_security_event(
                    "UNAUTHORIZED_CANCELLATION_ATTEMPT",
                    f"User {user.user_id if user else 'anonymous'} attempted unauthorized cancellation of job {execution_id}",
                    user_id=user.user_id if user else None,
                )
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You do not have permission to cancel this execution.",
                )

        cancelled = await self.queue.cancel_job(execution_id)
        if not cancelled:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Execution '{execution_id}' is already in terminal state ({job.status.value}) and cannot be cancelled.",
            )

        # If a worker instance is active, signal cancellation
        if self._worker:
            await self._worker.cancel(execution_id)

        return ExecutionCancelResponse(
            id=execution_id,
            status=ExecutionStatus.CANCELLED,
            message="Execution job was cancelled successfully.",
        )

    def _to_response(self, job: ExecutionJob) -> ExecutionResponse:
        return ExecutionResponse(
            id=job.id,
            language=job.language,
            status=job.status,
            source_code=job.source_code,
            stdin=job.stdin,
            stdout=job.stdout,
            stderr=job.stderr,
            exit_code=job.exit_code,
            duration_ms=job.duration_ms,
            created_at=job.created_at,
            started_at=job.started_at,
            completed_at=job.completed_at,
            error=job.error,
            client_request_id=job.client_request_id,
            is_sandboxed=job.is_sandboxed,
        )


execution_service = ExecutionService()
