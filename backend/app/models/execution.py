"""OneCompilerHub Backend - Internal Execution Models."""

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Optional
import uuid
from app.core.constants import ExecutionStatus


@dataclass
class ExecutionJob:
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    language: str = ""
    source_code: str = ""
    stdin: Optional[str] = None
    status: ExecutionStatus = ExecutionStatus.QUEUED
    stdout: str = ""
    stderr: str = ""
    exit_code: Optional[int] = None
    duration_ms: Optional[float] = None
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    error: Optional[str] = None
    user_id: Optional[str] = None  # None for anonymous / guest submissions
    client_request_id: Optional[str] = None
    is_sandboxed: bool = True
