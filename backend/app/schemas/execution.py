"""OneCompilerHub Backend - Execution Schemas."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, field_validator, model_validator
from app.core.constants import (
    ExecutionStatus,
    MAX_SOURCE_CODE_BYTES,
    MAX_STDIN_BYTES,
)


class ExecutionCreateRequest(BaseModel):
    language: str = Field(..., description="Target language identifier (e.g. 'python', 'cpp')")
    source_code: str = Field(..., description="Source code to be executed")
    stdin: Optional[str] = Field(default=None, description="Optional standard input stream")
    client_request_id: Optional[str] = Field(
        default=None,
        description="Client-provided idempotency or correlation key",
    )

    @field_validator("source_code")
    @classmethod
    def validate_source_code_size(cls, v: str) -> str:
        encoded_bytes = len(v.encode("utf-8"))
        if encoded_bytes > MAX_SOURCE_CODE_BYTES:
            raise ValueError(
                f"Source code exceeds maximum allowed payload of {MAX_SOURCE_CODE_BYTES} bytes ({MAX_SOURCE_CODE_BYTES // 1024} KB). Received {encoded_bytes} bytes."
            )
        if not v.strip():
            raise ValueError("Source code cannot be empty.")
        return v

    @field_validator("stdin")
    @classmethod
    def validate_stdin_size(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            encoded_bytes = len(v.encode("utf-8"))
            if encoded_bytes > MAX_STDIN_BYTES:
                raise ValueError(
                    f"Standard input exceeds maximum allowed payload of {MAX_STDIN_BYTES} bytes ({MAX_STDIN_BYTES // 1024} KB)."
                )
        return v

    @field_validator("language")
    @classmethod
    def sanitize_language(cls, v: str) -> str:
        clean = v.strip().lower()
        if not clean:
            raise ValueError("Language identifier is required.")
        return clean


class ExecutionResponse(BaseModel):
    id: str = Field(..., description="Unique UUID for this execution job")
    execution_id: Optional[str] = Field(default=None, description="Client compatibility alias for id")
    language: str
    status: ExecutionStatus
    source_code: str
    stdin: Optional[str] = None
    stdout: str = ""
    stderr: str = ""
    exit_code: Optional[int] = None
    duration_ms: Optional[float] = None
    created_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    error: Optional[str] = None
    client_request_id: Optional[str] = None
    is_sandboxed: bool = True

    @model_validator(mode="after")
    def populate_execution_id(self) -> "ExecutionResponse":
        if not self.execution_id:
            self.execution_id = self.id
        return self


class ExecutionCancelResponse(BaseModel):
    id: str
    execution_id: Optional[str] = Field(default=None, description="Client compatibility alias for id")
    status: ExecutionStatus
    message: str

    @model_validator(mode="after")
    def populate_execution_id(self) -> "ExecutionCancelResponse":
        if not self.execution_id:
            self.execution_id = self.id
        return self
