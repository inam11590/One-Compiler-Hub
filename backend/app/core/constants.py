"""OneCompilerHub Backend - System Constants and Enums."""

from enum import Enum

# Resource & Payload Constraints
MAX_SOURCE_CODE_BYTES = 65_536  # 64 KB
MAX_STDIN_BYTES = 16_384  # 16 KB
MAX_OUTPUT_BYTES = 65_536  # 64 KB max stdout / stderr

DEFAULT_EXECUTION_TIMEOUT_SECONDS = 5.0
MAX_EXECUTION_TIMEOUT_SECONDS = 15.0
JOB_EXPIRATION_SECONDS = 3600  # 1 hour retention for execution metadata


class ExecutionStatus(str, Enum):
    QUEUED = "queued"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    TIMED_OUT = "timed_out"
    CANCELLED = "cancelled"


class ToolCategory(str, Enum):
    PROGRAMMING = "programming"
    WEB = "web"
    DATABASE = "database"
    FRAMEWORK = "framework"


class ExecutionMode(str, Enum):
    COMPILED = "compiled"
    INTERPRETED = "interpreted"
    BROWSER_PREVIEW = "browser_preview"
    DATABASE_QUERY = "database_query"
    FRAMEWORK = "framework"


class LanguageAvailability(str, Enum):
    AVAILABLE = "available"
    COMING_SOON = "coming_soon"
    IN_DEVELOPMENT = "in_development"
    MAINTENANCE = "maintenance"
