"""OneCompilerHub Backend - Health API Endpoint."""

from fastapi import APIRouter
from app.core.config import settings
from app.core.constants import (
    DEFAULT_EXECUTION_TIMEOUT_SECONDS,
    MAX_SOURCE_CODE_BYTES,
    MAX_STDIN_BYTES,
)
from app.schemas.health import ExecutionCapabilities, HealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse, tags=["System"])
async def get_health() -> HealthResponse:
    """Returns system status, environment metadata, and execution engine capabilities."""
    return HealthResponse(
        status="healthy",
        version=settings.VERSION,
        environment=settings.ENVIRONMENT,
        capabilities=ExecutionCapabilities(
            execution_submission_enabled=settings.EXECUTION_ENABLED,
            sandbox_mode="mock_test" if settings.MOCK_WORKER_ENABLED else ("python_sandbox" if settings.EXECUTION_ENABLED else "disabled"),
            max_source_code_bytes=MAX_SOURCE_CODE_BYTES,
            max_stdin_bytes=MAX_STDIN_BYTES,
            default_timeout_seconds=DEFAULT_EXECUTION_TIMEOUT_SECONDS,
        ),
        extra={
            "service": "OneCompilerHub Execution Backend",
            "step": 7,
            "security_status": "Step 7 Sandboxed Python Execution Engine Active",
            "active_runtime": "cpython_3.12",
        },
    )
