from __future__ import annotations

import re
from typing import Any, Dict, Iterable, List


DEFAULT_FORBIDDEN_SQL = (
    "insert",
    "update",
    "delete",
    "drop",
    "alter",
    "create",
    "grant",
    "revoke",
    "truncate",
)


def strip_leading_comments(sql: str) -> str:
    s = sql.lstrip()
    while s.startswith("--") or s.startswith("/*"):
        if s.startswith("--"):
            newline = s.find("\n")
            if newline == -1:
                return ""
            s = s[newline + 1 :].lstrip()
        else:
            end = s.find("*/")
            if end == -1:
                return ""
            s = s[end + 2 :].lstrip()
    return s


def is_safe_sql(sql: str, forbidden_tokens: Iterable[str] | None = None) -> bool:
    stripped = strip_leading_comments(sql)
    if not stripped:
        return False
    s = stripped.strip().lower()
    if not s:
        return False
    if s.startswith("with"):
        if "select" not in s:
            return False
    elif not s.startswith("select"):
        return False
    # Reject multi-statement attempts
    if ";" in s.rstrip(";\n "):
        return False
    tokens = re.findall(r"[a-z_]+", s)
    forbidden = tuple(forbidden_tokens) if forbidden_tokens is not None else DEFAULT_FORBIDDEN_SQL
    return not any(tok in forbidden for tok in tokens)


def rows_to_dicts(rows) -> List[Dict[str, Any]]:
    results: List[Dict[str, Any]] = []
    for row in rows:
        if hasattr(row, "_mapping"):
            results.append(dict(row._mapping))
        else:
            results.append(dict(row))
    return results
