"""Test Security Controls: Auth Verification, Authorization, Rate Limiting, and CORS."""

import pytest
from httpx import AsyncClient
from app.core.config import Settings, settings
from app.workers.mock import MockExecutionWorker


@pytest.mark.asyncio
async def test_invalid_jwt_token_rejected(client: AsyncClient):
    settings.EXECUTION_ENABLED = True
    settings.MOCK_WORKER_ENABLED = True
    settings.ENVIRONMENT = "test"

    headers = {"Authorization": "Bearer invalid-garbage-token-xyz"}
    payload = {"language": "python", "source_code": "print(1)"}
    response = await client.post("/api/v1/executions", json=payload, headers=headers)
    assert response.status_code == 401
    assert "invalid" in response.json()["detail"].lower()


@pytest.mark.asyncio
async def test_unauthorized_user_cannot_access_other_users_job(client: AsyncClient):
    """Verifies that User B cannot read User A's private execution record."""
    settings.EXECUTION_ENABLED = True
    settings.MOCK_WORKER_ENABLED = True
    settings.ENVIRONMENT = "test"

    # User A submits code
    user_a_headers = {"Authorization": "Bearer test-token-user-alice"}
    payload = {"language": "python", "source_code": "print('secret of alice')"}
    post_res = await client.post("/api/v1/executions", json=payload, headers=user_a_headers)
    assert post_res.status_code == 201
    job_id = post_res.json()["id"]

    # User B attempts to access Alice's execution
    user_b_headers = {"Authorization": "Bearer test-token-user-bob"}
    get_res_bob = await client.get(f"/api/v1/executions/{job_id}", headers=user_b_headers)
    assert get_res_bob.status_code == 403
    assert "permission" in get_res_bob.json()["detail"].lower()

    # Anonymous user attempts to access Alice's execution
    get_res_anon = await client.get(f"/api/v1/executions/{job_id}")
    assert get_res_anon.status_code == 403

    # Alice can access her own execution
    get_res_alice = await client.get(f"/api/v1/executions/{job_id}", headers=user_a_headers)
    assert get_res_alice.status_code == 200
    assert get_res_alice.json()["id"] == job_id


@pytest.mark.asyncio
async def test_rate_limiting_enforced(client: AsyncClient):
    settings.EXECUTION_ENABLED = True
    settings.MOCK_WORKER_ENABLED = True
    settings.ENVIRONMENT = "test"
    settings.RATE_LIMIT_ANON_PER_MINUTE = 3  # Lower threshold for fast test

    payload = {"language": "python", "source_code": "print(1)"}

    # 3 allowed requests
    for _ in range(3):
        res = await client.post("/api/v1/executions", json=payload)
        assert res.status_code == 201

    # 4th request must be rate limited with HTTP 429
    res_limited = await client.post("/api/v1/executions", json=payload)
    assert res_limited.status_code == 429
    assert "Retry-After" in res_limited.headers
    assert "rate limit exceeded" in res_limited.json()["detail"].lower()


def test_mock_worker_cannot_be_initialized_in_production():
    """Confirms fail-closed protection prevents mock worker execution in production."""
    settings.ENVIRONMENT = "production"
    with pytest.raises(RuntimeError):
        MockExecutionWorker()


def test_settings_validator_prevents_mock_worker_in_production():
    with pytest.raises(ValueError, match="MOCK_WORKER_ENABLED cannot be enabled in production"):
        Settings(ENVIRONMENT="production", MOCK_WORKER_ENABLED=True)


@pytest.mark.asyncio
async def test_cors_preflight_headers(client: AsyncClient):
    headers = {
        "Origin": "https://one-compiler-hub.vercel.app",
        "Access-Control-Request-Method": "POST",
    }
    response = await client.options("/api/v1/executions", headers=headers)
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "https://one-compiler-hub.vercel.app"
