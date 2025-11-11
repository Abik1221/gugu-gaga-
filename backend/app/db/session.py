from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

from app.core.settings import settings


class Base(DeclarativeBase):
    pass


_engine = create_engine(
    settings.database_url or "sqlite:///./zemen_local.db", 
    echo=False,  # Disable SQL logging for performance
    future=True,
    pool_pre_ping=False,  # Disable connection health checks
    connect_args={"check_same_thread": False} if "sqlite" in (settings.database_url or "sqlite") else {}
)
SessionLocal = sessionmaker(bind=_engine, autocommit=False, autoflush=False, future=True)


def get_engine():
    return _engine
