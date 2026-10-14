"""OneCompilerHub Backend - Health Check Schemas."""

from datetime import datetime, timezone
from typing import Any, Dict
from pydantic import BaseModel, Field


class ExecutionCapabilities(BaseModel):
    execution_submission_enabled: bool = Field(
        ...,
        description="Whether code execution submission is currently accepted by the backend.",
    )
    sandbox_mode: str = Field(
        ...,
        description="Operational sandbox mode: 'disabled' (Step 5 security default) or 'mock_test'.",
    )
    max_source_code_bytes: int
    max_stdin_bytes: int
    default_timeout_seconds: float


class HealthResponse(BaseModel):
    status: str = "healthy"
    version: str
    environment: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    capabilities: ExecutionCapabilities
    extra: Dict[str, Any] = Field(default_factory=dict)
