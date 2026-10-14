import pytest
from datetime import datetime, timezone, timedelta
from app.models.execution import ExecutionJob
from app.core.constants import ExecutionStatus
from app.services.queue import InMemoryJobQueue


@pytest.mark.asyncio
async def test_queue_enqueue_and_get():
    queue = InMemoryJobQueue()
    job = ExecutionJob(
        id="job-1",
        language="python",
        source_code="print('test')",
        status=ExecutionStatus.QUEUED,
        user_id="user-123",
    )

    saved_id = await queue.enqueue(job)
    assert saved_id == "job-1"

    retrieved = await queue.get_job("job-1")
    assert retrieved is not None
    assert retrieved.id == "job-1"
    assert retrieved.language == "python"


@pytest.mark.asyncio
async def test_queue_update_status():
    queue = InMemoryJobQueue()
    job = ExecutionJob(
        id="job-2",
        language="javascript",
        source_code="console.log('hi')",
        status=ExecutionStatus.QUEUED,
    )
    await queue.enqueue(job)

    job.status = ExecutionStatus.COMPLETED
    job.stdout = "hi\n"
    job.exit_code = 0
    job.duration_ms = 45.0
    job.completed_at = datetime.now(timezone.utc)
    await queue.update_job(job)

    updated = await queue.get_job("job-2")
    assert updated is not None
    assert updated.status == ExecutionStatus.COMPLETED
    assert updated.stdout == "hi\n"
    assert updated.exit_code == 0
    assert updated.duration_ms == 45.0


@pytest.mark.asyncio
async def test_queue_idempotency_mapping():
    queue = InMemoryJobQueue()
    job1 = ExecutionJob(
        id="job-uuid-1",
        language="c",
        source_code="int main() { return 0; }",
        client_request_id="idemp-key-abc",
    )
    enqueued_id1 = await queue.enqueue(job1)
    assert enqueued_id1 == "job-uuid-1"

    # Enqueue duplicate with same idempotency key
    job2 = ExecutionJob(
        id="job-uuid-2",
        language="c",
        source_code="int main() { return 0; }",
        client_request_id="idemp-key-abc",
    )
    enqueued_id2 = await queue.enqueue(job2)
    assert enqueued_id2 == "job-uuid-1"  # Returns original job ID


@pytest.mark.asyncio
async def test_queue_cancellation():
    queue = InMemoryJobQueue()
    job = ExecutionJob(
        id="job-3",
        language="python",
        source_code="import time; time.sleep(10)",
        status=ExecutionStatus.QUEUED,
    )
    await queue.enqueue(job)

    cancelled = await queue.cancel_job("job-3")
    assert cancelled is True

    fetched = await queue.get_job("job-3")
    assert fetched is not None
    assert fetched.status == ExecutionStatus.CANCELLED

    # Re-cancelling a completed/cancelled job should return False
    cancelled_again = await queue.cancel_job("job-3")
    assert cancelled_again is False


@pytest.mark.asyncio
async def test_queue_ttl_expiration():
    queue = InMemoryJobQueue()
    old_time = datetime.now(timezone.utc) - timedelta(seconds=3700)
    job = ExecutionJob(
        id="job-old",
        language="python",
        source_code="print(1)",
        created_at=old_time,
    )
    await queue.enqueue(job)

    # Should be cleaned up / return None due to TTL > 3600s
    retrieved = await queue.get_job("job-old")
    assert retrieved is None
