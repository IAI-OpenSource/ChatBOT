from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from datetime import datetime
from .. import models, schema, auth
from ..database import get_db

router = APIRouter(
    prefix="/users", 
    tags=["users"]
) 

@router.post("/register", response_model=schema.UserResponse)
def register(user: schema.UserCreate, db: Session = Depends(get_db)):
    
    # Check email
    db_user_email = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user_email:
        raise HTTPException(status_code=400, detail="Email déjà enregistré")
    
    # Check username (nom_user)
    db_user_username = db.query(models.User).filter(models.User.nom_user == user.username).first()
    if db_user_username:
        raise HTTPException(status_code=400, detail="Nom d'utilisateur déjà pris")
    
    # Créer le nouvel utilisateur
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(
        nom_user=user.username,
        email=user.email,
        mot_de_passe=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    
    return schema.UserResponse(
        id=new_user.id_user,
        username=new_user.nom_user,
        email=new_user.email,
        created_at=datetime.utcnow() 
        )
    
@router.post("/login", response_model=schema.Token)
def login(user: schema.UserLogin, db: Session = Depends(get_db)):
    
   #  renvoie un token JWT
    
    db_user = db.query(models.User).filter(models.User.nom_user == user.username).first()
    
    if not db_user or not auth.verify_password(user.password, db_user.mot_de_passe):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Identifiants incorrects"
        )
    
    access_token = auth.create_access_token(data={"sub": db_user.nom_user})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=schema.UserResponse)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return schema.UserResponse(
        id=current_user.id_user,
        username=current_user.nom_user,
        email=current_user.email,
        created_at=datetime.utcnow() 
    )
   
