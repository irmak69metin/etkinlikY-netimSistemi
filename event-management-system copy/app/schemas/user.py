from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime

# Base User schema with common attributes
class UserBase(BaseModel):
    email: EmailStr
    name: str
    
# Schema for user creation
class UserCreate(UserBase):
    password: str
    role: str = "user"
    
# Schema for updating user
class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    is_active: Optional[bool] = None
    role: Optional[str] = None
    
# Schema for returning user data
class UserResponse(UserBase):
    id: int
    role: str
    is_active: bool
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
        
# Schema for returning minimal user data
class UserShort(BaseModel):
    id: int
    name: str
    email: EmailStr
    
    class Config:
        orm_mode = True
        
# Schema for password change
class PasswordChange(BaseModel):
    current_password: str
    new_password: str

class UserInDB(UserResponse):
    hashed_password: str 