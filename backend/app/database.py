#configuration de la connexion a postgreSql 
import os 
from dotenv import load_dotenv
from sqlmodel import creat_engine , session
from sqlalchemy.orm import sessionmaker


load_dotenv()

sqlite_url = os.getenv("Database_url")

engine  = creat_engine(sqlite_url)

def get_Session():
    with Session(engine) as Session:
        yield session