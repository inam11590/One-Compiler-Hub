"""Test Language Registry and Catalog Endpoints."""

import pytest
from httpx import AsyncClient
from app.services.registry import language_registry


@pytest.mark.asyncio
async def test_list_all_18_languages(client: AsyncClient):
    response = await client.get("/api/v1/languages")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 18
    assert len(data["languages"]) == 18

    # Verify all 18 tools are present
    expected_ids = {
        "html", "python", "javascript", "java", "mysql", "c", "cpp", "php",
        "csharp", "fastapi", "lua", "plsql", "nodejs", "mongodb", "springboot",
        "react", "postgresql", "pygame"
    }
    returned_ids = {lang["id"] for lang in data["languages"]}
    assert expected_ids == returned_ids


def test_registry_distinguishes_execution_modes():
    python = language_registry.get_by_id("python")
    cpp = language_registry.get_by_id("cpp")
    mysql = language_registry.get_by_id("mysql")
    html = language_registry.get_by_id("html")
    fastapi = language_registry.get_by_id("fastapi")

    assert python.execution_mode == "interpreted"
    assert cpp.execution_mode == "compiled"
    assert mysql.execution_mode == "database_query"
    assert html.execution_mode == "browser_preview"
    assert fastapi.execution_mode == "framework"


def test_registry_resource_policies():
    java = language_registry.get_by_id("java")
    lua = language_registry.get_by_id("lua")

    assert java.resource_policy.memory_limit_mb >= 256
    assert lua.resource_policy.memory_limit_mb <= 64
    assert not java.resource_policy.network_enabled  # Network isolation enforced
