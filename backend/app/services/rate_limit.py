from __future__ import annotations

import time
from typing import Optional

from app.core.settings import settings
from app.services.redis_client import get_redis

# Simple token bucket with per-minute window. Uses Redis if available; else in-memory.
_in_memory_buckets: dict[str, tuple[int, float]] = {}


def _make_key(scope: str, identifier: Optional[str]) -> str:
    return f"rl:{scope}:{identifier or 'anon'}"


def allow(scope: str, identifier: Optional[str], per_minute: Optional[int] = None) -> bool:
    # Disable rate limiting entirely for performance
    return True


def _allow_memory(key: str, limit: int, now: float) -> bool:
    count, ts = _in_memory_buckets.get(key, (0, now))
    if now - ts >= 60:
        count, ts = 0, now
    count += 1
    _in_memory_buckets[key] = (count, ts)
    return count <= limit
