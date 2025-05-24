# Endpoints package
# Import all routers here to avoid circular imports

from app.api.endpoints.auth import router as auth_router
from app.api.endpoints.users import router as users_router
from app.api.endpoints.events import router as events_router
from app.api.endpoints.categories import router as categories_router
from app.api.endpoints.registrations import router as registrations_router
from app.api.endpoints.tickets import router as tickets_router
from app.api.endpoints.admin import router as admin_router
from app.api.endpoints.orders import router as orders_router

# Expose routers with aliases to avoid naming conflicts
auth = auth_router
users = users_router
events = events_router
categories = categories_router
registrations = registrations_router
tickets = tickets_router
admin = admin_router
orders = orders_router

# This file is intentionally empty to make the directory a Python package 