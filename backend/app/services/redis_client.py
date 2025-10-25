from __future__ import annotations

from typing import Optional

import redis

from app.core.settings import settings

_redis_client: Optional[redis.Redis] = None


def get_redis() -> Optional[redis.Redis]:
    global _redis_client
    if _redis_client is not None:
        return _redis_client
    if not settings.redis_url:
        return None
    try:
        _redis_client = redis.from_url(settings.redis_url, decode_responses=True)
        # Ping to ensure connectivity; ignore errors and fallback to None
        _redis_client.ping()
        return _redis_client
    except Exception:
        return None
