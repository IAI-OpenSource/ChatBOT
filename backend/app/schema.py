#models pour la validation des donnees 
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional

#  SCHEMAS UTILISATEURS 
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class UserLogin(BaseModel):
    username: str
    password: str


#SCHEMAS MESSAGES 
class MessageCreate(BaseModel):
    content: str

class MessageResponse(BaseModel):
    id: int
    role: str
    content: str
    created_at: datetime
    
    class Config:
        from_attributes = True


# SCHEMAS CONVERSATIONS 
class ConversationCreate(BaseModel):
    title: Optional[str] = "Nouvelle conversation"

class ConversationResponse(BaseModel):
    id: int
    title: str
    created_at: datetime
    updated_at: datetime
    messages: List[MessageResponse] = []  # Liste des messages
    
    class Config:
        from_attributes = True

class ConversationList(BaseModel):
    id: int
    title: str
    created_at: datetime
    updated_at: datetime
    message_count: int  # Nombre de messages
    
    class Config:
        from_attributes = True