from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime

# Event info in ticket
class TicketEventInfo(BaseModel):
    id: int
    title: str
    date: datetime
    location: str

# Attendee info in ticket
class TicketAttendeeInfo(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None

# Ticket response schema
class TicketResponse(BaseModel):
    id: int
    event: TicketEventInfo
    quantity: int
    ticketType: str
    totalPrice: float
    status: str
    purchaseDate: datetime
    attendee: TicketAttendeeInfo 