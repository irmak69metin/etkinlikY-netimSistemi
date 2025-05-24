from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import List
import logging

from app.db.base import get_db
from app.models import Order, OrderItem, User, Event
from app.schemas.ticket import TicketResponse
from app.core.security import get_current_user

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/my-tickets", response_model=List[TicketResponse])
def get_my_tickets(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Get all tickets for the current user from their orders
    """
    logger.debug(f"Fetching tickets for user ID: {current_user.id}")
    
    # Get all orders for the user
    orders = db.query(Order).filter(Order.user_id == current_user.id).all()
    
    tickets = []
    
    # Extract tickets from order items
    for order in orders:
        logger.debug(f"Processing order ID: {order.id}")
        
        for item in order.items:
            # Get event details
            event = db.query(Event).filter(Event.id == item.event_id).first()
            
            if not event:
                logger.warning(f"Event with ID {item.event_id} not found for order item {item.id}")
                continue
                
            # Create ticket response
            ticket = {
                "id": item.id,
                "event": {
                    "id": event.id,
                    "title": event.title,
                    "date": event.start_date,
                    "location": event.location
                },
                "quantity": item.quantity,
                "ticketType": "Standard",  # Default type since we don't have ticket types in the model
                "totalPrice": item.price * item.quantity,
                "status": "active",  # Default status since we don't track used/canceled
                "purchaseDate": order.created_at,
                "attendee": {
                    "name": order.customer_info.get("name", ""),
                    "email": order.customer_info.get("email", ""),
                    "phone": order.customer_info.get("phone", "")
                }
            }
            
            tickets.append(ticket)
    
    logger.debug(f"Returning {len(tickets)} tickets")
    return tickets

@router.delete("/{ticket_id}", status_code=status.HTTP_204_NO_CONTENT)
def cancel_ticket(ticket_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Cancel a ticket (actually delete the order item)
    """
    logger.debug(f"Canceling ticket (order item) ID: {ticket_id}")
    
    # Find the order item
    order_item = db.query(OrderItem).filter(OrderItem.id == ticket_id).first()
    
    if not order_item:
        logger.warning(f"Ticket with ID {ticket_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found"
        )
    
    # Get the order to check ownership
    order = db.query(Order).filter(Order.id == order_item.order_id).first()
    
    if not order or order.user_id != current_user.id:
        logger.warning(f"User {current_user.id} tried to cancel ticket {ticket_id} they don't own")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to cancel this ticket"
        )
    
    # Delete the order item
    db.delete(order_item)
    db.commit()
    
    logger.debug(f"Ticket {ticket_id} successfully canceled")
    return None
