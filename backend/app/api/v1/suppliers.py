from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.roles import Role
from app.db.deps import get_db
from app.deps.auth import get_current_user, require_role
from app.deps.tenant import enforce_user_tenant
from app.models.user import User
from app.models.supplier import Supplier, SupplierProduct, Order, OrderItem, OrderReview
from app.schemas.supplier import (
    SupplierCreate, SupplierUpdate, SupplierResponse,
    SupplierProductCreate, SupplierProductUpdate, SupplierProductResponse,
    OrderCreate, OrderUpdate, OrderResponse, PaymentCodeSubmit, PaymentCodeVerify,
    OrderReviewCreate, OrderReviewResponse
)
from app.services.supplier import SupplierService

router = APIRouter()


# Supplier Profile Management
@router.post("/profile", response_model=SupplierResponse)
def create_supplier_profile(
    supplier_data: SupplierCreate,
    current_user: User = Depends(require_role(Role.supplier)),
    db: Session = Depends(get_db)
):
    """Create supplier profile"""
    return SupplierService.create_supplier_profile(db, current_user.id, supplier_data)


@router.get("/profile", response_model=SupplierResponse)
def get_supplier_profile(
    current_user: User = Depends(require_role(Role.supplier)),
    db: Session = Depends(get_db)
):
    """Get supplier profile"""
    supplier = SupplierService.get_supplier_by_user_id(db, current_user.id)
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier profile not found")
    return supplier


@router.put("/profile", response_model=SupplierResponse)
def update_supplier_profile(
    supplier_data: SupplierUpdate,
    current_user: User = Depends(require_role(Role.supplier)),
    db: Session = Depends(get_db)
):
    """Update supplier profile"""
    return SupplierService.update_supplier_profile(db, current_user.id, supplier_data)


# Product Management
@router.post("/products", response_model=SupplierProductResponse)
def create_product(
    product_data: SupplierProductCreate,
    current_user: User = Depends(require_role(Role.supplier)),
    db: Session = Depends(get_db)
):
    """Create a new product"""
    supplier = SupplierService.get_supplier_by_user_id(db, current_user.id)
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier profile not found")
    
    return SupplierService.create_product(db, supplier.id, product_data)


@router.get("/products", response_model=List[SupplierProductResponse])
def get_supplier_products(
    current_user: User = Depends(require_role(Role.supplier)),
    db: Session = Depends(get_db)
):
    """Get supplier's products"""
    supplier = SupplierService.get_supplier_by_user_id(db, current_user.id)
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier profile not found")
    
    return SupplierService.get_supplier_products(db, supplier.id)


@router.put("/products/{product_id}", response_model=SupplierProductResponse)
def update_product(
    product_id: int,
    product_data: SupplierProductUpdate,
    current_user: User = Depends(require_role(Role.supplier)),
    db: Session = Depends(get_db)
):
    """Update a product"""
    supplier = SupplierService.get_supplier_by_user_id(db, current_user.id)
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier profile not found")
    
    return SupplierService.update_product(db, supplier.id, product_id, product_data)


@router.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    current_user: User = Depends(require_role(Role.supplier)),
    db: Session = Depends(get_db)
):
    """Delete a product"""
    supplier = SupplierService.get_supplier_by_user_id(db, current_user.id)
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier profile not found")
    
    SupplierService.delete_product(db, supplier.id, product_id)
    return {"message": "Product deleted successfully"}


# Order Management
@router.get("/orders", response_model=List[OrderResponse])
def get_supplier_orders(
    current_user: User = Depends(require_role(Role.supplier)),
    db: Session = Depends(get_db)
):
    """Get orders for supplier"""
    supplier = SupplierService.get_supplier_by_user_id(db, current_user.id)
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier profile not found")
    
    return SupplierService.get_supplier_orders(db, supplier.id)


@router.put("/orders/{order_id}/approve")
def approve_order(
    order_id: int,
    current_user: User = Depends(require_role(Role.supplier)),
    db: Session = Depends(get_db)
):
    """Approve an order"""
    supplier = SupplierService.get_supplier_by_user_id(db, current_user.id)
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier profile not found")
    
    SupplierService.approve_order(db, supplier.id, order_id)
    return {"message": "Order approved successfully"}


@router.put("/orders/{order_id}/reject")
def reject_order(
    order_id: int,
    current_user: User = Depends(require_role(Role.supplier)),
    db: Session = Depends(get_db)
):
    """Reject an order"""
    supplier = SupplierService.get_supplier_by_user_id(db, current_user.id)
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier profile not found")
    
    SupplierService.reject_order(db, supplier.id, order_id)
    return {"message": "Order rejected successfully"}


@router.put("/orders/{order_id}/verify-payment")
def verify_payment(
    order_id: int,
    payment_data: PaymentCodeVerify,
    current_user: User = Depends(require_role(Role.supplier)),
    db: Session = Depends(get_db)
):
    """Verify payment for an order"""
    supplier = SupplierService.get_supplier_by_user_id(db, current_user.id)
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier profile not found")
    
    SupplierService.verify_payment(db, supplier.id, order_id)
    return {"message": "Payment verified successfully"}


@router.put("/orders/{order_id}/mark-delivered")
def mark_order_delivered(
    order_id: int,
    current_user: User = Depends(require_role(Role.supplier)),
    db: Session = Depends(get_db)
):
    """Mark order as delivered"""
    supplier = SupplierService.get_supplier_by_user_id(db, current_user.id)
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier profile not found")
    
    SupplierService.mark_order_delivered(db, supplier.id, order_id)
    return {"message": "Order marked as delivered"}


# Public endpoints for customers to browse suppliers
@router.get("/browse", response_model=List[SupplierResponse])
def browse_suppliers(
    current_user: User = Depends(get_current_user),
    tenant_id: str = Depends(enforce_user_tenant),
    db: Session = Depends(get_db)
):
    """Browse available suppliers"""
    return SupplierService.get_active_suppliers(db)


@router.get("/{supplier_id}/products", response_model=List[SupplierProductResponse])
def get_supplier_products_public(
    supplier_id: int,
    current_user: User = Depends(get_current_user),
    tenant_id: str = Depends(enforce_user_tenant),
    db: Session = Depends(get_db)
):
    """Get products from a specific supplier"""
    return SupplierService.get_supplier_products(db, supplier_id, active_only=True)