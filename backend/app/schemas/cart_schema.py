from pydantic import BaseModel

class CartCreate(BaseModel):
    user_id: int
    product_id: int
    product_name: str
    image: str
    quantity: int
    price: int