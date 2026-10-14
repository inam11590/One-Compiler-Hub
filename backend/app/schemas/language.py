"""OneCompilerHub Backend - Language Registry Schemas."""

from typing import List
from pydantic import BaseModel, Field
from app.core.constants import ExecutionMode, LanguageAvailability, ToolCategory


class ResourcePolicy(BaseModel):
    id: str
    memory_limit_mb: int
    cpu_limit_cores: float
    max_timeout_seconds: float
    network_enabled: bool = False
    pids_limit: int = 64


class LanguageEntry(BaseModel):
    id: str = Field(..., description="Unique language identifier, e.g. 'python', 'cpp'")
    display_name: str = Field(..., description="Human-readable language or tool name")
    category: ToolCategory
    runtime_type: str = Field(..., description="E.g. 'cpython', 'gcc', 'openjdk', 'v8'")
    supported_file_extensions: List[str]
    default_file_name: str
    execution_mode: ExecutionMode
    availability_status: LanguageAvailability
    resource_policy: ResourcePolicy
    description: str


class LanguageListResponse(BaseModel):
    total: int
    languages: List[LanguageEntry]
