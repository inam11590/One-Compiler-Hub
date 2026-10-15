"""OneCompilerHub - Standalone Sandbox Execution Runner.

Executes user-submitted Python code in an isolated child process with:
1. Complete environment variable scrubbing (zero application secrets).
2. Operating system resource limits (RLIMIT_CPU, RLIMIT_AS, RLIMIT_FSIZE, RLIMIT_NPROC).
3. Process group isolation (os.setsid) for clean SIGKILL termination.
4. Wall-clock timeout monitoring.
5. Strict output size capping (64 KB).
6. Non-zero exit code and error capture.
"""

import argparse
import json
import math
import os
import signal
import subprocess
import sys
import time

MAX_OUTPUT_BYTES = 65_536  # 64 KB


def parse_args():
    parser = argparse.ArgumentParser(description="OneCompilerHub Sandbox Runner")
    parser.add_argument("--code-file", required=True, help="Path to Python source file")
    parser.add_argument("--stdin-file", default=None, help="Path to stdin data file")
    parser.add_argument("--output-file", required=True, help="Path to write JSON results")
    parser.add_argument("--timeout", type=float, default=5.0, help="Execution timeout in seconds")
    parser.add_argument("--memory-mb", type=int, default=128, help="Memory limit in megabytes")
    return parser.parse_args()


def get_preexec_fn(timeout_seconds: float, memory_mb: int):
    """Configures operating system limits before executing untrusted code."""

    def preexec():
        # 1. Establish new process group so parent can terminate entire tree
        if hasattr(os, "setsid"):
            os.setsid()

        try:
            import resource

            # CPU time limit in seconds
            cpu_limit = int(math.ceil(timeout_seconds)) + 1
            if hasattr(resource, "RLIMIT_CPU"):
                resource.setrlimit(resource.RLIMIT_CPU, (cpu_limit, cpu_limit + 1))

            # Maximum file size creation (4 MB) to prevent disk filling
            if hasattr(resource, "RLIMIT_FSIZE"):
                max_fsize = 4 * 1024 * 1024
                resource.setrlimit(resource.RLIMIT_FSIZE, (max_fsize, max_fsize))

            # Maximum number of child processes to block fork bombs
            if hasattr(resource, "RLIMIT_NPROC"):
                try:
                    resource.setrlimit(resource.RLIMIT_NPROC, (64, 64))
                except (ValueError, OSError):
                    pass

            # Virtual address space limit (Linux standard)
            # Note: On Darwin/macOS, RLIMIT_AS can block dyld startup, so apply on Linux or with guard
            if sys.platform.startswith("linux") and hasattr(resource, "RLIMIT_AS") and memory_mb > 0:
                mem_bytes = memory_mb * 1024 * 1024
                resource.setrlimit(resource.RLIMIT_AS, (mem_bytes, mem_bytes))

        except Exception:
            # Fall back gracefully if a specific limit cannot be set
            pass

    return preexec


def main():
    args = parse_args()

    # Read optional standard input
    stdin_data = b""
    if args.stdin_file and os.path.isfile(args.stdin_file):
        try:
            with open(args.stdin_file, "rb") as f:
                stdin_data = f.read()
        except Exception:
            stdin_data = b""

    # Prepare zero-secret execution environment
    # Crucial security control: Strip all host environment variables (Supabase, DB, API keys)
    safe_env = {
        "PATH": os.environ.get("PATH", "/usr/local/bin:/usr/bin:/bin"),
        "LANG": "C.UTF-8",
        "LC_ALL": "C.UTF-8",
        "PYTHONUNBUFFERED": "1",
        "PYTHONHASHSEED": "random",
        "PYTHONDONTWRITEBYTECODE": "1",
        "HOME": os.path.dirname(args.code_file),
    }

    start_time = time.perf_counter()
    timed_out = False
    exit_code = None
    stdout_text = ""
    stderr_text = ""
    error_msg = None

    cmd = [sys.executable, "-B", "-u", args.code_file]
    work_dir = os.path.dirname(args.code_file)

    try:
        proc = subprocess.Popen(
            cmd,
            stdin=subprocess.PIPE if stdin_data else subprocess.DEVNULL,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            cwd=work_dir,
            env=safe_env,
            preexec_fn=get_preexec_fn(args.timeout, args.memory_mb),
        )

        try:
            raw_stdout, raw_stderr = proc.communicate(
                input=stdin_data if stdin_data else None,
                timeout=args.timeout,
            )
            exit_code = proc.returncode
        except subprocess.TimeoutExpired:
            timed_out = True
            error_msg = f"Execution timed out after {args.timeout} seconds."
            exit_code = 124

            # Kill entire process group
            try:
                if hasattr(os, "killpg") and hasattr(os, "getpgid"):
                    os.killpg(os.getpgid(proc.pid), signal.SIGKILL)
                else:
                    proc.kill()
            except ProcessLookupError:
                pass

            try:
                raw_stdout, raw_stderr = proc.communicate(timeout=0.5)
            except Exception:
                raw_stdout, raw_stderr = b"", b""

        # Decode output
        stdout_text = raw_stdout.decode("utf-8", errors="replace")
        stderr_text = raw_stderr.decode("utf-8", errors="replace")

        # Cap output size at 64 KB
        if len(stdout_text.encode("utf-8")) > MAX_OUTPUT_BYTES:
            stdout_text = stdout_text[:MAX_OUTPUT_BYTES] + "\n[Output truncated: maximum 64 KB limit exceeded]"

        if len(stderr_text.encode("utf-8")) > MAX_OUTPUT_BYTES:
            stderr_text = stderr_text[:MAX_OUTPUT_BYTES] + "\n[Stderr truncated: maximum 64 KB limit exceeded]"

    except Exception as exc:
        exit_code = 1
        error_msg = f"Failed to execute sandbox process: {str(exc)}"
        stderr_text = str(exc)

    end_time = time.perf_counter()
    duration_ms = round((end_time - start_time) * 1000, 2)

    result = {
        "stdout": stdout_text,
        "stderr": stderr_text,
        "exit_code": exit_code,
        "duration_ms": duration_ms,
        "timed_out": timed_out,
        "error": error_msg,
    }

    with open(args.output_file, "w", encoding="utf-8") as out:
        json.dump(result, out)


if __name__ == "__main__":
    main()
