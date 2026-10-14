# OneCompilerHub Backend — Execution API & Sandbox Architecture

Production-ready backend API service for **OneCompilerHub**, built with Python FastAPI, Pydantic v2, and hardened sandbox abstractions.

> **CRITICAL SECURITY STATUS**: In Step 5, public code execution is **disabled by default** (`EXECUTION_ENABLED=false`). Any execution submission returns an explicit `503 Service Unavailable / feature_unavailable` response. Arbitrary code execution will be enabled language-by-language in future steps only after dedicated microVM / gVisor isolation verification.

---

## 1. Architecture Overview

```
                                  +------------------------------------+
                                  |     OneCompilerHub Frontend        |
                                  |     (Next.js 14 on Vercel)         |
                                  +-----------------+------------------+
                                                    |
                                          HTTPS / REST API (JWT)
                                                    |
                                                    v
                                  +------------------------------------+
                                  |     FastAPI Backend API Gateway     |
                                  |  - Supabase JWT Verification       |
                                  |  - Sliding-Window Rate Limiting    |
                                  |  - Language Registry (18 Tools)    |
                                  |  - Payload Size Validation         |
                                  +-----------------+------------------+
                                                    |
                                            Async Job Queue
                                                    |
                                                    v
                         =======================================================
                         [ISOLATION BOUNDARY: gVisor / Firecracker microVMs]
                         =======================================================
                                                    |
                                  +-----------------+------------------+
                                  |   Dedicated Execution Workers      |
                                  |   (Non-root uid 10001, cgroups v2, |
                                  |    Read-only root, No Net, No IMDS)|
                                  +------------------------------------+
```

### Key Principles
- **No In-Process Execution**: The API process **never** runs user code using `subprocess`, `os.system`, `eval`, or `exec`.
- **Worker Isolation**: Untrusted code runs in isolated worker pools backed by microVMs (AWS Firecracker) or user-space kernels (gVisor runsc).
- **Zero Secret Exposure**: Workers have no access to Supabase service-role keys, backend secrets, database connection strings, or cloud metadata endpoints (`169.254.169.254`).
- **No Workers on Vercel**: Execution workers cannot safely run on serverless platforms like Vercel because multi-tenant serverless lacks kernel-level isolation guarantees.

---

## 2. API Endpoints

All endpoints are versioned under `/api/v1`:

| Method | Path | Description | Auth Required | Production Status |
|---|---|---|---|---|
| `GET` | `/api/v1/health` | Service health, version, isolation status | No | Enabled |
| `GET` | `/api/v1/languages` | Complete registry of all 18 supported tools | No | Enabled |
| `POST` | `/api/v1/executions` | Submit execution job (rate-limited) | Optional (Bearer JWT) | **Disabled** (503) |
| `GET` | `/api/v1/executions/{id}` | Query execution status & results | Authorization check | Enabled (for valid jobs) |
| `POST` | `/api/v1/executions/{id}/cancel` | Cancel queued or running execution | Job Owner Only | Enabled |

### Error Codes
- `feature_unavailable`: Feature disabled pending security sandbox rollout (HTTP 503)
- `validation_error`: Input payload failed schema or size limits (HTTP 422)
- `rate_limit_exceeded`: Rate limit threshold exceeded (HTTP 429)
- `unauthorized`: Invalid or expired JWT token (HTTP 401)
- `forbidden`: Attempting to inspect or cancel another user's execution (HTTP 403)
- `not_found`: Execution ID not found or expired (HTTP 404)

---

## 3. Local Development Setup

### Prerequisites
- Python 3.9+ (Python 3.12 recommended)
- `pip` and `virtualenv`

### Quick Start
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # macOS / Linux
# or .\venv\Scripts\activate on Windows

# Install pinned dependencies
pip install -r requirements.txt

# Copy environment template
cp .env.example .env

# Run development server with auto-reload
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at:
- Documentation (Swagger UI): `http://localhost:8000/docs`
- Health check: `http://localhost:8000/api/v1/health`
- Languages: `http://localhost:8000/api/v1/languages`

---

## 4. Testing & Code Quality

### Running Tests
The test suite includes 23 unit and integration tests covering safety controls, JWT authentication, rate limiting, and execution contracts:

```bash
# Run all tests with pytest
pytest tests

# Run tests with verbose output
pytest -v tests
```

### Running Linter
```bash
# Run Ruff linting
ruff check .
```

---

## 5. Docker Deployment

Build and run the non-root containerized API service:

```bash
# Build Docker image
docker build -t onecompilerhub-backend:latest .

# Run container (port 8000)
docker run -p 8000:8000 --rm \
  -e ENVIRONMENT=production \
  -e EXECUTION_ENABLED=false \
  onecompilerhub-backend:latest
```

The container runs as non-root user `appuser` (`uid=10001`) with read-only root security configuration and built-in healthcheck.

---

## 6. Sandbox Security Specification

For detailed security threat modeling, isolation layers (L1–L7), and deployment patterns, consult:
[`docs/SANDBOX_SECURITY_SPEC.md`](./docs/SANDBOX_SECURITY_SPEC.md)
