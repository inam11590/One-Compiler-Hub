"""OneCompilerHub Backend - Languages API Endpoint."""

from fastapi import APIRouter
from app.schemas.language import LanguageListResponse
from app.services.registry import language_registry

router = APIRouter()


@router.get("/languages", response_model=LanguageListResponse, tags=["Languages"])
async def list_languages() -> LanguageListResponse:
    """Returns the centralized catalog of all 18 supported programming languages and tools."""
    all_languages = language_registry.get_all()
    return LanguageListResponse(
        total=len(all_languages),
        languages=all_languages,
    )
