# Étape 1 : Build de l'application React
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Étape 2 : Serveur de production Nginx
FROM nginx:stable-alpine

# Copie des fichiers buildés vers Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Configuration Nginx personnalisée pour gérer le routage (React Router)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
    # Proxy pour le backend (optionnel ici si on utilise l'URL absolue dans Api.ts) \
    # location /api/ { \
    #     proxy_pass http://backend:8000/; \
    # } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
