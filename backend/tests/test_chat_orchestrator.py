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
    inv = InventoryItem(
        id=1,
        tenant_id="tenantA",
        medicine_id=1,
        quantity=50,
        reorder_level=20,
        branch="Main",
        expiry_date=None,
    )
    db_session.add(inv)
    low_branch = InventoryItem(
        id=2,
        tenant_id="tenantA",
        medicine_id=1,
        quantity=10,
        reorder_level=25,
        branch="Branch A",
        expiry_date=None,
    )
    db_session.add(low_branch)
    expiring = InventoryItem(
        id=3,
        tenant_id="tenantA",
        medicine_id=1,
        quantity=5,
        reorder_level=5,
        branch="Main",
        expiry_date=date.today() + timedelta(days=15),
    )
    db_session.add(expiring)

    cashier = User(
        id=99,
        tenant_id="tenantA",
        email="cashier@example.com",
        password_hash="hash",
        role="cashier",
    )
    db_session.add(cashier)

    sale = Sale(
        id=1,
        tenant_id="tenantA",
        cashier_user_id=99,
        customer_id=200,
        branch="Main",
        total_amount=120.0,
        discount_amount=5.0,
        created_at=datetime.utcnow() - timedelta(days=1),
    )
    db_session.add(sale)
    sale_item = SaleItem(id=1, sale_id=1, medicine_id=1, quantity=5, line_total=50.0)
    db_session.add(sale_item)
    refund_sale = Sale(
        id=2,
        tenant_id="tenantA",
        cashier_user_id=99,
        branch="Branch A",
        total_amount=-20.0,
        discount_amount=0.0,
        created_at=datetime.utcnow() - timedelta(days=2),
    )
    db_session.add(refund_sale)
    repeat_customer = User(
        id=200,
        tenant_id="tenantA",
        email="customer@example.com",
        password_hash="hash",
        role="customer",
    )
    db_session.add(repeat_customer)
    frequent_sale = Sale(
        id=3,
        tenant_id="tenantA",
        cashier_user_id=99,
        customer_id=200,
        branch="Main",
        total_amount=80.0,
        discount_amount=2.0,
        created_at=datetime.utcnow() - timedelta(days=3),
    )
    db_session.add(frequent_sale)
    sale_item_repeat = SaleItem(id=2, sale_id=3, medicine_id=1, quantity=3, line_total=45.0)
    db_session.add(sale_item_repeat)

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


def test_low_stock_by_branch(db_session: Session, seeded_thread: ChatThread):
    result = _call_process(db_session, "Which branches have low stock right now?")
    assert result["intent"] == "low_stock_by_branch"
    assert any(row["branch"] == "Branch A" for row in result["rows"])
    assert "Branch stock alerts" in result["answer"]


def test_expiring_lots(db_session: Session, seeded_thread: ChatThread):
    result = _call_process(db_session, "List medicines expiring soon")
    assert result["intent"] == "expiring_lots"
    assert any(row["expiry_date"] is not None for row in result["rows"])
    assert "expiring" in result["answer"].lower()


def test_supplier_restock(db_session: Session, seeded_thread: ChatThread):
    result = _call_process(db_session, "Give supplier restock suggestions")
    assert result["intent"] == "supplier_restock"
    assert any(row["suggested_order"] >= 0 for row in result["rows"])
    assert "Restock suggestions" in result["answer"]


def test_refund_summary(db_session: Session, seeded_thread: ChatThread):
    result = _call_process(db_session, "Show refunds from the last month")
    assert result["intent"] == "refund_summary"
    assert any(row["refund_value"] > 0 for row in result["rows"])
    assert "Refund activity" in result["answer"]


def test_discount_impact(db_session: Session, seeded_thread: ChatThread):
    result = _call_process(db_session, "How are discounts impacting revenue?")
    assert result["intent"] == "discount_impact"
    assert any("total_discounts" in row for row in result["rows"])
    assert "Discounts" in result["answer"]


def test_customer_frequency(db_session: Session, seeded_thread: ChatThread):
    result = _call_process(db_session, "Who are our most frequent customers?")
    assert result["intent"] == "customer_frequency"
    assert any(row["orders"] >= 1 for row in result["rows"])
    assert "repeat customer" in result["answer"].lower()
