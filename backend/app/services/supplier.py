from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_
from fastapi import HTTPException, status

from app.models.supplier import Supplier, SupplierProduct, Order
from app.schemas.supplier import (
    SupplierCreate, SupplierUpdate,
    SupplierProductCreate, SupplierProductUpdate
)


class SupplierService:
    
    @staticmethod
    def create_supplier_profile(db: Session, user_id: int, supplier_data: SupplierCreate) -> Supplier:
        """Create a new supplier profile"""
        # Check if supplier profile already exists
        existing_supplier = db.query(Supplier).filter(Supplier.user_id == user_id).first()
        if existing_supplier:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Supplier profile already exists"
            )
        
        supplier = Supplier(
            user_id=user_id,
            **supplier_data.model_dump()
        )
        db.add(supplier)
        db.commit()
        db.refresh(supplier)
        return supplier
    
    @staticmethod
    def get_supplier_by_user_id(db: Session, user_id: int) -> Optional[Supplier]:
        """Get supplier by user ID"""
        return db.query(Supplier).filter(Supplier.user_id == user_id).first()
    
    @staticmethod
    def update_supplier_profile(db: Session, user_id: int, supplier_data: SupplierUpdate) -> Supplier:
        """Update supplier profile"""
        supplier = db.query(Supplier).filter(Supplier.user_id == user_id).first()
        if not supplier:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Supplier profile not found"
            )
        
        update_data = supplier_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(supplier, field, value)
        
        supplier.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(supplier)
        return supplier
    
    @staticmethod
    def get_active_suppliers(db: Session) -> List[Supplier]:
        """Get all active and verified suppliers"""
        return db.query(Supplier).filter(
            and_(Supplier.is_active == True, Supplier.is_verified == True)
        ).all()
    
    # Product Management
    @staticmethod
    def create_product(db: Session, supplier_id: int, product_data: SupplierProductCreate) -> SupplierProduct:
        """Create a new product"""
        product = SupplierProduct(
            supplier_id=supplier_id,
            **product_data.model_dump()
        )
        db.add(product)
        db.commit()
        db.refresh(product)
        return product
    
    @staticmethod
    def get_supplier_products(db: Session, supplier_id: int, active_only: bool = False) -> List[SupplierProduct]:
        """Get products for a supplier"""
        query = db.query(SupplierProduct).filter(SupplierProduct.supplier_id == supplier_id)
        if active_only:
            query = query.filter(SupplierProduct.is_active == True)
        return query.all()
    
    @staticmethod
    def update_product(db: Session, supplier_id: int, product_id: int, product_data: SupplierProductUpdate) -> SupplierProduct:
        """Update a product"""
        product = db.query(SupplierProduct).filter(
            and_(
                SupplierProduct.id == product_id,
                SupplierProduct.supplier_id == supplier_id
            )
        ).first()
        
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found"
            )
        
        update_data = product_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(product, field, value)
        
        product.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(product)
        return product
    
    @staticmethod
    def delete_product(db: Session, supplier_id: int, product_id: int):
        """Delete a product"""
        product = db.query(SupplierProduct).filter(
            and_(
                SupplierProduct.id == product_id,
                SupplierProduct.supplier_id == supplier_id
            )
        ).first()
        
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found"
            )
        
        db.delete(product)
        db.commit()
    
    # Order Management
    @staticmethod
    def get_supplier_orders(db: Session, supplier_id: int) -> List[Order]:
        """Get orders for a supplier"""
        return db.query(Order).filter(Order.supplier_id == supplier_id).order_by(Order.created_at.desc()).all()
    
    @staticmethod
    def approve_order(db: Session, supplier_id: int, order_id: int):
        """Approve an order"""
        order = db.query(Order).filter(
            and_(
                Order.id == order_id,
                Order.supplier_id == supplier_id,
                Order.status == "pending"
            )
        ).first()
        
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found or cannot be approved"
            )
        
        order.status = "approved"
        order.approved_at = datetime.utcnow()
        order.updated_at = datetime.utcnow()
        db.commit()
    
    @staticmethod
    def reject_order(db: Session, supplier_id: int, order_id: int):
        """Reject an order"""
        order = db.query(Order).filter(
            and_(
                Order.id == order_id,
                Order.supplier_id == supplier_id,
                Order.status == "pending"
            )
        ).first()
        
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found or cannot be rejected"
            )
        
        order.status = "cancelled"
        order.updated_at = datetime.utcnow()
        db.commit()
    
    @staticmethod
    def verify_payment(db: Session, supplier_id: int, order_id: int):
        """Verify payment for an order"""
        order = db.query(Order).filter(
            and_(
                Order.id == order_id,
                Order.supplier_id == supplier_id,
                Order.status == "approved",
                Order.payment_code.isnot(None)
            )
        ).first()
        
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found or payment code not submitted"
            )
        
        order.status = "payment_received"
        order.payment_verified_at = datetime.utcnow()
        order.updated_at = datetime.utcnow()
        db.commit()
    
    @staticmethod
    def mark_order_delivered(db: Session, supplier_id: int, order_id: int):
        """Mark order as delivered"""
        order = db.query(Order).filter(
            and_(
                Order.id == order_id,
                Order.supplier_id == supplier_id,
                Order.status == "payment_received"
            )
        ).first()
        
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found or payment not verified"
            )
        
        order.status = "delivered"
        order.delivered_at = datetime.utcnow()
        order.updated_at = datetime.utcnow()
        
        # Update supplier stats
        supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
        if supplier:
            supplier.total_orders += 1
        
        db.commit()