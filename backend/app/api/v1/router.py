"""OneCompilerHub Backend - API v1 Router."""

from fastapi import APIRouter
from app.api.v1.endpoints import executions, health, languages

api_v1_router = APIRouter()

api_v1_router.include_router(health.router)
api_v1_router.include_router(languages.router)
api_v1_router.include_router(executions.router)
