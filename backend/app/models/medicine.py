from datetime import datetime, date
from typing import Optional

from sqlalchemy import Date, DateTime, Float, Integer, String, Boolean, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class Medicine(Base):
    __tablename__ = "medicines"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    tenant_id: Mapped[str] = mapped_column(String(64), index=True)
    name: Mapped[str] = mapped_column(String(255), index=True)
    sku: Mapped[Optional[str]] = mapped_column(String(64), index=True)
    category: Mapped[Optional[str]] = mapped_column(String(64), index=True)
    manufacturer: Mapped[Optional[str]] = mapped_column(String(128))
    description: Mapped[Optional[str]] = mapped_column(String(1000))
    image_path: Mapped[Optional[str]] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class InventoryItem(Base):
    __tablename__ = "inventory_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    tenant_id: Mapped[str] = mapped_column(String(64), index=True)
    medicine_id: Mapped[int] = mapped_column(ForeignKey("medicines.id", ondelete="CASCADE"), index=True)
    branch: Mapped[Optional[str]] = mapped_column(String(64), index=True)
    quantity: Mapped[int] = mapped_column(Integer, default=0)  # stored in base units
    reorder_level: Mapped[int] = mapped_column(Integer, default=0)
    expiry_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    lot_number: Mapped[Optional[str]] = mapped_column(String(64))
    pack_size: Mapped[int] = mapped_column(Integer, default=1)  # units per pack
    purchase_price: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    sell_price: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    medicine: Mapped[Medicine] = relationship(Medicine, lazy="joined")
    
    unit_type: Mapped[Optional[str]] = mapped_column(String(50), default='unit')
    packaging_data: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    last_updated_by: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)
    last_update_reason: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)
    price_per_unit: Mapped[Optional[float]] = mapped_column(Float, nullable=True)

    transactions: Mapped[list["InventoryTransaction"]] = relationship("InventoryTransaction", back_populates="inventory_item", cascade="all, delete-orphan")


class InventoryTransaction(Base):
    __tablename__ = "inventory_transactions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    inventory_item_id: Mapped[int] = mapped_column(ForeignKey("inventory_items.id"), index=True)
    transaction_type: Mapped[str] = mapped_column(String(50))
    quantity_change: Mapped[int] = mapped_column(Integer)
    quantity_before: Mapped[int] = mapped_column(Integer)
    quantity_after: Mapped[int] = mapped_column(Integer)
    reason: Mapped[Optional[str]] = mapped_column(String(1000))
    created_by: Mapped[int] = mapped_column(ForeignKey("users.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    inventory_item: Mapped[InventoryItem] = relationship(InventoryItem, back_populates="transactions")
