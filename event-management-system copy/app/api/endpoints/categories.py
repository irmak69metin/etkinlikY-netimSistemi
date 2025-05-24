from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from sqlalchemy import select

from app.db.base import get_db
from app.models.user import User
from app.models.category import Category
from app.models.event import Event
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from app.core.security import get_current_admin_user

# Create the router (named exactly like the module for easier import)
router = APIRouter()

@router.get("", response_model=List[CategoryResponse])
def get_categories(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    categories = db.execute(select(Category).offset(skip).limit(limit)).scalars().all()
    return categories

@router.get("/{category_id}", response_model=CategoryResponse)
def get_category(
    category_id: int,
    db: Session = Depends(get_db)
):
    category = db.execute(select(Category).where(Category.id == category_id)).scalar_one_or_none()
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    category: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    # Check if category with given name already exists
    db_category = db.execute(select(Category).where(Category.name == category.name)).scalar_one_or_none()
    if db_category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category with this name already exists"
        )
    
    # Create new category
    db_category = Category(**category.model_dump())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: int,
    category_update: CategoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    # Get category
    db_category = db.execute(select(Category).where(Category.id == category_id)).scalar_one_or_none()
    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Update category
    update_data = category_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        if value is not None:
            setattr(db_category, key, value)
    
    db.commit()
    db.refresh(db_category)
    return db_category

@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    # Get category
    db_category = db.execute(select(Category).where(Category.id == category_id)).scalar_one_or_none()
    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Check if category is used in events
    events_count = db.execute(
        select(Event).where(Event.category_id == category_id)
    ).scalar_one_or_none()
    if events_count:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete category that is used in events"
        )
    
    # Delete category
    db.delete(db_category)
    db.commit()
    return None
