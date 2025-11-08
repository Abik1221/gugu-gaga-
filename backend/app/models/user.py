from datetime import datetime
from typing import Optional

from sqlalchemy import Boolean, DateTime, Integer, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base
from app.models.branch import Branch


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    username: Mapped[Optional[str]] = mapped_column(String(64), unique=True, nullable=True)
    first_name: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
    last_name: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
    phone: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    role: Mapped[str] = mapped_column(String(32), default="customer", index=True)
    tenant_id: Mapped[Optional[str]] = mapped_column(String(64), index=True)
    assigned_branch_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("branches.id", ondelete="SET NULL"), nullable=True, index=True
    )
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_approved: Mapped[bool] = mapped_column(Boolean, default=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    assigned_branch: Mapped[Optional[Branch]] = relationship(Branch, lazy="joined")
    supplier_profile: Mapped[Optional["Supplier"]] = relationship("Supplier", back_populates="user", uselist=False)
