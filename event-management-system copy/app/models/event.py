from sqlalchemy import Column, Integer, String, Text, DateTime, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base import Base

class Event(Base):
    __tablename__ = "events"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    location = Column(String)
    capacity = Column(Integer, nullable=True)
    price = Column(Float, default=0.0)
    is_published = Column(Boolean, default=True)
    
    organizer_id = Column(Integer, ForeignKey("users.id"))
    category_id = Column(Integer, ForeignKey("categories.id"))
    
    # Relationships
    organizer = relationship("User", back_populates="events")
    category = relationship("Category", back_populates="events")
    registrations = relationship("Registration", back_populates="event", cascade="all, delete-orphan") 