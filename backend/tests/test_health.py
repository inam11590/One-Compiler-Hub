"""Test Health and System Endpoints."""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_root_endpoint(client: AsyncClient):
    response = await client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "OneCompilerHub Execution API"
    assert "version" in data
    assert data["docs_url"] == "/docs"


@pytest.mark.asyncio
async def test_health_endpoint(client: AsyncClient):
    response = await client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "capabilities" in data
    assert data["capabilities"]["execution_submission_enabled"] is False
    assert data["capabilities"]["sandbox_mode"] == "disabled"
    assert data["capabilities"]["max_source_code_bytes"] == 65536
