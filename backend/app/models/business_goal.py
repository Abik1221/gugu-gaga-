from datetime import datetime, date
from typing import Optional
from sqlalchemy import String, Integer, Float, Date, DateTime, Text, ForeignKey, Boolean, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base
import enum

class GoalType(str, enum.Enum):
    REVENUE = "revenue"
    PROFIT = "profit"
    CUSTOMERS = "customers"
    SALES_COUNT = "sales_count"

class GoalStatus(str, enum.Enum):
    ACTIVE = "active"
    ACHIEVED = "achieved"
    MISSED = "missed"
    ARCHIVED = "archived"

class BusinessGoal(Base):
    __tablename__ = "business_goals"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    tenant_id: Mapped[str] = mapped_column(String(64), index=True)
    
    title: Mapped[str] = mapped_column(String(255))
    goal_type: Mapped[GoalType] = mapped_column(String(50))
    target_amount: Mapped[float] = mapped_column(Float)
    current_amount: Mapped[float] = mapped_column(Float, default=0.0)
    
    start_date: Mapped[date] = mapped_column(Date)
    end_date: Mapped[date] = mapped_column(Date)
    
    status: Mapped[GoalStatus] = mapped_column(String(20), default=GoalStatus.ACTIVE)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    created_by: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("users.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    milestones: Mapped[list["Milestone"]] = relationship("Milestone", back_populates="goal", cascade="all, delete-orphan")


class Milestone(Base):
    __tablename__ = "milestones"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    goal_id: Mapped[int] = mapped_column(Integer, ForeignKey("business_goals.id"), index=True)
    
    title: Mapped[str] = mapped_column(String(255))
    target_value: Mapped[float] = mapped_column(Float)
    achieved: Mapped[bool] = mapped_column(Boolean, default=False)
    achieved_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    goal: Mapped["BusinessGoal"] = relationship("BusinessGoal", back_populates="milestones")


class GoalMetric(Base):
    __tablename__ = "goal_metrics"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    goal_id: Mapped[int] = mapped_column(Integer, ForeignKey("business_goals.id"), index=True)
    
    date: Mapped[date] = mapped_column(Date, index=True)
    revenue: Mapped[float] = mapped_column(Float, default=0.0)
    expenses: Mapped[float] = mapped_column(Float, default=0.0)
    profit: Mapped[float] = mapped_column(Float, default=0.0)
    sales_count: Mapped[int] = mapped_column(Integer, default=0)
    cumulative_revenue: Mapped[float] = mapped_column(Float, default=0.0)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
