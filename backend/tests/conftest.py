"""Pytest configuration and test fixtures for OneCompilerHub Backend."""
# ruff: noqa: E402

import os
import sys

# Ensure backend root is on Python sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Force test environment settings before importing app
os.environ["ENVIRONMENT"] = "test"
os.environ["DEBUG"] = "true"
os.environ["EXECUTION_ENABLED"] = "false"  # Default test matches production safety
os.environ["MOCK_WORKER_ENABLED"] = "false"
os.environ["SUPABASE_JWT_SECRET"] = "test-secret-key-32-bytes-long-123456"

import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.core.config import settings
from app.services.queue import job_queue
from app.security.rate_limiter import rate_limiter


@pytest.fixture(autouse=True)
def reset_state():
    """Resets in-memory queues and rate limiters between tests."""
    if hasattr(job_queue, "clear"):
        job_queue.clear()
    if hasattr(rate_limiter, "reset"):
        rate_limiter.reset()
    # Reset settings defaults
    settings.EXECUTION_ENABLED = False
    settings.MOCK_WORKER_ENABLED = False
    settings.ENVIRONMENT = "test"
    yield
    if hasattr(job_queue, "clear"):
        job_queue.clear()
    if hasattr(rate_limiter, "reset"):
        rate_limiter.reset()


import pytest_asyncio


@pytest_asyncio.fixture
async def client():
    """Async HTTP client for testing FastAPI endpoints."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
