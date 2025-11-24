from datetime import datetime
from typing import Optional

from sqlalchemy import String, Integer, Float, DateTime, Text, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base
import enum

class ExpenseCategory(str, enum.Enum):
    SALARY = "salary"
    RENT = "rent"
    TAX = "tax"
    UTILITIES = "utilities"
    SUPPLIES = "supplies"
    MAINTENANCE = "maintenance"
    OTHER = "other"

class ExpenseStatus(str, enum.Enum):
    PENDING = "pending"
    PAID = "paid"
    OVERDUE = "overdue"

class Expense(Base):
    __tablename__ = "expenses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    tenant_id: Mapped[str] = mapped_column(String(64), index=True)
    
    title: Mapped[str] = mapped_column(String(255))
    amount: Mapped[float] = mapped_column(Float)
    category: Mapped[ExpenseCategory] = mapped_column(String(50), default=ExpenseCategory.OTHER)
    
    due_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    paid_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    
    status: Mapped[ExpenseStatus] = mapped_column(String(20), default=ExpenseStatus.PENDING)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    created_by: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("users.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
