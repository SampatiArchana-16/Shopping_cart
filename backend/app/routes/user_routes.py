from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.db.models import User
from app.schemas.user_schema import UserCreate
from app.schemas.user_schema import UserCreate, UserLogin

router = APIRouter()


@router.post("/register/")
def register(user: UserCreate, db: Session = Depends(get_db)):

    print("🔥 REGISTER HIT:", user)

    new_user = User(
        username=user.username,
        email=user.email,
        password=user.password
    )

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        print("✅ USER SAVED:", new_user.id)

        return {"user_id": new_user.id}

    except Exception as e:
        print("❌ DB ERROR:", e)
        db.rollback()
        raise
    


@router.post("/login/")
def login(user: UserLogin, db: Session = Depends(get_db)):

    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user or db_user.password != user.password:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    return {
        "id": db_user.id,
        "name": db_user.username,
        "email": db_user.email
    }