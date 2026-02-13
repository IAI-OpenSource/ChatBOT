#point d'entree de l'application 
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel 

from . import models
from .database import engine
from .routes import users, chat, conversations


SQLModel.metadata.create_all(bind=engine)

app = FastAPI(title="Chatbot API")

# les CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost",
        "http://localhost:8080",
        "https://chat-bot-zeta-liart.vercel.app",
        "https://chat-bot-git-main-sabour-agoros-projects.vercel.app", # Vercel preview/branch URL might vary
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(users.router)
app.include_router(chat.router)
app.include_router(conversations.router)

@app.get("/")
def read_root():
    return {"status": "Online"}
    