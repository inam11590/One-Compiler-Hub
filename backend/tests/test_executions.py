"""Test Executions Endpoints and Execution Service."""

import pytest
from httpx import AsyncClient
from app.core.config import settings
from app.core.constants import ExecutionStatus


@pytest.mark.asyncio
async def test_execution_disabled_by_default_returns_503(client: AsyncClient):
    """Verifies that public code submission is strictly disabled (Step 5 security requirement)."""
    settings.EXECUTION_ENABLED = False

    payload = {
        "language": "python",
        "source_code": "print('hello world')",
    }
    response = await client.post("/api/v1/executions", json=payload)
    assert response.status_code == 503
    data = response.json()
    assert "disabled" in data["detail"].lower()


@pytest.mark.asyncio
async def test_unsupported_language_returns_400(client: AsyncClient):
    settings.EXECUTION_ENABLED = True

    payload = {
        "language": "unsupported_brainfuck",
        "source_code": "++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]",
    }
    response = await client.post("/api/v1/executions", json=payload)
    assert response.status_code == 400
    data = response.json()
    assert "unsupported language identifier" in data["detail"].lower()


@pytest.mark.asyncio
async def test_oversized_source_code_rejected(client: AsyncClient):
    settings.EXECUTION_ENABLED = True

    # 65,537 bytes (> 64 KB limit)
    oversized_code = "a = 1\n" * 15000
    payload = {
        "language": "python",
        "source_code": oversized_code,
    }
    response = await client.post("/api/v1/executions", json=payload)
    assert response.status_code == 422
    data = response.json()
    assert data["error"]["code"] == "validation_error"


@pytest.mark.asyncio
async def test_empty_source_code_rejected(client: AsyncClient):
    settings.EXECUTION_ENABLED = True

    payload = {
        "language": "python",
        "source_code": "   ",
    }
    response = await client.post("/api/v1/executions", json=payload)
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_execution_in_test_environment_with_mock_worker(client: AsyncClient):
    """Verifies test environment execution flow with mock adapter."""
    settings.EXECUTION_ENABLED = True
    settings.MOCK_WORKER_ENABLED = True
    settings.ENVIRONMENT = "test"

    payload = {
        "language": "python",
        "source_code": "print('OneCompilerHub')",
        "stdin": "sample input",
        "client_request_id": "test-req-123",
    }
    response = await client.post("/api/v1/executions", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["status"] == ExecutionStatus.COMPLETED
    assert data["language"] == "python"
    assert data["exit_code"] == 0
    assert "Mock output for python" in data["stdout"]
    assert "Echo stdin: sample input" in data["stdout"]
    assert data["client_request_id"] == "test-req-123"

    # Status lookup
    job_id = data["id"]
    status_res = await client.get(f"/api/v1/executions/{job_id}")
    assert status_res.status_code == 200
    assert status_res.json()["id"] == job_id


@pytest.mark.asyncio
async def test_execution_cancellation_contract(client: AsyncClient):
    settings.EXECUTION_ENABLED = True
    settings.MOCK_WORKER_ENABLED = True
    settings.ENVIRONMENT = "test"

    # Submit job
    payload = {
        "language": "c",
        "source_code": "int main() { return 0; }",
    }
    post_res = await client.post("/api/v1/executions", json=payload)
    job_id = post_res.json()["id"]

    # In mock, job completes immediately, so cancelling completed job should return 400
    cancel_res = await client.post(f"/api/v1/executions/{job_id}/cancel")
    assert cancel_res.status_code == 400
    assert "terminal state" in cancel_res.json()["detail"].lower()


@pytest.mark.asyncio
async def test_execution_not_found_returns_404(client: AsyncClient):
    response = await client.get("/api/v1/executions/non-existent-uuid-999")
    assert response.status_code == 404
