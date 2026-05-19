from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.session import Base


# 👤 USER TABLE
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    email = Column(String, unique=True)
    password = Column(String)

    # ✅ FIX RELATIONSHIP
    carts = relationship("Cart", back_populates="user", cascade="all, delete")
    chats = relationship("ChatHistory", back_populates="user", cascade="all, delete")


# 🛒 CART TABLE
class Cart(Base):
    __tablename__ = "cart"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    product_id = Column(Integer)          # ✅ ADD THIS
    product_name = Column(String)
    image = Column(String)                # ✅ ADD THIS
    quantity = Column(Integer)
    price = Column(Integer)

    # ✅ 🔥 THIS WAS MISSING (MAIN ERROR)
    user = relationship("User", back_populates="carts")


# 💬 CHAT TABLE
class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    message = Column(Text)
    response = Column(Text)

    # ✅ FIX RELATION
    user = relationship("User", back_populates="chats")