#logique pur d'appel de l'api mistral ai 
import os
from mistralai import Mistral
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("Cle_mistral_ai")
client = Mistral(api_key = api_key)


#pour la mémoire de l'ia on utilise l'historique des messages
class MistralAIService:
    async def generate_response(self, user_message : str, history : list = None):
        try :
            model = "mistral-small-latest"
            
            messages = [{"role": "system", "content": "Tu es un assistant utile et poli et tu t'appelles freeze. Tu est tres fort dans le code"}]
            
            if history:
                for msg in history:
                    messages.append({"role": msg.role, "content": msg.contenu})
            
            messages.append({"role": "user", "content": user_message})
            
            chat_response = client.chat.complete(
                model = model,
                messages = messages
            )
    
            return chat_response.choices[0].message.content
        except Exception as e:
        
            print(f"Erreur lors de l'appel a Mistral : {e}")
            return "Désolé , j'ai un petit problème technique pour répondre."

    
mistral_service = MistralAIService()
