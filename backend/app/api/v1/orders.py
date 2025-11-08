from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.roles import Role
from app.db.deps import get_db
from app.deps.auth import get_current_user, require_role
from app.deps.tenant import enforce_user_tenant
from app.models.user import User
from app.schemas.supplier import (
    OrderCreate, OrderResponse, PaymentCodeSubmit,
    OrderReviewCreate, OrderReviewResponse
)
from app.services.order import OrderService

router = APIRouter()


# Customer Order Management
@router.post("", response_model=OrderResponse)
def create_order(
    order_data: OrderCreate,
    current_user: User = Depends(require_role(Role.pharmacy_owner, Role.cashier)),
    tenant_id: str = Depends(enforce_user_tenant),
    db: Session = Depends(get_db)
):
    """Create a new order"""
    return OrderService.create_order(db, current_user.id, tenant_id, order_data)


@router.get("", response_model=List[OrderResponse])
def get_customer_orders(
    current_user: User = Depends(require_role(Role.pharmacy_owner, Role.cashier)),
    tenant_id: str = Depends(enforce_user_tenant),
    db: Session = Depends(get_db)
):
    """Get customer's orders"""
    return OrderService.get_customer_orders(db, current_user.id, tenant_id)


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    current_user: User = Depends(require_role(Role.pharmacy_owner, Role.cashier)),
    tenant_id: str = Depends(enforce_user_tenant),
    db: Session = Depends(get_db)
):
    """Get specific order"""
    order = OrderService.get_order_by_id(db, order_id)
    if not order or order.customer_id != current_user.id or order.tenant_id != tenant_id:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.put("/{order_id}/payment-code")
def submit_payment_code(
    order_id: int,
    payment_data: PaymentCodeSubmit,
    current_user: User = Depends(require_role(Role.pharmacy_owner, Role.cashier)),
    tenant_id: str = Depends(enforce_user_tenant),
    db: Session = Depends(get_db)
):
    """Submit payment code for an order"""
    OrderService.submit_payment_code(db, order_id, current_user.id, tenant_id, payment_data.code)
    return {"message": "Payment code submitted successfully"}


@router.post("/{order_id}/review", response_model=OrderReviewResponse)
def create_order_review(
    order_id: int,
    review_data: OrderReviewCreate,
    current_user: User = Depends(require_role(Role.pharmacy_owner, Role.cashier)),
    tenant_id: str = Depends(enforce_user_tenant),
    db: Session = Depends(get_db)
):
    """Create a review for a delivered order"""
    return OrderService.create_order_review(db, order_id, current_user.id, tenant_id, review_data)


@router.get("/{order_id}/review", response_model=OrderReviewResponse)
def get_order_review(
    order_id: int,
    current_user: User = Depends(require_role(Role.pharmacy_owner, Role.cashier)),
    tenant_id: str = Depends(enforce_user_tenant),
    db: Session = Depends(get_db)
):
    """Get review for an order"""
    review = OrderService.get_order_review(db, order_id, current_user.id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return review