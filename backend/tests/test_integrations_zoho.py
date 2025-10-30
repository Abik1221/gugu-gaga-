from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from fastapi.testclient import TestClient

from app.db.session import Base


@pytest.fixture(autouse=True)
def setup_database(db_engine):
    Base.metadata.create_all(bind=db_engine)
    yield
    Base.metadata.drop_all(bind=db_engine)


def test_zoho_books_inventory_import(client: TestClient):
    assert client is not None
