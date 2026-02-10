import requests
import json

def test_register():
    url = "http://localhost:8000/users/register"
    payload = {
        "username": "test_bot_new",
        "email": "bot_new@test.com",
        "password": "password123"
    }
    headers = {
        "Content-Type": "application/json"
    }
    
    print(f"Envoi d'une requête POST à {url}...")
    try:
        response = requests.post(url, data=json.dumps(payload), headers=headers, timeout=10)
        print(f"Statut de la réponse: {response.status_code}")
        print(f"Corps de la réponse: {response.text}")
    except Exception as e:
        print(f"Erreur lors de la requête: {str(e)}")

if __name__ == "__main__":
    test_register()
