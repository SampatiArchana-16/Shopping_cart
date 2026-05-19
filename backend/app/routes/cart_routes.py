from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import Cart
from app.schemas.cart_schema import CartCreate   # ✅ NEW

router = APIRouter()


# ➕ ADD / UPDATE CART
@router.post("/add")
def add_to_cart(data: CartCreate, db: Session = Depends(get_db)):

    if data.quantity <= 0:
        raise HTTPException(status_code=400, detail="Invalid quantity")

    existing = db.query(Cart).filter(
        Cart.user_id == data.user_id,
        Cart.product_id == data.product_id
    ).first()

    if existing:
        existing.quantity += data.quantity
    else:
        item = Cart(
            user_id=data.user_id,
            product_id=data.product_id,
            product_name=data.product_name,
            image=data.image or "",
            quantity=data.quantity,
            price=data.price
        )
        db.add(item)

    db.commit()
    return {"message": "Item added/updated"}


# 📥 GET USER CART
@router.get("/{user_id}")
def get_cart(user_id: int, db: Session = Depends(get_db)):
    items = db.query(Cart).filter(Cart.user_id == user_id).all()
    return items


# ❌ REMOVE ITEM
@router.delete("/{item_id}")
def remove_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Cart).filter(Cart.id == item_id).first()

    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    db.delete(item)
    db.commit()

    return {"message": "Item removed"}