from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.db.models import RoleEnum

# Shared properties
class UserBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    role: RoleEnum = RoleEnum.student
    usual_city: Optional[str] = None

# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str

# Properties to receive via API on update
class UserUpdate(UserBase):
    password: Optional[str] = None

# Properties to return via API
class User(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
