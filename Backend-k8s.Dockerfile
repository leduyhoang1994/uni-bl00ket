# Multi-stage Dockerfile cho Backend + nginx trong một container cho Kubernetes
FROM node:20-alpine AS backend-builder

# Cài đặt PM2 toàn cục
RUN npm install pm2 -g

# Sao chép Common và Backend package files
COPY Common/ /app/Common/
WORKDIR /app/Backend
COPY Backend/package*.json ./

# Cài đặt dependencies (cần devDependencies để build)
RUN npm ci

# Sao chép mã nguồn Backend
COPY Backend/ .

# Build Backend
RUN npm run build

# Cleanup devDependencies sau khi build and copy to /app/Backend
RUN npm prune --production
RUN ls -al build/Backend/
EXPOSE 80

CMD [ "node", "build/Backend/app.js" ]

