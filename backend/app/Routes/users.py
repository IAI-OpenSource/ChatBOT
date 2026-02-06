#test pour puvoir faire fonctionner le main a modifier!!!! merci 
from fastapi import APIRouter
router = APIRouter()

@router.post("/register")
def register():
    return {"message": "Inscription réussie"}