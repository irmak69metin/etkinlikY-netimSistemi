from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db

router = APIRouter()

@router.get("/stats", status_code=status.HTTP_200_OK)
def get_stats():
    """
    Get system statistics.
    """
    return {
        "total_users": 0,
        "total_events": 0,
        "total_registrations": 0,
        "upcoming_events": 0
    }
