#point d'entree de l'application 

from fastapi import FastAPI
from .routes import chat, users  # Le point signifie "dans le dossier actuel"

app = FastAPI(title = "Chatbot API")

app.include_router(chat.router)
app.include_router(users.router)
@app.get("/")
def read_root():
    return {"status": "Online"}