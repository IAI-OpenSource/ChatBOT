#configuration de la connexion a postgreSql 
import os 
from dotenv import load_dotenv
from sqlmodel import create_engine, Session
from dotenv import load_dotenv

load_dotenv()


sqlite_url = os.getenv("Database_url")

engine = create_engine(sqlite_url)

def get_db():
    with Session(engine) as session:
        yield session