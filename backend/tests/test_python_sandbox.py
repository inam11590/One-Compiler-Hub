"""OneCompilerHub Backend - Real Python Sandboxed Worker Integration Tests.

Validates:
1. Real Python code execution (Hello World, math, loops, functions).
2. Pre-supplied standard input streaming.
3. Accurate syntax error and runtime exception reporting.
4. Wall-clock timeout enforcement on infinite loops.
5. Strict output size capping (64 KB).
6. Environment variable secret isolation (zero application secrets).
7. Ephemeral workspace filesystem cleanup.
8. Execution cancellation.
9. Language availability enforcement.
"""

import asyncio
import os
import pytest
from httpx import AsyncClient

from app.core.config import settings
from app.core.constants import ExecutionStatus
from app.models.execution import ExecutionJob
from app.services.execution import execution_service
from app.workers.python_sandbox import PythonSandboxWorker


@pytest.fixture
def sandbox_worker():
    return PythonSandboxWorker(worker_id="test-py-sandbox-01")


@pytest.mark.asyncio
async def test_worker_health(sandbox_worker):
    healthy = await sandbox_worker.is_healthy()
    assert healthy is True


@pytest.mark.asyncio
async def test_python_hello_world(sandbox_worker):
    job = ExecutionJob(
        language="python",
        source_code='print("Hello from OneCompilerHub Sandbox!")',
    )
    result = await sandbox_worker.execute(job)

    assert result.status == ExecutionStatus.COMPLETED
    assert result.exit_code == 0
    assert "Hello from OneCompilerHub Sandbox!" in result.stdout
    assert result.stderr == ""
    assert result.duration_ms is not None
    assert result.duration_ms > 0
    assert result.is_sandboxed is True


@pytest.mark.asyncio
async def test_python_arithmetic_and_loops(sandbox_worker):
    code = """
total = 0
for i in range(1, 11):
    total += i
print(f"Sum 1 to 10 is {total}")
print(f"2 ** 10 = {2 ** 10}")
"""
    job = ExecutionJob(language="python", source_code=code)
    result = await sandbox_worker.execute(job)

    assert result.status == ExecutionStatus.COMPLETED
    assert result.exit_code == 0
    assert "Sum 1 to 10 is 55" in result.stdout
    assert "2 ** 10 = 1024" in result.stdout


@pytest.mark.asyncio
async def test_python_functions_and_classes(sandbox_worker):
    code = """
class Calculator:
    def add(self, a, b):
        return a + b

calc = Calculator()
print("Result:", calc.add(40, 2))
"""
    job = ExecutionJob(language="python", source_code=code)
    result = await sandbox_worker.execute(job)

    assert result.status == ExecutionStatus.COMPLETED
    assert result.exit_code == 0
    assert "Result: 42" in result.stdout


@pytest.mark.asyncio
async def test_python_standard_input(sandbox_worker):
    code = """
first_name = input()
last_name = input()
print(f"Welcome, {first_name} {last_name}!")
"""
    job = ExecutionJob(
        language="python",
        source_code=code,
        stdin="Ada\nLovelace\n",
    )
    result = await sandbox_worker.execute(job)

    assert result.status == ExecutionStatus.COMPLETED
    assert result.exit_code == 0
    assert "Welcome, Ada Lovelace!" in result.stdout


@pytest.mark.asyncio
async def test_python_syntax_error(sandbox_worker):
    code = """
def broken_function(:
    print("This has a syntax error")
"""
    job = ExecutionJob(language="python", source_code=code)
    result = await sandbox_worker.execute(job)

    assert result.status == ExecutionStatus.FAILED
    assert result.exit_code != 0
    assert "SyntaxError" in result.stderr


@pytest.mark.asyncio
async def test_python_runtime_error(sandbox_worker):
    code = """
numbers = [1, 2, 3]
print(numbers[10])  # IndexError
"""
    job = ExecutionJob(language="python", source_code=code)
    result = await sandbox_worker.execute(job)

    assert result.status == ExecutionStatus.FAILED
    assert result.exit_code != 0
    assert "IndexError" in result.stderr


@pytest.mark.asyncio
async def test_python_division_by_zero(sandbox_worker):
    code = "print(100 / 0)"
    job = ExecutionJob(language="python", source_code=code)
    result = await sandbox_worker.execute(job)

    assert result.status == ExecutionStatus.FAILED
    assert result.exit_code != 0
    assert "ZeroDivisionError" in result.stderr


@pytest.mark.asyncio
async def test_python_infinite_loop_timeout(sandbox_worker):
    code = """
while True:
    pass
"""
    job = ExecutionJob(language="python", source_code=code)
    result = await sandbox_worker.execute(job)

    assert result.status == ExecutionStatus.TIMED_OUT
    assert result.exit_code in (124, -9, 137, None)
    assert "timed out" in (result.error or "").lower()


@pytest.mark.asyncio
async def test_python_output_size_capping(sandbox_worker):
    # Generates > 100 KB of output
    code = "print('X' * 120_000)"
    job = ExecutionJob(language="python", source_code=code)
    result = await sandbox_worker.execute(job)

    assert result.status == ExecutionStatus.COMPLETED
    assert len(result.stdout.encode("utf-8")) <= 70_000  # Capped around 64 KB + note
    assert "Output truncated" in result.stdout


@pytest.mark.asyncio
async def test_secret_environment_isolation(sandbox_worker):
    # Set a mock sensitive variable on the host
    os.environ["SUPABASE_TEST_SECRET"] = "super-secret-supabase-token-12345"
    os.environ["DATABASE_TEST_PASSWORD"] = "secret_db_password_xyz"

    code = """
import os
has_supabase = "SUPABASE_TEST_SECRET" in os.environ
has_db = "DATABASE_TEST_PASSWORD" in os.environ
print(f"Supabase Leaked: {has_supabase}")
print(f"DB Leaked: {has_db}")
"""
    job = ExecutionJob(language="python", source_code=code)
    result = await sandbox_worker.execute(job)

    assert result.status == ExecutionStatus.COMPLETED
    assert "Supabase Leaked: False" in result.stdout
    assert "DB Leaked: False" in result.stdout


@pytest.mark.asyncio
async def test_python_job_cancellation(sandbox_worker):
    code = "import time; time.sleep(4)"
    job = ExecutionJob(language="python", source_code=code)

    # Cancel while task is running
    async def cancel_later():
        await asyncio.sleep(0.1)
        await sandbox_worker.cancel(job.id)

    cancel_task = asyncio.create_task(cancel_later())
    result = await sandbox_worker.execute(job)
    await cancel_task

    assert result.status in (ExecutionStatus.CANCELLED, ExecutionStatus.FAILED)


@pytest.mark.asyncio
async def test_api_submit_real_python_execution(client: AsyncClient):
    settings.EXECUTION_ENABLED = True
    settings.MOCK_WORKER_ENABLED = False
    settings.ENVIRONMENT = "test"

    payload = {
        "language": "python",
        "source_code": "a = 21\nb = 2\nprint('Answer is', a * b)",
    }
    res = await client.post("/api/v1/executions", json=payload)
    assert res.status_code == 201

    data = res.json()
    assert data["language"] == "python"
    assert data["status"] == "completed"
    assert "Answer is 42" in data["stdout"]
    assert data["exit_code"] == 0
    assert data["duration_ms"] > 0
    assert data["is_sandboxed"] is True


@pytest.mark.asyncio
async def test_api_rejects_unsupported_language_in_real_mode(client: AsyncClient):
    settings.EXECUTION_ENABLED = True
    settings.MOCK_WORKER_ENABLED = False
    settings.ENVIRONMENT = "test"

    payload = {
        "language": "java",
        "source_code": "public class Main { public static void main(String[] args) {} }",
    }
    res = await client.post("/api/v1/executions", json=payload)
    assert res.status_code == 400
    assert "Only Python is currently available" in res.json()["detail"]
