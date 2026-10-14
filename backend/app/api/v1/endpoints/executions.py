"""OneCompilerHub Backend - Executions API Endpoints."""

from typing import Optional
from fastapi import APIRouter, Depends, Request, status
from app.schemas.execution import (
    ExecutionCancelResponse,
    ExecutionCreateRequest,
    ExecutionResponse,
)
from app.security.auth import AuthenticatedUser, get_optional_user
from app.security.rate_limiter import enforce_rate_limit
from app.services.execution import execution_service

router = APIRouter()


@router.post(
    "/executions",
    response_model=ExecutionResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Executions"],
)
async def create_execution(
    request: Request,
    payload: ExecutionCreateRequest,
    user: Optional[AuthenticatedUser] = Depends(get_optional_user),
) -> ExecutionResponse:
    """Submits code for execution.

    In Step 5, code execution is disabled by default in production.
    Returns HTTP 503 Feature Unavailable unless enabled in an isolated test environment.
    """
    # Enforce rate limit
    await enforce_rate_limit(request, user)

    return await execution_service.submit_execution(request=payload, user=user)


@router.get(
    "/executions/{execution_id}",
    response_model=ExecutionResponse,
    tags=["Executions"],
)
async def get_execution_status(
    execution_id: str,
    user: Optional[AuthenticatedUser] = Depends(get_optional_user),
) -> ExecutionResponse:
    """Retrieves execution status, logs, and metrics by execution ID."""
    return await execution_service.get_execution(execution_id=execution_id, user=user)


@router.post(
    "/executions/{execution_id}/cancel",
    response_model=ExecutionCancelResponse,
    tags=["Executions"],
)
async def cancel_execution(
    execution_id: str,
    user: Optional[AuthenticatedUser] = Depends(get_optional_user),
) -> ExecutionCancelResponse:
    """Cancels a queued or currently executing job."""
    return await execution_service.cancel_execution(execution_id=execution_id, user=user)
