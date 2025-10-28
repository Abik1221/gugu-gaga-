import json
import pytest
from sqlalchemy.orm import Session

from app.core.settings import settings
from app.models.chat import ChatThread
from app.models.medicine import Medicine, InventoryItem
from app.models.sales import Sale, SaleItem
from app.models.user import User
from app.services.chat.orchestrator import process_message


@pytest.fixture()
def seeded_thread(db_session: Session) -> ChatThread:
    thread = ChatThread(id=1, tenant_id="tenantA", owner_user_id=1, title="Test Thread")
    db_session.add(thread)

    # Seed data for analytics queries
    med = Medicine(id=1, tenant_id="tenantA", name="Aspirin")
    db_session.add(med)
    inv = InventoryItem(id=1, tenant_id="tenantA", medicine_id=1, quantity=50)
    db_session.add(inv)

    cashier = User(
        id=99,
        tenant_id="tenantA",
        email="cashier@example.com",
        password_hash="hash",
        role="cashier",
    )
    db_session.add(cashier)

    sale = Sale(id=1, tenant_id="tenantA", cashier_user_id=99, branch="Main", total_amount=120.0)
    db_session.add(sale)
    sale_item = SaleItem(id=1, sale_id=1, medicine_id=1, quantity=5, line_total=50.0)
    db_session.add(sale_item)

    db_session.commit()
    return thread


def _call_process(db_session: Session, prompt: str, *, tenant: str = "tenantA") -> dict:
    result = process_message(
        db_session,
        tenant_id=tenant,
        user_id=1,
        thread_id=1,
        prompt=prompt,
    )
    assert isinstance(result, dict)
    return result


def test_inventory_total_query(db_session: Session, seeded_thread: ChatThread):
    result = _call_process(db_session, "How many products do I have in stock?")
    assert result["intent"] == "inventory_total"
    assert result["rows"][0]["total_quantity"] == 50
    assert "answer" in result and "50" in result["answer"]


def test_out_of_scope_prompt_returns_message(db_session: Session, seeded_thread: ChatThread):
    result = _call_process(db_session, "What is the weather today?")
    assert result["intent"] == "out_of_scope"
    assert result["answer"].lower().startswith("sorry")
    assert "rows" not in result


def test_unsafe_sql_fallback(db_session: Session, seeded_thread: ChatThread, monkeypatch):
    def fake_run(*args, **kwargs):
        return {"sql": "DELETE FROM sales", "intent": "auto"}

    monkeypatch.setattr("app.services.chat.orchestrator.RealLangGraphOrchestrator.run", fake_run)
    monkeypatch.setattr(settings, "use_langgraph", True, raising=False)

    result = _call_process(db_session, "Show daily revenue trend")
    # Should fall back to heuristic safe query and intent
    assert result["intent"] == "daily_revenue_trend"
    assert all("DELETE" not in json.dumps(row) for row in result.get("rows", []))


def test_branch_performance_query(db_session: Session, seeded_thread: ChatThread):
    result = _call_process(db_session, "Compare branch performance")
    assert result["intent"] == "branch_performance"
    assert result["rows"][0]["branch"] == "Main"


def test_missing_tenant_filter_is_blocked(db_session: Session, seeded_thread: ChatThread, monkeypatch):
    def bad_sql(*args, **kwargs):
        return {"sql": "SELECT * FROM sales", "intent": "auto"}

    monkeypatch.setattr("app.services.chat.orchestrator.RealLangGraphOrchestrator.run", bad_sql)
    monkeypatch.setattr(settings, "use_langgraph", True, raising=False)

    result = _call_process(db_session, "Show sales data")
    assert result["answer"].startswith("Query rejected")
