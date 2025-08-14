# Multi-stage build pour optimiser la taille de l'image
FROM node:20-alpine AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY . .

# Construire l'application en mode production
RUN npm run build -- --configuration production

# Vérifier le contenu et copier dans un répertoire temporaire
RUN find dist -type f -name "*.html" | head -1 | xargs dirname | xargs -I {} cp -r {} /tmp/build-output

# Stage de production avec Nginx
FROM nginx:alpine

# Copier la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/nginx.conf

# Copier les fichiers construits depuis le stage de build
COPY --from=build /tmp/build-output /usr/share/nginx/html

# Vérifier le contenu copié
RUN ls -la /usr/share/nginx/html/

# Exposer le port
EXPOSE 80

# Commande de démarrage
CMD ["nginx", "-g", "daemon off;"] 