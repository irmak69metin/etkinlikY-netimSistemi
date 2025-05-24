from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from sqlalchemy import select

from app.db.base import get_db
from app.models.user import User
from app.models.category import Category
from app.models.event import Event
from app.models.registration import Registration
from app.schemas.event import EventCreate, EventUpdate, EventResponse, EventDetailResponse
from app.core.security import get_current_active_user, get_current_event_manager_user

router = APIRouter()

@router.get("/", response_model=List[EventResponse])
def get_events(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    category_id: Optional[int] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    price_min: Optional[float] = None,
    price_max: Optional[float] = None,
    organizer_id: Optional[int] = None,
    search: Optional[str] = None
):
    # Base query
    query = select(Event)
    
    # Apply filters
    if category_id:
        query = query.where(Event.category_id == category_id)
    if start_date:
        query = query.where(Event.start_date >= start_date)
    if end_date:
        query = query.where(Event.end_date <= end_date)
    if price_min is not None:
        query = query.where(Event.price >= price_min)
    if price_max is not None:
        query = query.where(Event.price <= price_max)
    if organizer_id:
        query = query.where(Event.organizer_id == organizer_id)
    if search:
        query = query.where(Event.title.like(f"%{search}%") | Event.description.like(f"%{search}%") | Event.location.like(f"%{search}%"))
    
    # Pagination
    query = query.offset(skip).limit(limit)
    
    # Execute query
    events = db.execute(query).scalars().all()
    return events

@router.get("/{event_id}", response_model=EventDetailResponse)
def get_event(
    event_id: int,
    db: Session = Depends(get_db)
):
    # Get event
    event = db.execute(select(Event).where(Event.id == event_id)).scalar_one_or_none()
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Get attendee count
    attendee_count = db.execute(
        select(Registration).where(Registration.event_id == event_id)
    ).scalars().all()
    
    # Create response
    response = EventDetailResponse(
        **{k: v for k, v in event.__dict__.items() if k != "_sa_instance_state"},
        category=event.category,
        organizer=event.organizer,
        attendee_count=len(attendee_count)
    )
    
    return response

@router.post("/", response_model=EventResponse, status_code=status.HTTP_201_CREATED)
def create_event(
    event: EventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_event_manager_user)
):
    # Check if category exists
    category = db.execute(select(Category).where(Category.id == event.category_id)).scalar_one_or_none()
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Validate dates
    if event.start_date >= event.end_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="End date must be after start date"
        )
    
    # Create new event
    db_event = Event(
        **event.model_dump(),
        organizer_id=current_user.id
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

@router.put("/{event_id}", response_model=EventResponse)
def update_event(
    event_id: int,
    event_update: EventUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Get the existing event
    db_event = db.execute(select(Event).where(Event.id == event_id)).scalar_one_or_none()
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Check if user is authorized to update this event (must be organizer or admin)
    if db_event.organizer_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this event"
        )
    
    # Create a dict to store the fields to update
    update_data = {}
    
    # Handle category processing
    if event_update.category is not None:
        if isinstance(event_update.category, dict) and 'id' in event_update.category:
            update_data['category_id'] = event_update.category['id']
        elif hasattr(event_update.category, 'id') and event_update.category.id is not None:
            update_data['category_id'] = event_update.category.id
    elif event_update.category_id is not None:
        update_data['category_id'] = event_update.category_id
    
    # If category_id is being updated, check if new category exists
    if 'category_id' in update_data:
        category = db.execute(select(Category).where(Category.id == update_data['category_id'])).scalar_one_or_none()
        if category is None:
            raise HTTPException(status_code=404, detail="Category not found")
    
    # Process date/time fields
    if hasattr(event_update, 'startDate') and hasattr(event_update, 'startTime') and event_update.startDate and event_update.startTime:
        try:
            # Combine date and time into datetime
            date_str = event_update.startDate
            time_str = event_update.startTime
            # Convert to ISO format
            update_data['start_date'] = datetime.fromisoformat(f"{date_str}T{time_str}")
        except (ValueError, AttributeError) as e:
            # Log error but continue with other updates
            print(f"Error parsing date/time: {e}")
    elif event_update.start_date is not None:
        update_data['start_date'] = event_update.start_date
    
    if hasattr(event_update, 'endDate') and hasattr(event_update, 'endTime') and event_update.endDate and event_update.endTime:
        try:
            # Combine date and time into datetime
            date_str = event_update.endDate
            time_str = event_update.endTime
            # Convert to ISO format
            update_data['end_date'] = datetime.fromisoformat(f"{date_str}T{time_str}")
        except (ValueError, AttributeError) as e:
            # Log error but continue with other updates
            print(f"Error parsing date/time: {e}")
    elif event_update.end_date is not None:
        update_data['end_date'] = event_update.end_date
    
    # Handle date validation
    start_date = update_data.get('start_date', db_event.start_date)
    end_date = update_data.get('end_date', db_event.end_date)
    if start_date and end_date and start_date >= end_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="End date must be after start date"
        )
    
    # Copy other fields from the event_update object
    simple_fields = ['title', 'description', 'location', 'capacity', 'price', 'is_published', 'address']
    for field in simple_fields:
        if hasattr(event_update, field) and getattr(event_update, field) is not None:
            update_data[field] = getattr(event_update, field)
    
    # Handle price and isFree
    if hasattr(event_update, 'isFree') and event_update.isFree:
        update_data['price'] = 0.0
    
    # Update the event object
    for key, value in update_data.items():
        if hasattr(db_event, key):
            setattr(db_event, key, value)
    
    # Commit changes
    db.commit()
    db.refresh(db_event)
    
    return db_event
