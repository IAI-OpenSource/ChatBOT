import os
from dotenv import load_dotenv
from sqlmodel import SQLModel, Session, create_engine, select
from app.models import User

load_dotenv()

def test_db():
    url = os.getenv("Database_url")
    if not url:
        print("Erreur: Database_url non trouvée dans .env")
        return
    
    # Nettoyage de l'URL au cas où il y aurait des espaces
    url = url.strip()
    print(f"Tentative de connexion à: {url.split('@')[-1]}") # On n'affiche pas les credentials
    
    engine = create_engine(url)
    
    try:
        with Session(engine) as session:
            # Test simple de sélection
            statement = select(User).limit(1)
            results = session.exec(statement)
            print("Connexion réussie et requête de test effectuée.")
            
            # Test d'insertion (rollback)
            temp_user = User(
                nom_user="test_diag",
                email="diag@test.com",
                mot_de_passe="test_pass"
            )
            session.add(temp_user)
            print("Tentative d'insertion réussie (avant commit).")
            # On ne commit pas pour ne pas polluer
            
    except Exception as e:
        print(f"ERREUR lors de l'accès à la base de données: {str(e)}")

if __name__ == "__main__":
    test_db()
