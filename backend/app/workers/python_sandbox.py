"""OneCompilerHub Backend - Real Python Sandboxed Execution Worker.

Implements secure, isolated execution of untrusted user-submitted Python code:
- Standalone execution worker boundary
- Zero-secret environment scrubbing (Supabase, DB, API credentials stripped)
- Operating system resource limits (RLIMIT_CPU, RLIMIT_AS, RLIMIT_NPROC, RLIMIT_FSIZE)
- Wall-clock timeout monitoring with process group termination
- Pre-supplied standard input streaming
- Exact stdout, stderr, exit code, and execution duration capture
- Ephemeral workspace isolation with guaranteed filesystem cleanup
"""

import asyncio
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import shutil
import sys
import tempfile
from typing import Dict, Optional

from app.core.config import settings
from app.core.constants import (
    DEFAULT_EXECUTION_TIMEOUT_SECONDS,
    ExecutionStatus,
    MAX_SOURCE_CODE_BYTES,
    MAX_STDIN_BYTES,
)
from app.core.logging import logger, log_security_event
from app.models.execution import ExecutionJob
from app.workers.base import BaseExecutionWorker

# Path to the standalone sandbox runner script
RUNNER_SCRIPT = str(Path(__file__).parent / "sandbox_runner.py")


class PythonSandboxWorker(BaseExecutionWorker):
    """Secure, isolated Python 3 execution worker."""

    def __init__(self, worker_id: str = "py-sandbox-worker-01") -> None:
        self._worker_id = worker_id
        self._active_processes: Dict[str, asyncio.subprocess.Process] = {}
        self._cancelled_jobs = set()

    @property
    def worker_id(self) -> str:
        return self._worker_id

    async def is_healthy(self) -> bool:
        """Verifies Python interpreter and runner readiness."""
        return os.path.isfile(RUNNER_SCRIPT) and os.access(sys.executable, os.X_OK)

    async def execute(self, job: ExecutionJob) -> ExecutionJob:
        """Executes a Python job in an isolated sandbox."""
        if job.language != "python":
            job.status = ExecutionStatus.FAILED
            job.exit_code = 1
            job.stderr = f"PythonSandboxWorker cannot execute language '{job.language}'."
            job.completed_at = datetime.now(timezone.utc)
            return job

        # Check early cancellation
        if job.id in self._cancelled_jobs:
            job.status = ExecutionStatus.CANCELLED
            job.completed_at = datetime.now(timezone.utc)
            job.error = "Execution was cancelled by client before dispatch."
            return job

        job.started_at = datetime.now(timezone.utc)
        job.status = ExecutionStatus.RUNNING

        # Create ephemeral temporary scratch workspace
        temp_dir = tempfile.mkdtemp(prefix="och_py_")
        code_file = os.path.join(temp_dir, "main.py")
        stdin_file = os.path.join(temp_dir, "stdin.txt") if job.stdin else None
        output_file = os.path.join(temp_dir, "result.json")

        try:
            # 1. Write user source code
            with open(code_file, "w", encoding="utf-8") as f:
                f.write(job.source_code)

            # 2. Write optional stdin
            if job.stdin and stdin_file:
                with open(stdin_file, "w", encoding="utf-8") as f:
                    f.write(job.stdin)

            # 3. Build runner command
            timeout_sec = DEFAULT_EXECUTION_TIMEOUT_SECONDS
            cmd = [
                sys.executable,
                RUNNER_SCRIPT,
                "--code-file",
                code_file,
                "--output-file",
                output_file,
                "--timeout",
                str(timeout_sec),
                "--memory-mb",
                "128",
            ]
            if stdin_file:
                cmd.extend(["--stdin-file", stdin_file])

            # 4. Launch isolated runner process
            proc = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
            )

            self._active_processes[job.id] = proc

            try:
                # Add grace period over the internal timeout for process startup/teardown
                await asyncio.wait_for(proc.wait(), timeout=timeout_sec + 3.0)
            except asyncio.TimeoutError:
                # Outer watchdog timeout
                try:
                    proc.kill()
                    await proc.wait()
                except Exception:
                    pass

            finally:
                self._active_processes.pop(job.id, None)

            # Check if job was cancelled during execution
            if job.id in self._cancelled_jobs:
                job.status = ExecutionStatus.CANCELLED
                job.completed_at = datetime.now(timezone.utc)
                job.error = "Execution was cancelled by client."
                return job

            # 5. Read structured runner output
            if os.path.isfile(output_file):
                try:
                    with open(output_file, "r", encoding="utf-8") as out:
                        res_data = json.load(out)

                    job.stdout = res_data.get("stdout", "")
                    job.stderr = res_data.get("stderr", "")
                    job.exit_code = res_data.get("exit_code")
                    job.duration_ms = res_data.get("duration_ms")
                    job.completed_at = datetime.now(timezone.utc)

                    if res_data.get("timed_out"):
                        job.status = ExecutionStatus.TIMED_OUT
                        job.error = res_data.get("error", "Execution timed out.")
                    elif job.exit_code == 0:
                        job.status = ExecutionStatus.COMPLETED
                    else:
                        job.status = ExecutionStatus.FAILED
                        job.error = res_data.get("error") or f"Process exited with non-zero code {job.exit_code}."

                except Exception as parse_err:
                    job.status = ExecutionStatus.FAILED
                    job.exit_code = 1
                    job.stderr = f"Failed to parse execution output: {str(parse_err)}"
                    job.completed_at = datetime.now(timezone.utc)
            else:
                job.status = ExecutionStatus.FAILED
                job.exit_code = 1
                job.stderr = "Execution runner terminated unexpectedly with no output generated."
                job.completed_at = datetime.now(timezone.utc)

        except Exception as exc:
            logger.error(f"Error during sandboxed execution of job {job.id}: {str(exc)}", exc_info=True)
            job.status = ExecutionStatus.FAILED
            job.exit_code = 1
            job.stderr = f"Sandbox execution failure: {str(exc)}"
            job.completed_at = datetime.now(timezone.utc)

        finally:
            # 6. Guaranteed workspace filesystem cleanup
            try:
                shutil.rmtree(temp_dir, ignore_errors=True)
            except Exception:
                pass

        job.is_sandboxed = True
        return job

    async def cancel(self, job_id: str) -> bool:
        """Terminates an active execution process."""
        self._cancelled_jobs.add(job_id)
        proc = self._active_processes.get(job_id)
        if proc:
            try:
                proc.kill()
                return True
            except ProcessLookupError:
                return True
            except Exception as e:
                logger.warning(f"Error terminating job process {job_id}: {str(e)}")
                return False
        return True
