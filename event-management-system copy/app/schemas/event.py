from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

from app.schemas.user import UserResponse
from app.schemas.category import CategoryResponse

class EventBase(BaseModel):
    title: str
    description: str
    start_date: datetime
    end_date: datetime
    location: str
    capacity: Optional[int] = None
    price: float = 0.0
    is_published: bool = True
    category_id: int

class EventCreate(EventBase):
    pass

class CategoryField(BaseModel):
    name: Optional[str] = None
    color: Optional[str] = None
    icon: Optional[str] = None
    id: Optional[int] = None
    
    model_config = ConfigDict(extra="allow")

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    location: Optional[str] = None
    capacity: Optional[int] = None
    price: Optional[float] = None
    is_published: Optional[bool] = None
    category_id: Optional[int] = None
    
    # Additional fields that may come from the frontend
    startDate: Optional[str] = None
    startTime: Optional[str] = None
    endDate: Optional[str] = None
    endTime: Optional[str] = None
    address: Optional[str] = None
    category: Optional[CategoryField] = None
    isFree: Optional[bool] = None
    attendees: Optional[int] = None
    
    model_config = ConfigDict(
        extra="allow",  # Allow extra fields
        from_attributes=True
    )

class EventResponse(EventBase):
    id: int
    organizer_id: int
    
    model_config = ConfigDict(from_attributes=True)

class EventDetailResponse(EventResponse):
    category: CategoryResponse
    organizer: UserResponse
    attendee_count: int
    
    model_config = ConfigDict(from_attributes=True) 