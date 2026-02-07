#models sql (user , conversations , message)

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id_user = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)# ici jsp si je vois mettre cette ligne de code car t'as pas def ca dans ta bd
    
    # Relation :  Ici Un utilisateur peut avoir plusieurs conversations
    conversations = relationship("Conversation", back_populates="user", cascade="all, delete-orphan")


class Conversation(Base):
    __tablename__ = "conversations"
    
    id_conv = Column(Integer, primary_key=True, index=True)
    title = Column(String, default="Nouvelle conversation")
    id_user = Column(Integer, ForeignKey("users.id_user"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)# ici
    
    # Relations
    user = relationship("User", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")


class Message(Base):
    __tablename__ = "messages"
    
    id_ms = Column(Integer, primary_key=True, index=True)
    id_conv = Column(Integer, ForeignKey("conversations.id"))
    role = Column(String)  # "user" ou "assistant"
    content = Column(Text)  # Le texte du message
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relation
    conversation = relationship("Conversation", back_populates="messages")