from __future__ import annotations

from collections import defaultdict
from datetime import datetime, timedelta, timezone
from typing import Dict, Iterable, List, Optional

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.integration import (
    IntegrationConnection,
    IntegrationSyncJob,
    IntegrationStagingRecord,
    IntegrationProvider,
)

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
    "pharmacy_owner": {
        "auto",
        "revenue_summary",
        "top_selling",
        "low_stock",
        "inventory_health",
        "branch_performance",
        "inventory_total",
        "sales_last_7_days",
        "staff_count",
        "branch_count",
    },
    "owner": {
        "auto",
        "revenue_summary",
        "top_selling",
        "low_stock",
        "inventory_health",
        "branch_performance",
        "inventory_total",
        "sales_last_7_days",
        "staff_count",
        "branch_count",
    },
    "admin": {
        "auto",
        "revenue_summary",
        "top_selling",
        "low_stock",
        "inventory_health",
        "branch_performance",
        "inventory_total",
        "sales_last_7_days",
        "staff_count",
        "branch_count",
    },
    "cashier": {"auto", "top_selling", "sales_last_7_days"},
    "staff": {"auto", "top_selling", "sales_last_7_days"},
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


def _suggest_action(provider_key: Optional[str], job_status: str) -> Optional[str]:
    if not provider_key:
        return None
    key = provider_key.lower()
    if key == "zoho_books":
        if job_status == "failed":
            return "Retry sync via /api/v1/integrations/{connection_id}/sync or reconnect Zoho Books if tokens expired."
        if job_status == "unsupported":
            return "Review connector capabilities; adjust requested resource before retrying Zoho sync."
    if key == "odoo":
        return "Check Odoo API credentials and rerun sync once resolved."
    if key == "notion":
        return "Validate Notion database permissions and rerun the sync job."
    return None


def summarize_operations(db: Session, tenant_id: str) -> Dict[str, object]:
    now = datetime.now(timezone.utc)
    day_ago = now - timedelta(days=1)

    sync_stats = (
        db.query(
            IntegrationSyncJob.status,
            func.count(IntegrationSyncJob.id)
        )
        .filter(
            IntegrationSyncJob.tenant_id == tenant_id,
            IntegrationSyncJob.created_at >= day_ago,
        )
        .group_by(IntegrationSyncJob.status)
        .all()
    )

    sync_summary: Dict[str, int] = defaultdict(int)
    for status, count in sync_stats:
        sync_summary[str(status)] += int(count)

    queue_depth = (
        db.query(func.count(IntegrationSyncJob.id))
        .filter(
            IntegrationSyncJob.tenant_id == tenant_id,
            IntegrationSyncJob.status == "queued",
        )
        .scalar()
    ) or 0

    in_progress = (
        db.query(func.count(IntegrationSyncJob.id))
        .filter(
            IntegrationSyncJob.tenant_id == tenant_id,
            IntegrationSyncJob.status == "in_progress",
        )
        .scalar()
    ) or 0

    latest_staging = (
        db.query(func.max(IntegrationStagingRecord.created_at))
        .filter(IntegrationStagingRecord.tenant_id == tenant_id)
        .scalar()
    )

    recent_failures = (
        db.query(
            IntegrationSyncJob.id,
            IntegrationSyncJob.connection_id,
            IntegrationSyncJob.resource,
            IntegrationSyncJob.status,
            IntegrationSyncJob.error_message,
            IntegrationSyncJob.finished_at,
            IntegrationConnection.provider_id,
            IntegrationProvider.name,
            IntegrationProvider.key,
        )
        .join(IntegrationConnection, IntegrationSyncJob.connection_id == IntegrationConnection.id)
        .join(IntegrationProvider, IntegrationConnection.provider_id == IntegrationProvider.id)
        .filter(
            IntegrationSyncJob.tenant_id == tenant_id,
            IntegrationSyncJob.status.in_(["failed", "unsupported"]),
        )
        .order_by(
            IntegrationSyncJob.finished_at.desc().nullslast(),
            IntegrationSyncJob.created_at.desc(),
        )
        .limit(5)
        .all()
    )

    failure_payload: List[Dict[str, object]] = []
    for job_id, connection_id, resource, status, error_message, finished_at, provider_id, provider_name, provider_key in recent_failures:
        entry = {
            "job_id": job_id,
            "connection_id": connection_id,
            "provider": provider_name,
            "provider_key": provider_key,
            "resource": resource,
            "status": status,
            "error": error_message,
            "finished_at": finished_at,
        }
        suggested = _suggest_action(provider_key, status)
        if suggested:
            entry["suggested_action"] = suggested.format(connection_id=connection_id)
        failure_payload.append(entry)

    pending_expiring: List[Dict[str, object]] = []
    expiry_cutoff = now + timedelta(days=7)
    connections = (
        db.query(IntegrationConnection)
        .filter(IntegrationConnection.tenant_id == tenant_id)
        .all()
    )
    for conn in connections:
        expiry = conn.token_expiry
        if expiry and expiry <= expiry_cutoff:
            pending_expiring.append(
                {
                    "provider": conn.provider.name if conn.provider else conn.provider_id,
                    "expires_at": expiry,
                }
            )

    ready_checks: Dict[str, object] = {
        "queue_depth": queue_depth,
        "in_progress": in_progress,
    }
    if latest_staging:
        ready_checks["latest_staging_at"] = latest_staging
        ready_checks["staging_lag_minutes"] = max(
            0,
            int((now - latest_staging).total_seconds() // 60),
        )

    return {
        "recent_syncs": dict(sync_summary),
        "tokens_expiring": pending_expiring,
        "recent_failures": failure_payload,
        "ready_checks": ready_checks,
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
