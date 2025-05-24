from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

from app.schemas.event import EventResponse
from app.schemas.user import UserResponse

class RegistrationCreate(BaseModel):
    event_id: int

class RegistrationResponse(BaseModel):
    id: int
    event_id: int
    user_id: int
    registration_date: datetime
    ticket_id: str
    checked_in: bool
    checked_in_time: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)

class TicketResponse(RegistrationResponse):
    event: EventResponse
    user: UserResponse
    
    model_config = ConfigDict(from_attributes=True) 