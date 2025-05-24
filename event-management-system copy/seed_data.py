import sys
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

# Import all models first
from app.models.user import User
from app.models.category import Category
from app.models.event import Event
from app.models.registration import Registration
from app.models.order import Order

# Then import db components
from app.db.base import SessionLocal, engine, Base
from app.core.security import get_password_hash

# Create all database tables
Base.metadata.create_all(bind=engine)

def seed_data():
    db = SessionLocal()
    try:
        # Check if data already exists
        user_count = db.query(User).count()
        if user_count > 0:
            print(f"Data already exists in the database ({user_count} users). Skipping seeding.")
            return
            
        print("Seeding database with initial data...")
        
        # Add admin user
        admin = User(
            email="admin@example.com",
            name="Admin User",
            hashed_password=get_password_hash("admin123"),
            role="admin",
            is_active=True
        )
        db.add(admin)
        
        # Add regular users
        user1 = User(
            email="user1@example.com",
            name="Regular User 1",
            hashed_password=get_password_hash("password123"),
            role="user",
            is_active=True
        )
        db.add(user1)
        
        user2 = User(
            email="user2@example.com",
            name="Regular User 2",
            hashed_password=get_password_hash("password123"),
            role="user",
            is_active=True
        )
        db.add(user2)
        
        # Commit users to get their IDs
        db.commit()
        
        # Add categories
        categories = [
            Category(name="Conference", color="#FF5733", icon="conference"),
            Category(name="Workshop", color="#33FF57", icon="workshop"),
            Category(name="Seminar", color="#3357FF", icon="seminar"),
            Category(name="Networking", color="#F333FF", icon="networking"),
            Category(name="Party", color="#FF33A8", icon="party")
        ]
        
        for category in categories:
            db.add(category)
        
        # Commit categories to get their IDs
        db.commit()
        
        # Get category IDs
        conference_id = db.query(Category).filter_by(name="Conference").first().id
        workshop_id = db.query(Category).filter_by(name="Workshop").first().id
        seminar_id = db.query(Category).filter_by(name="Seminar").first().id
        
        # Add events
        now = datetime.utcnow()
        
        event1 = Event(
            title="Annual Tech Conference",
            description="Join us for the annual tech conference with leading experts in the field.",
            start_date=now + timedelta(days=30),
            end_date=now + timedelta(days=32),
            location="Convention Center, New York",
            capacity=500,
            price=199.99,
            is_published=True,
            organizer_id=admin.id,
            category_id=conference_id
        )
        db.add(event1)
        
        event2 = Event(
            title="Python Workshop",
            description="Learn Python from scratch in this hands-on workshop.",
            start_date=now + timedelta(days=15),
            end_date=now + timedelta(days=15),
            location="Tech Hub, San Francisco",
            capacity=50,
            price=49.99,
            is_published=True,
            organizer_id=admin.id,
            category_id=workshop_id
        )
        db.add(event2)
        
        event3 = Event(
            title="AI and Machine Learning Seminar",
            description="Explore the latest developments in AI and machine learning.",
            start_date=now + timedelta(days=45),
            end_date=now + timedelta(days=45),
            location="University Auditorium, Boston",
            capacity=200,
            price=0.00,  # Free event
            is_published=True,
            organizer_id=user1.id,
            category_id=seminar_id
        )
        db.add(event3)
        
        # Commit all changes
        db.commit()
        
        print("Database seeded successfully!")
        print("Admin user: admin@example.com / admin123")
        print("Regular users: user1@example.com, user2@example.com / password123")
        
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_data() 