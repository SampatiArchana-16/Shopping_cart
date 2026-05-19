from pydantic import BaseModel, EmailStr


# 🔥 REGISTER SCHEMA
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


# 🔥 LOGIN SCHEMA (optional but useful)
class UserLogin(BaseModel):
    email: EmailStr   # ✅ FIXED
    password: str