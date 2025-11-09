from datetime import datetime
from typing import Optional, List

from sqlalchemy import Boolean, DateTime, Integer, String, Text, ForeignKey, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class Supplier(Base):
    __tablename__ = "suppliers"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    company_name: Mapped[str] = mapped_column(String(255), nullable=False)
    business_license: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    tax_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    address: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    city: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    country: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    phone: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    website: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    rating: Mapped[Optional[float]] = mapped_column(Numeric(3, 2), default=0.0)
    total_orders: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="supplier_profile")
    products: Mapped[List["SupplierProduct"]] = relationship("SupplierProduct", back_populates="supplier", cascade="all, delete-orphan")
    orders: Mapped[List["Order"]] = relationship("Order", back_populates="supplier")


class SupplierProduct(Base):
    __tablename__ = "supplier_products"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    supplier_id: Mapped[int] = mapped_column(Integer, ForeignKey("suppliers.id", ondelete="CASCADE"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    category: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    sku: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)
    price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    unit: Mapped[str] = mapped_column(String(50), default="piece")
    min_order_quantity: Mapped[int] = mapped_column(Integer, default=1)
    stock_quantity: Mapped[int] = mapped_column(Integer, default=0)
    upfront_payment_percent: Mapped[int] = mapped_column(Integer, default=50)
    after_delivery_percent: Mapped[int] = mapped_column(Integer, default=50)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    image_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    supplier: Mapped["Supplier"] = relationship("Supplier", back_populates="products")
    order_items: Mapped[List["OrderItem"]] = relationship("OrderItem", back_populates="product")


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    order_number: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    customer_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    supplier_id: Mapped[int] = mapped_column(Integer, ForeignKey("suppliers.id", ondelete="CASCADE"), nullable=False, index=True)
    tenant_id: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(50), default="pending", index=True)  # pending, approved, payment_received, delivered, cancelled
    total_amount: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    payment_method: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    payment_code: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)
    delivery_address: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    delivery_phone: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    approved_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    payment_verified_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    delivered_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    customer: Mapped["User"] = relationship("User", foreign_keys=[customer_id])
    supplier: Mapped["Supplier"] = relationship("Supplier", back_populates="orders")
    items: Mapped[List["OrderItem"]] = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    reviews: Mapped[List["OrderReview"]] = relationship("OrderReview", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    order_id: Mapped[int] = mapped_column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True)
    product_id: Mapped[int] = mapped_column(Integer, ForeignKey("supplier_products.id", ondelete="CASCADE"), nullable=False, index=True)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    unit_price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    total_price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)

    # Relationships
    order: Mapped["Order"] = relationship("Order", back_populates="items")
    product: Mapped["SupplierProduct"] = relationship("SupplierProduct", back_populates="order_items")


class OrderReview(Base):
    __tablename__ = "order_reviews"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    order_id: Mapped[int] = mapped_column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True)
    customer_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    supplier_id: Mapped[int] = mapped_column(Integer, ForeignKey("suppliers.id", ondelete="CASCADE"), nullable=False, index=True)
    rating: Mapped[int] = mapped_column(Integer, nullable=False)  # 1-5 stars
    feedback: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    order: Mapped["Order"] = relationship("Order", back_populates="reviews")
    customer: Mapped["User"] = relationship("User", foreign_keys=[customer_id])
    supplier: Mapped["Supplier"] = relationship("Supplier")