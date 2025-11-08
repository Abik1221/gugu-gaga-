import uuid
from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_
from fastapi import HTTPException, status

from app.models.supplier import Order, OrderItem, OrderReview, SupplierProduct, Supplier
from app.schemas.supplier import OrderCreate, OrderReviewCreate


class OrderService:
    
    @staticmethod
    def generate_order_number() -> str:
        """Generate unique order number"""
        return f"ORD-{uuid.uuid4().hex[:8].upper()}"
    
    @staticmethod
    def create_order(db: Session, customer_id: int, tenant_id: str, order_data: OrderCreate) -> Order:
        """Create a new order"""
        # Validate supplier exists and is active
        supplier = db.query(Supplier).filter(
            and_(Supplier.id == order_data.supplier_id, Supplier.is_active == True)
        ).first()
        if not supplier:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Supplier not found or inactive"
            )
        
        # Validate products and calculate total
        total_amount = 0
        order_items_data = []
        
        for item_data in order_data.items:
            product = db.query(SupplierProduct).filter(
                and_(
                    SupplierProduct.id == item_data.product_id,
                    SupplierProduct.supplier_id == order_data.supplier_id,
                    SupplierProduct.is_active == True
                )
            ).first()
            
            if not product:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Product {item_data.product_id} not found"
                )
            
            if item_data.quantity < product.min_order_quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Minimum order quantity for {product.name} is {product.min_order_quantity}"
                )
            
            if product.stock_quantity > 0 and item_data.quantity > product.stock_quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Insufficient stock for {product.name}. Available: {product.stock_quantity}"
                )
            
            item_total = product.price * item_data.quantity
            total_amount += item_total
            
            order_items_data.append({
                "product_id": product.id,
                "quantity": item_data.quantity,
                "unit_price": product.price,
                "total_price": item_total
            })
        
        # Create order
        order = Order(
            order_number=OrderService.generate_order_number(),
            customer_id=customer_id,
            supplier_id=order_data.supplier_id,
            tenant_id=tenant_id,
            total_amount=total_amount,
            payment_method=order_data.payment_method,
            delivery_address=order_data.delivery_address,
            delivery_phone=order_data.delivery_phone,
            notes=order_data.notes,
            status="pending"
        )
        
        db.add(order)
        db.flush()  # Get order ID
        
        # Create order items
        for item_data in order_items_data:
            order_item = OrderItem(
                order_id=order.id,
                **item_data
            )
            db.add(order_item)
        
        db.commit()
        db.refresh(order)
        return order
    
    @staticmethod
    def get_customer_orders(db: Session, customer_id: int, tenant_id: str) -> List[Order]:
        """Get orders for a customer"""
        return db.query(Order).filter(
            and_(Order.customer_id == customer_id, Order.tenant_id == tenant_id)
        ).order_by(Order.created_at.desc()).all()
    
    @staticmethod
    def get_order_by_id(db: Session, order_id: int) -> Optional[Order]:
        """Get order by ID"""
        return db.query(Order).filter(Order.id == order_id).first()
    
    @staticmethod
    def submit_payment_code(db: Session, order_id: int, customer_id: int, tenant_id: str, payment_code: str):
        """Submit payment code for an order"""
        order = db.query(Order).filter(
            and_(
                Order.id == order_id,
                Order.customer_id == customer_id,
                Order.tenant_id == tenant_id,
                Order.status == "approved"
            )
        ).first()
        
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found or not in approved status"
            )
        
        order.payment_code = payment_code
        order.updated_at = datetime.utcnow()
        db.commit()
    
    @staticmethod
    def create_order_review(db: Session, order_id: int, customer_id: int, tenant_id: str, review_data: OrderReviewCreate) -> OrderReview:
        """Create a review for a delivered order"""
        order = db.query(Order).filter(
            and_(
                Order.id == order_id,
                Order.customer_id == customer_id,
                Order.tenant_id == tenant_id,
                Order.status == "delivered"
            )
        ).first()
        
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found or not delivered"
            )
        
        # Check if review already exists
        existing_review = db.query(OrderReview).filter(
            and_(
                OrderReview.order_id == order_id,
                OrderReview.customer_id == customer_id
            )
        ).first()
        
        if existing_review:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Review already exists for this order"
            )
        
        review = OrderReview(
            order_id=order_id,
            customer_id=customer_id,
            supplier_id=order.supplier_id,
            rating=review_data.rating,
            feedback=review_data.feedback
        )
        
        db.add(review)
        db.commit()
        
        # Update supplier rating
        OrderService._update_supplier_rating(db, order.supplier_id)
        
        db.refresh(review)
        return review
    
    @staticmethod
    def get_order_review(db: Session, order_id: int, customer_id: int) -> Optional[OrderReview]:
        """Get review for an order"""
        return db.query(OrderReview).filter(
            and_(
                OrderReview.order_id == order_id,
                OrderReview.customer_id == customer_id
            )
        ).first()
    
    @staticmethod
    def _update_supplier_rating(db: Session, supplier_id: int):
        """Update supplier's average rating"""
        from sqlalchemy import func
        
        avg_rating = db.query(func.avg(OrderReview.rating)).filter(
            OrderReview.supplier_id == supplier_id
        ).scalar()
        
        if avg_rating:
            supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
            if supplier:
                supplier.rating = round(float(avg_rating), 2)
                db.commit()