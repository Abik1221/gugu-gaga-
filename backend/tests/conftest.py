import os
import tempfile
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.db.session import Base
from app.deps.auth import get_current_user
from app.db.deps import get_db


class DummyUser:
    def __init__(self, id: int, role: str, tenant_id: str | None = None, is_approved: bool = True):
        self.id = id
        self.role = role
        self.tenant_id = tenant_id
        self.is_approved = is_approved


@pytest.fixture(scope="session")
def db_engine():
    # SQLite temp file to persist across connections
    fd, path = tempfile.mkstemp(prefix="zemen_test_", suffix=".db")
    os.close(fd)
    engine = create_engine(f"sqlite:///{path}", connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    yield engine
    try:
        os.remove(path)
    except Exception:
        pass


@pytest.fixture()
def db_session(db_engine):
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=db_engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture()
def client(db_engine, db_session):
    # Override dependencies: DB and current user
    def _override_get_db():
        try:
            yield db_session
        finally:
            pass

    def _owner_user():
        return DummyUser(id=1, role="pharmacy_owner", tenant_id="tenantA", is_approved=True)

    app.dependency_overrides[get_db] = _override_get_db
    app.dependency_overrides[get_current_user] = _owner_user

    with TestClient(app) as c:
        yield c

    app.dependency_overrides.clear()
