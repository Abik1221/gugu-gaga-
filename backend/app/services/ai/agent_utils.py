from __future__ import annotations

from collections import defaultdict
from datetime import datetime, timedelta, timezone
from typing import Dict, Iterable, List, Optional

from sqlalchemy import func
from sqlalchemy.orm import Session



SUPPORTIVE_KEYWORDS = {
    "worried",
    "concern",
    "anxious",
    "problem",
    "issue",
    "down",
    "stressed",
    "emergency",
}

ROLE_INTENT_MATRIX: Dict[str, Iterable[str]] = {
    "pharmacy_owner": {"auto", "top_selling", "low_stock", "sales_last_7_days", "inventory_health", "monthly_revenue", "daily_revenue", "staff_performance", "inventory_summary", "inventory_low_stock", "inventory_expiring", "inventory_value", "inventory_by_branch", "recent_activity", "business_overview"},
    "owner": {"auto", "top_selling", "low_stock", "sales_last_7_days", "inventory_health", "monthly_revenue", "daily_revenue", "staff_performance", "inventory_summary", "inventory_low_stock", "inventory_expiring", "inventory_value", "inventory_by_branch", "recent_activity", "business_overview"},
    "admin": {"auto", "sales_last_7_days", "staff_performance", "monthly_revenue", "daily_revenue"},
    "cashier": {"auto", "top_selling", "sales_last_7_days", "recent_activity"},
    "staff": {"auto", "top_selling", "sales_last_7_days", "recent_activity"},
}


def build_sentiment_prefix(prompt: str) -> str:
    lowered = prompt.lower()
    if any(keyword in lowered for keyword in SUPPORTIVE_KEYWORDS):
        return (
            "I can see this matters for your pharmacy's performance. "
            "Here’s what I found and how we can steady things. "
        )
    return ""


def intent_allowed(intent: str, user_role: str) -> bool:
    normalized_role = (user_role or "").lower()
    allowed = set(ROLE_INTENT_MATRIX.get(normalized_role, {"auto"}))
    # Always allow auto intent which is the generic fallback
    allowed.add("auto")
    return intent in allowed





def summarize_operations(db: Session, tenant_id: str) -> Dict[str, object]:
    now = datetime.now(timezone.utc)
    return {
        "recent_syncs": {},
        "tokens_expiring": [],
        "recent_failures": [],
        "ready_checks": {"queue_depth": 0, "in_progress": 0},
        "insight_generated_at": now.isoformat(),
    }


def build_provenance(intent: str, tenant_id: str, metadata: Optional[dict] = None) -> Dict[str, object]:
    provenance = {
        "intent": intent,
        "tenant_id": tenant_id,
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }
    if metadata:
        provenance["metadata"] = metadata
    return provenance


def merge_answer_with_preface(answer: str, preface: str) -> str:
    if not preface:
        return answer
    return f"{preface}{answer}" if not answer.startswith(preface) else answer
