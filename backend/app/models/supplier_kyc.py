from datetime import datetime
from typing import Optional

from sqlalchemy import Boolean, DateTime, Integer, String, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class SupplierKYC(Base):
    __tablename__ = "supplier_kyc"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    supplier_id: Mapped[int] = mapped_column(Integer, ForeignKey("suppliers.id", ondelete="CASCADE"), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(16), default="pending", index=True)  # pending, approved, rejected
    national_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    business_license_image: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    tax_certificate_number: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    documents_path: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    admin_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    submitted_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    reviewed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    reviewed_by_user_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    # Relationships
    supplier: Mapped["Supplier"] = relationship("Supplier")
    reviewed_by: Mapped[Optional["User"]] = relationship("User", foreign_keys=[reviewed_by_user_id])


class SupplierPaymentSubmission(Base):
    __tablename__ = "supplier_payment_submissions"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    supplier_id: Mapped[int] = mapped_column(Integer, ForeignKey("suppliers.id", ondelete="CASCADE"), nullable=False, index=True)
    code: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(16), default="pending", index=True)  # pending, verified, rejected
    amount: Mapped[Optional[float]] = mapped_column(nullable=True)
    payment_method: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    admin_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    submitted_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    verified_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    verified_by_user_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    # Relationships
    supplier: Mapped["Supplier"] = relationship("Supplier")
    verified_by: Mapped[Optional["User"]] = relationship("User", foreign_keys=[verified_by_user_id])