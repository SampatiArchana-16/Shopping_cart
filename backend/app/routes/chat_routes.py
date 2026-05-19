from fastapi import APIRouter
from app.schemas.chat_schema import ChatRequest   # ✅ USE SCHEMA
from app.services.ai_service import generate_ai_response

router = APIRouter()


@router.post("/")
def chat(request: ChatRequest):
    return generate_ai_response(request.user_id, request.message)