"""OneCompilerHub Backend - Mock Execution Worker for Automated Testing.

SAFEGUARD:
This worker is restricted strictly to non-production environments (ENVIRONMENT == 'test' or 'development').
It executes NO shell or subprocess commands and merely provides deterministic state transitions
for API contract testing.
"""

import asyncio
from datetime import datetime, timezone
from app.core.config import settings
from app.core.constants import ExecutionStatus
from app.models.execution import ExecutionJob
from app.workers.base import BaseExecutionWorker


class MockExecutionWorker(BaseExecutionWorker):
    """Mock worker for automated integration and contract testing."""

    def __init__(self, worker_id: str = "mock-worker-01") -> None:
        self._worker_id = worker_id
        self._cancelled_jobs = set()

        # Strict safety guard: Never allow mock worker in production
        if settings.ENVIRONMENT == "production":
            raise RuntimeError(
                "CRITICAL: MockExecutionWorker cannot be initialized in a production environment."
            )

    @property
    def worker_id(self) -> str:
        return self._worker_id

    async def is_healthy(self) -> bool:
        return True

    async def execute(self, job: ExecutionJob) -> ExecutionJob:
        if settings.ENVIRONMENT == "production":
            raise RuntimeError("Mock worker execution blocked in production.")

        job.started_at = datetime.now(timezone.utc)
        job.status = ExecutionStatus.RUNNING

        # Simulate quick processing latency for contract testing
        await asyncio.sleep(0.01)

        if job.id in self._cancelled_jobs:
            job.status = ExecutionStatus.CANCELLED
            job.completed_at = datetime.now(timezone.utc)
            job.error = "Execution was cancelled by client."
            return job

        # Check for simulated error keyword in test code
        if "MOCK_FAIL_TRIGGER" in job.source_code:
            job.status = ExecutionStatus.FAILED
            job.exit_code = 1
            job.stderr = "Simulated execution error for testing."
            job.error = "Process terminated with exit code 1."
        elif "MOCK_TIMEOUT_TRIGGER" in job.source_code:
            job.status = ExecutionStatus.TIMED_OUT
            job.exit_code = -9
            job.error = "Execution exceeded time limit."
        else:
            job.status = ExecutionStatus.COMPLETED
            job.exit_code = 0
            job.stdout = f"Mock output for {job.language} (test environment only)."
            if job.stdin:
                job.stdout += f"\nEcho stdin: {job.stdin}"

        job.completed_at = datetime.now(timezone.utc)
        if job.started_at and job.completed_at:
            job.duration_ms = (job.completed_at - job.started_at).total_seconds() * 1000.0

        return job

    async def cancel(self, job_id: str) -> bool:
        self._cancelled_jobs.add(job_id)
        return True
