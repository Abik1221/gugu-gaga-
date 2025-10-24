from __future__ import annotations

from datetime import datetime, date
from typing import Optional

from sqlalchemy import Boolean, Date, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base


class Subscription(Base):
    __tablename__ = "subscriptions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    tenant_id: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    next_due_date: Mapped[date] = mapped_column(Date)  # billing due date
    blocked: Mapped[bool] = mapped_column(Boolean, default=False)
    notices_sent: Mapped[int] = mapped_column(Integer, default=0)  # within current window
    last_notice_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class PaymentSubmission(Base):
    __tablename__ = "payment_submissions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    tenant_id: Mapped[str] = mapped_column(String(64), index=True)
    code: Mapped[str] = mapped_column(String(64), index=True)
    status: Mapped[str] = mapped_column(String(16), default="pending", index=True)  # pending|verified|rejected
    submitted_by_user_id: Mapped[Optional[int]] = mapped_column(Integer, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    verified_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
