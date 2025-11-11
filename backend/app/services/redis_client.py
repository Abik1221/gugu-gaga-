from __future__ import annotations

from typing import Optional

import redis

from app.core.settings import settings

_redis_client: Optional[redis.Redis | bool] = None


def get_redis() -> Optional[redis.Redis]:
    # Disable Redis entirely for performance
    return None
