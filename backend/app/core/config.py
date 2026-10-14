"""OneCompilerHub Backend - Application Configuration."""

from typing import List, Optional
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "OneCompilerHub Execution API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Environment: production, development, test
    ENVIRONMENT: str = Field(default="production")
    DEBUG: bool = Field(default=False)

    # Core Security Flag: Execution is disabled by default in production for Step 5
    EXECUTION_ENABLED: bool = Field(
        default=False,
        description="Master killswitch for real code execution submission.",
    )

    # Mock Worker Flag: Available strictly for automated test suites
    MOCK_WORKER_ENABLED: bool = Field(
        default=False,
        description="Enables mock execution adapter for automated unit tests.",
    )

    # Supabase Integration
    SUPABASE_URL: Optional[str] = Field(default=None)
    SUPABASE_ANON_KEY: Optional[str] = Field(default=None)
    SUPABASE_JWT_SECRET: Optional[str] = Field(default=None)

    # CORS Allowlist
    CORS_ORIGINS: List[str] = Field(
        default=[
            "http://localhost:3000",
            "http://localhost:3001",
            "https://one-compiler-hub.vercel.app",
        ]
    )

    # Rate Limiting
    RATE_LIMIT_ANON_PER_MINUTE: int = Field(default=15)
    RATE_LIMIT_AUTH_PER_MINUTE: int = Field(default=60)

    # Queue Configuration
    QUEUE_BACKEND: str = Field(
        default="memory",
        description="Queue backend type: memory (local/test) or redis (production).",
    )
    REDIS_URL: Optional[str] = Field(default=None)

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    @field_validator("MOCK_WORKER_ENABLED")
    @classmethod
    def validate_mock_worker(cls, v: bool, info) -> bool:
        """Prevent mock worker from ever being enabled in production."""
        env = info.data.get("ENVIRONMENT", "production")
        if v and env == "production":
            raise ValueError("MOCK_WORKER_ENABLED cannot be enabled in production environment.")
        return v


settings = Settings()
