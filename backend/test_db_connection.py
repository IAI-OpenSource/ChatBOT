
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()
database_url = os.getenv("Database_url")
print(f"Testing connection to: {database_url.split('@')[1]}") # Hide password

try:
    engine = create_engine(database_url)
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        print("Connection successful! Result:", result.scalar())
except Exception as e:
    print(f"Connection failed: {e}")
