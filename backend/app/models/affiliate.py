from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, Float, Integer, String, Boolean
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base


class AffiliateProfile(Base):
    __tablename__ = "affiliate_profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, index=True)
    code: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    full_name: Mapped[Optional[str]] = mapped_column(String(255))
    bank_name: Mapped[Optional[str]] = mapped_column(String(255))
    bank_account_name: Mapped[Optional[str]] = mapped_column(String(255))
    bank_account_number: Mapped[Optional[str]] = mapped_column(String(64))
    iban: Mapped[Optional[str]] = mapped_column(String(64))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class AffiliateLink(Base):
    __tablename__ = "affiliate_links"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    affiliate_user_id: Mapped[int] = mapped_column(Integer, index=True)
    token: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    active: Mapped[bool] = mapped_column(Boolean, default=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class AffiliateReferral(Base):
    __tablename__ = "affiliate_referrals"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    affiliate_user_id: Mapped[int] = mapped_column(Integer, index=True)
    referred_tenant_id: Mapped[str] = mapped_column(String(64), index=True)
    code: Mapped[str] = mapped_column(String(64), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    activated_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)


class CommissionPayout(Base):
    __tablename__ = "commission_payouts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    affiliate_user_id: Mapped[int] = mapped_column(Integer, index=True)
    tenant_id: Mapped[str] = mapped_column(String(64), index=True)
    month: Mapped[str] = mapped_column(String(7), index=True)  # YYYY-MM
    percent: Mapped[float] = mapped_column(Float, default=5.0)
    amount: Mapped[float] = mapped_column(Float, default=0.0)
    status: Mapped[str] = mapped_column(String(16), default="pending", index=True)  # pending|paid
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
