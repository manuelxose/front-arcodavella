# Etapa 1: Construcción
FROM node:18-alpine AS builder

# Instalar dependencias de compilación (si es necesario)
RUN apk add --no-cache python3 make g++ bash

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de la aplicación
COPY . .

# Construir la aplicación (asegúrate de usar la configuración de producción)
RUN npm run build -- --configuration production

# Etapa 2: Servir la Aplicación
FROM nginx:alpine

# Elimina la configuración predeterminada de Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia tu configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia los archivos construidos desde la etapa anterior
COPY --from=builder /app/dist/front-arcodavella /usr/share/nginx/html

# Exponer el puerto
EXPOSE 80

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]
