from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db

router = APIRouter()

@router.post("/{event_id}/register", status_code=status.HTTP_201_CREATED)
def register_for_event(event_id: int):
    """
    Register for an event.
    """
    return {"message": f"Register for event {event_id}"}
