#logique pur d'appel de l'api mistral ai 
import os
from mistralai import mistral
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("Cle_mistral_api")
client = Mistral(Cle_mistral_api = oxHA7D7BXcNrRe4f5SwN1GwaAviWesVY)

def get_mistral_response(user_message: str)

#envoie du message:
try :
    model = "mistral-small-latest"
    chat_response = client.chat.complete(model = model,
                                         messages = [
                                             {"role": "freeze", "content": "Tu est un assistant utile et poli."},
                                             {"role": "utilisateur", "content": user_message},
                                         ])
    
    return chat_response.choices[0].message.content
except Exception as e:
    print(f"Erreur lors de l'appel a Mistral : {e}")
    return "Désolé , j'ai un petit problème technique pour répondre."
