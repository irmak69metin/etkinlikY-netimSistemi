from fastapi import APIRouter

from app.api.endpoints import auth, users, events, categories, registrations, tickets, admin, orders

api_router = APIRouter()

# Note: The imported modules are the routers themselves, not objects with router attributes
api_router.include_router(auth, prefix="/auth", tags=["auth"])
api_router.include_router(users, prefix="/users", tags=["users"])
api_router.include_router(events, prefix="/events", tags=["events"])
api_router.include_router(categories, prefix="/categories", tags=["categories"])
api_router.include_router(registrations, prefix="/registrations", tags=["registrations"])
api_router.include_router(tickets, prefix="/tickets", tags=["tickets"])
api_router.include_router(admin, prefix="/admin", tags=["admin"])
api_router.include_router(orders, prefix="/orders", tags=["orders"]) 