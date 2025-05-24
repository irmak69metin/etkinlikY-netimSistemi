from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

# OrderItem schemas
class OrderItemBase(BaseModel):
    eventId: int
    quantity: int
    price: float

class OrderItemCreate(OrderItemBase):
    pass

class OrderItem(BaseModel):
    id: int
    order_id: int
    eventId: int = Field(..., alias="event_id")
    quantity: int
    price: float

    class Config:
        orm_mode = True
        populate_by_name = True
        allow_population_by_field_name = True

# Customer info schema
class CustomerInfo(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    zipCode: Optional[str] = None

# Order schemas
class OrderBase(BaseModel):
    pass

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]
    customer: CustomerInfo
    total: float

class Order(OrderBase):
    id: int
    user_id: int
    total: float
    created_at: datetime
    status: str
    customer_info: Dict[str, Any]
    items: List[OrderItem]

    class Config:
        orm_mode = True 