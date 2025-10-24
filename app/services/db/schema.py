from __future__ import annotations

from typing import List

from sqlalchemy import inspect
from sqlalchemy.orm import Session


def schema_overview_string(db: Session) -> str:
    """Return a compact schema overview string (tables and columns) for agent context.
    Works across Postgres/SQLite using SQLAlchemy inspector.
    """
    try:
        inspector = inspect(db.get_bind())
        tables: List[str] = inspector.get_table_names()
        parts: List[str] = []
        for t in sorted(tables):
            try:
                cols = inspector.get_columns(t)
                col_names = ", ".join([c.get("name", "") for c in cols])
                parts.append(f"{t}({col_names})")
            except Exception:
                parts.append(f"{t}(...)" )
        return "; ".join(parts)
    except Exception:
        return ""
