from fastapi import APIRouter, Depends
from ..services.mistral_ai import mistral_service

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("/ask")
async def ask_mistral(prompt:str):
    response = await mistral_service.generate_response(prompt)
    return {
        "status": "success",
        "answer": response
    }