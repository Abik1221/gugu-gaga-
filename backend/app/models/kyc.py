from datetime import datetime
from typing import Optional, Literal

from sqlalchemy import DateTime, Integer, String, LargeBinary
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base


class KYCApplication(Base):
    __tablename__ = "kyc_applications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    tenant_id: Mapped[Optional[str]] = mapped_column(String(64), index=True)
    applicant_user_id: Mapped[int] = mapped_column(Integer, index=True)
    status: Mapped[str] = mapped_column(String(16), default="pending", index=True)  # pending|approved|rejected
    id_number: Mapped[Optional[str]] = mapped_column(String(64))
    pharmacy_license_number: Mapped[Optional[str]] = mapped_column(String(64))
    documents_path: Mapped[Optional[str]] = mapped_column(String(255))
    license_document_name: Mapped[Optional[str]] = mapped_column(String(255))
    license_document_mime: Mapped[Optional[str]] = mapped_column(String(64))
    license_document_data: Mapped[Optional[bytes]] = mapped_column(LargeBinary)
    pharmacy_name: Mapped[Optional[str]] = mapped_column(String(255))
    pharmacy_address: Mapped[Optional[str]] = mapped_column(String(255))
    owner_email: Mapped[Optional[str]] = mapped_column(String(255))
    owner_phone: Mapped[Optional[str]] = mapped_column(String(64))
    notes: Mapped[Optional[str]] = mapped_column(String(1000))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    decided_at: Mapped[Optional[datetime]] = mapped_column(DateTime)
