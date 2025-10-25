from __future__ import annotations

from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import datetime, timedelta


def _approx_tokens(s: str) -> int:
    if not s:
        return 0
    # crude approx: 4 chars ~ 1 token
    return max(1, (len(s) + 3) // 4)


def record_ai_usage(
    db: Session,
    *,
    tenant_id: Optional[str],
    user_id: Optional[int],
    thread_id: Optional[int],
    prompt_text: str,
    completion_text: str,
    model: str,
) -> dict:
    prompt_tokens = _approx_tokens(prompt_text)
    completion_tokens = _approx_tokens(completion_text)
    total_tokens = prompt_tokens + completion_tokens

    # Ensure table exists (works on Postgres, SQLite)
    db.execute(
        text(
            """
            CREATE TABLE IF NOT EXISTS ai_usage (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              tenant_id VARCHAR(64),
              user_id INTEGER,
              thread_id INTEGER,
              model VARCHAR(64),
              prompt_tokens INTEGER NOT NULL,
              completion_tokens INTEGER NOT NULL,
              total_tokens INTEGER NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
    )
    db.execute(
        text(
            """
            INSERT INTO ai_usage (tenant_id, user_id, thread_id, model, prompt_tokens, completion_tokens, total_tokens)
            VALUES (:tenant_id, :user_id, :thread_id, :model, :pt, :ct, :tt)
            """
        ),
        {
            "tenant_id": tenant_id,
            "user_id": user_id,
            "thread_id": thread_id,
            "model": model,
            "pt": prompt_tokens,
            "ct": completion_tokens,
            "tt": total_tokens,
        },
    )
    db.commit()
    return {
        "model": model,
        "prompt_tokens": prompt_tokens,
        "completion_tokens": completion_tokens,
        "total_tokens": total_tokens,
    }


def get_usage_summary(db: Session, *, tenant_id: Optional[str], days: int = 30) -> list[dict]:
    # summarize by day
    cutoff = datetime.utcnow() - timedelta(days=days)
    q = text(
        """
        SELECT DATE(created_at) AS day, SUM(total_tokens) AS tokens
        FROM ai_usage
        WHERE (:tenant_id IS NULL OR tenant_id = :tenant_id)
          AND created_at >= :cutoff
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at)
        """
    )
    rows = db.execute(q, {"tenant_id": tenant_id, "cutoff": cutoff}).fetchall()
    result: list[dict] = []
    for r in rows:
        d = getattr(r, "day", None) if hasattr(r, "day") else r[0]
        t = getattr(r, "tokens", 0) if hasattr(r, "tokens") else r[1]
        result.append({"day": str(d), "tokens": int(t or 0)})
    return result
