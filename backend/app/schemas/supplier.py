from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


# Supplier Schemas
class SupplierBase(BaseModel):
    company_name: str = Field(..., min_length=1, max_length=255)
    business_license: Optional[str] = None
    tax_id: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    description: Optional[str] = None


class SupplierCreate(SupplierBase):
    pass


class SupplierUpdate(BaseModel):
    company_name: Optional[str] = None
    business_license: Optional[str] = None
    tax_id: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    description: Optional[str] = None


class SupplierResponse(SupplierBase):
    id: int
    user_id: int
    is_verified: bool
    is_active: bool
    rating: Optional[float]
    total_orders: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Product Schemas
class SupplierProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    category: Optional[str] = None
    sku: Optional[str] = None
    price: float = Field(..., gt=0)
    unit: str = Field(default="piece", max_length=50)
    min_order_quantity: int = Field(default=1, ge=1)
    stock_quantity: int = Field(default=0, ge=0)
    image_url: Optional[str] = None


class SupplierProductCreate(SupplierProductBase):
    pass


class SupplierProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    sku: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    unit: Optional[str] = None
    min_order_quantity: Optional[int] = Field(None, ge=1)
    stock_quantity: Optional[int] = Field(None, ge=0)
    is_active: Optional[bool] = None
    image_url: Optional[str] = None


class SupplierProductResponse(SupplierProductBase):
    id: int
    supplier_id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Order Schemas
class OrderItemBase(BaseModel):
    product_id: int
    quantity: int = Field(..., ge=1)


class OrderItemCreate(OrderItemBase):
    pass


class OrderItemResponse(OrderItemBase):
    id: int
    unit_price: float
    total_price: float
    product: SupplierProductResponse

    class Config:
        from_attributes = True


class OrderBase(BaseModel):
    payment_method: Optional[str] = None
    delivery_address: Optional[str] = None
    delivery_phone: Optional[str] = None
    notes: Optional[str] = None


class OrderCreate(OrderBase):
    supplier_id: int
    items: List[OrderItemCreate] = Field(..., min_items=1)


class OrderUpdate(BaseModel):
    status: Optional[str] = None
    payment_code: Optional[str] = None
    delivery_address: Optional[str] = None
    delivery_phone: Optional[str] = None
    notes: Optional[str] = None


class OrderResponse(OrderBase):
    id: int
    order_number: str
    customer_id: int
    supplier_id: int
    tenant_id: str
    status: str
    total_amount: float
    payment_code: Optional[str]
    approved_at: Optional[datetime]
    payment_verified_at: Optional[datetime]
    delivered_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemResponse]
    supplier: SupplierResponse

    class Config:
        from_attributes = True


# Review Schemas
class OrderReviewBase(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    feedback: Optional[str] = None


class OrderReviewCreate(OrderReviewBase):
    order_id: int


class OrderReviewResponse(OrderReviewBase):
    id: int
    order_id: int
    customer_id: int
    supplier_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Payment Code Schemas
class PaymentCodeSubmit(BaseModel):
    code: str = Field(..., min_length=1, max_length=100)


class PaymentCodeVerify(BaseModel):
    verification_code: Optional[str] = None