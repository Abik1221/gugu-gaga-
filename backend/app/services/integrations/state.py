from __future__ import annotations

import json
import secrets
import threading
import time
from typing import Any, Dict, Optional

from redis import Redis


class OAuthStateStore:
    """Stores OAuth state tokens securely with TTL support."""

    def __init__(self, redis_client: Optional[Redis], ttl_seconds: int) -> None:
        self._redis = redis_client
        self.ttl_seconds = ttl_seconds
        self._memory: Dict[str, Dict[str, Any]] = {}
        self._lock = threading.Lock()

    def _redis_key(self, token: str) -> str:
        return f"integration:oauth_state:{token}"

    def create_state(self, data: Dict[str, Any]) -> str:
        token = secrets.token_urlsafe(32)
        record = {**data, "expires_at": time.time() + self.ttl_seconds}

        if self._redis:
            self._redis.setex(self._redis_key(token), self.ttl_seconds, json.dumps(record))
        else:
            with self._lock:
                self._prune_locked()
                self._memory[token] = record
        return token

    def consume_state(self, token: str) -> Optional[Dict[str, Any]]:
        if self._redis:
            payload = self._redis.get(self._redis_key(token))
            if payload is None:
                return None
            self._redis.delete(self._redis_key(token))
            try:
                record = json.loads(payload)
            except json.JSONDecodeError:
                return None
            if record.get("expires_at", 0) < time.time():
                return None
            return record

        with self._lock:
            record = self._memory.pop(token, None)
        if not record:
            return None
        if record.get("expires_at", 0) < time.time():
            return None
        return record

    def _prune_locked(self) -> None:
        now = time.time()
        expired = [key for key, value in self._memory.items() if value.get("expires_at", 0) < now]
        for key in expired:
            self._memory.pop(key, None)


_store_instance: Optional[OAuthStateStore] = None
_store_lock = threading.Lock()


def get_oauth_state_store(redis_client: Optional[Redis], ttl_seconds: int) -> OAuthStateStore:
    global _store_instance
    if _store_instance is not None:
        return _store_instance
    with _store_lock:
        if _store_instance is None:
            _store_instance = OAuthStateStore(redis_client, ttl_seconds)
        return _store_instance
