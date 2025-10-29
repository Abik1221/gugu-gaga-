from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, Float, Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class Sale(Base):
    __tablename__ = "sales"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    tenant_id: Mapped[str] = mapped_column(String(64), index=True)
    cashier_user_id: Mapped[Optional[int]] = mapped_column(Integer, index=True)
    customer_id: Mapped[Optional[int]] = mapped_column(Integer, index=True)
    branch: Mapped[Optional[str]] = mapped_column(String(64), index=True)
    total_amount: Mapped[float] = mapped_column(Float, default=0)
    discount_amount: Mapped[float] = mapped_column(Float, default=0)
    tax_amount: Mapped[float] = mapped_column(Float, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class SaleItem(Base):
    __tablename__ = "sale_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    sale_id: Mapped[int] = mapped_column(ForeignKey("sales.id", ondelete="CASCADE"), index=True)
    medicine_id: Mapped[int] = mapped_column(ForeignKey("medicines.id", ondelete="RESTRICT"), index=True)
    quantity: Mapped[int] = mapped_column(Integer, default=1)
    unit_price: Mapped[float] = mapped_column(Float, default=0)
    line_total: Mapped[float] = mapped_column(Float, default=0)

    sale: Mapped[Sale] = relationship(Sale, lazy="joined")
