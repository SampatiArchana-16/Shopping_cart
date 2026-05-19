from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import cart_routes, chat_routes, user_routes
from app.db.session import engine, Base
from app.db import models

app = FastAPI()

# ✅ 🔥 CORS MUST COME FIRST (VERY IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Create DB tables
Base.metadata.create_all(bind=engine)

# ✅ Include routers AFTER CORS
app.include_router(user_routes.router, prefix="/user")
app.include_router(cart_routes.router, prefix="/cart", tags=["Cart"])
app.include_router(chat_routes.router, prefix="/chat", tags=["Chat"])