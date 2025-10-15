# Multi-stage Dockerfile cho Backend + nginx trong một container cho Kubernetes
FROM node:20-alpine AS backend-builder

# Cài đặt PM2 toàn cục
RUN npm install pm2 -g

# Sao chép Common và Backend package files
COPY Common/ /app/Common/
WORKDIR /app/Backend
COPY Backend/package*.json ./

# Cài đặt dependencies
RUN npm ci --only=production

# Sao chép mã nguồn Backend
COPY Backend/ .

# Build Backend
RUN npm run build

# Production stage
FROM nginx:stable-alpine

# Cài đặt Node.js và PM2 trong nginx container
RUN apk add --no-cache nodejs npm && \
    npm install pm2 -g

# Tạo user để chạy ứng dụng
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Sao chép nginx configuration
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Sao chép Backend từ builder stage
COPY --from=backend-builder --chown=nodejs:nodejs /app /app

# Tạo thư mục logs cho nginx
RUN mkdir -p /var/log/nginx && \
    chown -R nodejs:nodejs /var/log/nginx && \
    chown -R nodejs:nodejs /var/cache/nginx && \
    chown -R nodejs:nodejs /var/run && \
    chown -R nodejs:nodejs /etc/nginx/conf.d

# Tạo script khởi động
COPY <<EOF /start.sh
#!/bin/sh
set -e

# Khởi động nginx ở background
nginx -g "daemon off;" &

# Chờ nginx khởi động
sleep 2

# Khởi động Backend với PM2
cd /app/Backend
exec pm2-runtime ecosystem.config.js
EOF

RUN chmod +x /start.sh && \
    chown nodejs:nodejs /start.sh

# Expose port 80 cho nginx
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Chạy với user nodejs
USER nodejs

# Sử dụng script khởi động
CMD ["/start.sh"]
