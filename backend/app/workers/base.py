"""OneCompilerHub Backend - Execution Worker Base Interface.

CRITICAL SECURITY DIRECTIVE:
Arbitrary user-submitted code MUST NEVER be executed directly in the API service
process via subprocess, os.system, exec, or eval. Execution workers must be
isolated on dedicated worker instances behind microVM or hardened sandbox boundaries.
"""

from abc import ABC, abstractmethod
from app.models.execution import ExecutionJob


class BaseExecutionWorker(ABC):
    """Abstract interface for untrusted code execution workers."""

    @property
    @abstractmethod
    def worker_id(self) -> str:
        """Returns unique identifier for this worker instance."""
        pass

    @abstractmethod
    async def is_healthy(self) -> bool:
        """Verifies worker readiness and isolation health."""
        pass

    @abstractmethod
    async def execute(self, job: ExecutionJob) -> ExecutionJob:
        """Executes the given job in an isolated sandbox.

        Must update job.stdout, job.stderr, job.exit_code, job.duration_ms,
        and job.status.
        """
        pass

    @abstractmethod
    async def cancel(self, job_id: str) -> bool:
        """Requests graceful or forced termination of a running job."""
        pass
