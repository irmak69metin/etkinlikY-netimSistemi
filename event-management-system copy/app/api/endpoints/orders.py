from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import json
import logging

from app.db.base import get_db
from app.models import Order, OrderItem, User, Event
from app.schemas.order import OrderCreate, Order as OrderSchema
from app.core.security import get_current_user

router = APIRouter()

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@router.post("/", response_model=OrderSchema, status_code=status.HTTP_201_CREATED)
def create_order(order: OrderCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Create a new order
    """
    logger.debug(f"Creating order for user ID: {current_user.id}, email: {current_user.email}")
    logger.debug(f"Order data: {order.dict()}")
    
    # Create order
    db_order = Order(
        user_id=current_user.id,
        total=order.total,
        customer_info=order.customer.dict(),
        status="completed"
    )
    db.add(db_order)
    db.flush()  # Get ID without committing

    logger.debug(f"Created order with ID: {db_order.id}")

    # Create order items
    for item in order.items:
        # Verify event exists
        event = db.query(Event).filter(Event.id == item.eventId).first()
        if not event:
            logger.error(f"Event with ID {item.eventId} not found")
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Event with ID {item.eventId} not found"
            )
        
        # Create order item
        db_item = OrderItem(
            order_id=db_order.id,
            event_id=item.eventId,
            quantity=item.quantity,
            price=item.price
        )
        db.add(db_item)
        logger.debug(f"Added order item for event: {item.eventId}, quantity: {item.quantity}")

    # Commit all changes
    db.commit()
    db.refresh(db_order)
    logger.debug("Order committed successfully")
    
    return db_order

@router.get("/", response_model=List[OrderSchema])
def get_user_orders(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Get all orders for the current user
    """
    orders = db.query(Order).filter(Order.user_id == current_user.id).all()
    return orders

@router.get("/{order_id}", response_model=OrderSchema)
def get_order(order_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Get a specific order by ID
    """
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == current_user.id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    return order 