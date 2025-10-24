from __future__ import annotations

import time
from typing import Optional

from app.core.settings import settings
from app.services.redis_client import get_redis

# Simple token bucket with per-minute window. Uses Redis if available; else in-memory.
_in_memory_buckets: dict[str, tuple[int, float]] = {}


def _make_key(scope: str, identifier: Optional[str]) -> str:
    return f"rl:{scope}:{identifier or 'anon'}"


def allow(scope: str, identifier: Optional[str], limit_per_minute: Optional[int] = None) -> bool:
    limit = limit_per_minute or settings.rate_limit_general_per_minute
    now = time.time()

    r = get_redis()
    key = _make_key(scope, identifier)
    if r:
        # Use Redis INCR with TTL to count within a rolling minute window
        with r.pipeline() as pipe:
            try:
                pipe.incr(key, 1)
                pipe.expire(key, 60)
                count, _ = pipe.execute()
            except Exception:
                # Fallback to memory on error
                return _allow_memory(key, limit, now)
        return int(count) <= int(limit)

    return _allow_memory(key, limit, now)


def _allow_memory(key: str, limit: int, now: float) -> bool:
    count, ts = _in_memory_buckets.get(key, (0, now))
    if now - ts >= 60:
        count, ts = 0, now
    count += 1
    _in_memory_buckets[key] = (count, ts)
    return count <= limit
