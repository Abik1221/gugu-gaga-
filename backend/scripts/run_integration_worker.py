from __future__ import annotations

import argparse
import json
import logging
import signal
import sys
import time
from contextlib import contextmanager
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Iterator, Tuple

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.integration import IntegrationConnection, IntegrationSyncJob
from app.services.integrations.service import IntegrationService

LOGGER = logging.getLogger("integration.worker")
RUNNING = True


@dataclass
class QueueSnapshot:
    queued: int
    in_progress: int
    failed: int
    unsupported: int


def configure_logging(level: str) -> None:
    logging.basicConfig(level=getattr(logging, level.upper(), logging.INFO), format="%(message)s", stream=sys.stdout)


def emit(event: str, **payload) -> None:
    data = {
        "event": event,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    data.update(payload)
    LOGGER.info(json.dumps(data))


@contextmanager
def session_scope() -> Iterator[Session]:
    session = SessionLocal()
    try:
        yield session
        session.close()
    except Exception:
        session.close()
        raise


def current_queue(session: Session) -> QueueSnapshot:
    status_counts = dict(
        session.query(IntegrationSyncJob.status, func.count(IntegrationSyncJob.id)).group_by(IntegrationSyncJob.status)
    )
    return QueueSnapshot(
        queued=int(status_counts.get("queued", 0)),
        in_progress=int(status_counts.get("in_progress", 0)),
        failed=int(status_counts.get("failed", 0)),
        unsupported=int(status_counts.get("unsupported", 0)),
    )


def process_once(session: Session, counters: dict) -> Tuple[bool, QueueSnapshot]:
    service = IntegrationService(session)
    start = time.perf_counter()
    job_out = service.process_next_job()

    if not job_out:
        session.rollback()
        snapshot = current_queue(session)
        emit("integration.worker.idle", queue_depth=snapshot.queued, in_progress=snapshot.in_progress)
        return False, snapshot

    connection = session.get(IntegrationConnection, job_out.connection_id)
    provider_key = connection.provider.key if connection and connection.provider else None

    duration_ms = int((time.perf_counter() - start) * 1000)
    session.commit()
    snapshot = current_queue(session)

    counters["processed"] += 1
    if job_out.status == "failed":
        counters["failed"] += 1
    if job_out.status == "unsupported":
        counters["unsupported"] += 1

    level = logging.INFO if job_out.status == "completed" else logging.WARNING
    LOGGER.log(
        level,
        json.dumps(
            {
                "event": "integration.job_processed",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "job_id": job_out.id,
                "connection_id": job_out.connection_id,
                "provider_key": provider_key,
                "direction": job_out.direction,
                "resource": job_out.resource,
                "status": job_out.status,
                "duration_ms": duration_ms,
                "queue_depth": snapshot.queued,
                "metrics": {
                    "processed_total": counters["processed"],
                    "failed_total": counters["failed"],
                    "unsupported_total": counters["unsupported"],
                },
            }
        ),
    )
    return True, snapshot


def handle_signal(signum, _frame):
    global RUNNING
    RUNNING = False
    emit("integration.worker.signal", signal=signum)


def run_worker(interval: float, once: bool) -> None:
    counters = {"processed": 0, "failed": 0, "unsupported": 0}
    while RUNNING:
        with session_scope() as session:
            processed, snapshot = process_once(session, counters)

        if once and snapshot.queued == 0:
            break

        if not processed:
            if once:
                break
            time.sleep(interval)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Integration sync worker")
    parser.add_argument("--interval", type=float, default=5.0, help="Seconds to wait between polling when queue is empty")
    parser.add_argument("--once", action="store_true", help="Process pending jobs then exit")
    parser.add_argument("--log-level", default="INFO", help="Logging level (default: INFO)")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    configure_logging(args.log_level)

    signal.signal(signal.SIGINT, handle_signal)
    signal.signal(signal.SIGTERM, handle_signal)

    emit("integration.worker.start", interval=args.interval, mode="once" if args.once else "continuous")

    try:
        run_worker(interval=args.interval, once=args.once)
        emit("integration.worker.stop", reason="shutdown")
    except Exception as exc:  # pragma: no cover - defensive logging
        LOGGER.error(json.dumps({"event": "integration.worker.crash", "error": str(exc)}))
        raise


if __name__ == "__main__":
    main()
