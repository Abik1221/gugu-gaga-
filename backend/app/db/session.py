from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

from app.core.settings import settings


class Base(DeclarativeBase):
    pass


_engine = create_engine(settings.database_url or "sqlite:///./zemen_local.db", echo=settings.debug, future=True)
SessionLocal = sessionmaker(bind=_engine, autocommit=False, autoflush=False, future=True)


def get_engine():
    return _engine
