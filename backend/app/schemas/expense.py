from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from app.models.expense import ExpenseCategory, ExpenseStatus

class ExpenseBase(BaseModel):
    title: str
    amount: float = Field(..., gt=0)
    category: ExpenseCategory = ExpenseCategory.OTHER
    due_date: Optional[datetime] = None
    status: ExpenseStatus = ExpenseStatus.PENDING
    description: Optional[str] = None

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[float] = None
    category: Optional[ExpenseCategory] = None
    due_date: Optional[datetime] = None
    paid_date: Optional[datetime] = None
    status: Optional[ExpenseStatus] = None
    description: Optional[str] = None

class ExpenseOut(ExpenseBase):
    id: int
    tenant_id: str
    paid_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
