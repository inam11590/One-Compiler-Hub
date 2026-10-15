"""OneCompilerHub Backend - FastAPI Application Entrypoint."""

from contextlib import asynccontextmanager
from typing import AsyncGenerator
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.api.v1.router import api_v1_router
from app.core.config import settings
from app.core.logging import logger, log_security_event


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifecycle events."""
    logger.info(
        f"Starting {settings.PROJECT_NAME} v{settings.VERSION} [{settings.ENVIRONMENT}] - Execution Enabled: {settings.EXECUTION_ENABLED}"
    )
    yield
    logger.info(f"Shutting down {settings.PROJECT_NAME}")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Execution backend foundation and sandbox architecture for OneCompilerHub.",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# CORS Middleware with strict origin validation
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=r"^https://([a-zA-Z0-9_-]+\.)*vercel\.app$",
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
    max_age=86400,
)


# Global Exception Handler for validation errors
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    errors = exc.errors()
    first_error = errors[0] if errors else {}
    msg = first_error.get("msg", "Invalid request payload.")
    field = ".".join(str(loc) for loc in first_error.get("loc", []))

    log_security_event(
        event="VALIDATION_ERROR",
        message=f"Request validation failure on {request.url.path}: {msg}",
        client_ip=request.client.host if request.client else None,
        extra={"field": field},
    )

    safe_details = [
        {
            "loc": [str(loc_item) for loc_item in err.get("loc", [])],
            "msg": str(err.get("msg", "")),
            "type": str(err.get("type", "")),
        }
        for err in errors
    ]

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": {
                "code": "validation_error",
                "message": msg,
                "field": field,
                "details": safe_details,
            }
        },
    )


# Root endpoint
@app.get("/", tags=["System"])
async def root():
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "docs_url": "/docs",
        "api_v1": "/api/v1/health",
    }


# Include versioned API v1 Router
app.include_router(api_v1_router, prefix=settings.API_V1_STR)
