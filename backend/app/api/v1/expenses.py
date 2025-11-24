from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.api.deps import get_db, require_tenant
from app.models.expense import Expense, ExpenseStatus, ExpenseCategory
from app.schemas.expense import ExpenseCreate, ExpenseUpdate, ExpenseOut

router = APIRouter()

@router.get("", response_model=List[ExpenseOut])
def list_expenses(
    db: Session = Depends(get_db),
    tenant_id: str = Depends(require_tenant),
    skip: int = 0,
    limit: int = 100,
    status: Optional[ExpenseStatus] = None,
    category: Optional[ExpenseCategory] = None,
):
    query = db.query(Expense).filter(Expense.tenant_id == tenant_id)
    if status:
        query = query.filter(Expense.status == status)
    if category:
        query = query.filter(Expense.category == category)
    
    return query.order_by(desc(Expense.created_at)).offset(skip).limit(limit).all()

@router.post("", response_model=ExpenseOut)
def create_expense(
    expense_in: ExpenseCreate,
    db: Session = Depends(get_db),
    tenant_id: str = Depends(require_tenant),
):
    expense = Expense(**expense_in.dict(), tenant_id=tenant_id)
    db.add(expense)
    db.commit()
    db.refresh(expense)
    return expense

@router.get("/{expense_id}", response_model=ExpenseOut)
def get_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    tenant_id: str = Depends(require_tenant),
):
    expense = db.query(Expense).filter(Expense.id == expense_id, Expense.tenant_id == tenant_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    return expense

@router.put("/{expense_id}", response_model=ExpenseOut)
def update_expense(
    expense_id: int,
    expense_in: ExpenseUpdate,
    db: Session = Depends(get_db),
    tenant_id: str = Depends(require_tenant),
):
    expense = db.query(Expense).filter(Expense.id == expense_id, Expense.tenant_id == tenant_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    update_data = expense_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(expense, field, value)
    
    db.commit()
    db.refresh(expense)
    return expense

@router.delete("/{expense_id}")
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    tenant_id: str = Depends(require_tenant),
):
    expense = db.query(Expense).filter(Expense.id == expense_id, Expense.tenant_id == tenant_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    db.delete(expense)
    db.commit()
    return {"status": "success"}
