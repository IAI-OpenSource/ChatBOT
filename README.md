# ❄️ freeze Chat - Intelligent Chatbot Platform

Bienvenue sur **freeze Chat**, une application de chatbot IA moderne et performante, conçue pour offrir une expérience utilisateur fluide et sécurisée. 

Ce projet combine la puissance de l'IA de **Mistral AI** avec une interface utilisateur premium construite sous **React** et un backend robuste sous **FastAPI**.

---

## 🎯 C'est quoi ? (Description)

**freeze Chat** est une plateforme de messagerie intelligente qui permet aux utilisateurs de :
- **Discuter avec "freeze"** : Un assistant IA personnalisé (basé sur Mistral AI) expert en code.
- **Gérer des conversations** : Chaque discussion est sauvegardée et peut être reprise à tout moment.
- **Mémoire contextuelle** : L'IA se souvient des messages précédents au sein d'une même conversation pour des réponses cohérentes.
- **Sécurité** : Un système complet d'authentification (Inscription/Connexion) avec protection des données.
- **Interface Moderne** : Un dashboard inspiré des models  actuels, supportant les modes sombre et clair.

---

## 🛠️ Avec quoi ? (Stack Technique)

### 💻 Frontend
- **Framework** : [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling** : [Tailwind CSS](https://tailwindcss.com/)
- **UI Components** : [Shadcn/UI](https://ui.shadcn.com/) (Radix UI)
- **Icons** : [Lucide React](https://lucide.dev/)
- **Routing** : React Router 7
- **HTTP Client** : Axios

### ⚙️ Backend
- **Langage** : [Python 3.10+](https://www.python.org/)
- **Framework** : [FastAPI](https://fastapi.tiangolo.com/)
- **ORM** : [SQLModel](https://sqlmodel.tiangolo.com/) (Pydantic + SQLAlchemy)
- **Base de données** : PostgreSQL
- **Authentification** : JWT (JSON Web Tokens) & Passlib (Bcrypt)
- **IA** : [Mistral AI SDK](https://github.com/mistralai/client-python)

### 🐳 Infrastructure
- **Docker** & **Docker Compose** pour une orchestration simplifiée.

---

## 🚀 Comment le lancer ? (Installation)

### 1. Prérequis
- [Docker](https://www.docker.com/) et [Docker Compose](https://docs.docker.com/compose/) installés.
- Une clé API Mistral AI (disponible sur [console.mistral.ai](https://console.mistral.ai/)).

### 2. Configuration
Créez un fichier `.env` dans le dossier `backend` :
```env
Cle_mistral_ai=VOTRE_CLE_ICI
DATABASE_URL=postgresql://user:password@db:5432/chatbot
```

### 3. Lancement rapide (via Docker)
La méthode la plus simple pour tout lancer d'un coup :
```bash
docker-compose up --build
```
- **Frontend** : accessible sur [http://localhost:5173](http://localhost:5173)
- **Backend (API)** : accessible sur [http://localhost:8000](http://localhost:8000)
- **Documentation API (Swagger)** : [http://localhost:8000/docs](http://localhost:8000/docs)


### 4.Accès direct au chatbot via le lien : 

 https://chat-bot-djfa.vercel.app/
 
 **Assurer vous de vous inscrire avant de vous connecter!!!!!!
---

## 🏗️ Structure du Projet

```text
ChatBOT/
├── backend/            # API FastAPI
│   ├── app/
│   │   ├── routes/     # Points d'entrée (Chat, Users, Conv)
│   │   ├── models.py   # Schémas de base de données
│   │   ├── auth.py     # Logique JWT & Sécurité
│   │   └── services/   # Intégration Mistral AI
│   └── Dockerfile
├── frontend/           # Interface React
│   ├── src/
│   │   ├── Pages/      # Dashboard, Connexion, Inscription
│   │   ├── components/ # Composants UI (Shadcn)
│   │   └── ServicesApi/# Configuration Axios
│   └── Dockerfile.dev
└── docker-compose.yml  # Orchestration globale
```

---

## 📖 Comment ça fonctionne ? (Logique)

1. **Authentification** : L'utilisateur s'inscrit ou se connecte. Le backend génère un token JWT qui est stocké côté client pour sécuriser les appels API.
2. **Conversations** : Lorsqu'un utilisateur démarre un chat, une nouvelle entrée est créée dans la table `conversations`.
3. **Appel IA** : À chaque message, le backend récupère l'historique des messages précédents de la conversation actuelle et l'envoie à Mistral AI pour qu'il garde le contexte.
4. **Persistance** : Tous les messages (utilisateur et IA) sont sauvegardés en base de données.

---

