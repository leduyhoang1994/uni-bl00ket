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

# Cleanup devDependencies sau khi build
RUN npm prune --production

# Production stage
FROM nginx:stable-alpine

# Cài đặt Node.js và PM2 trong nginx container
RUN apk add --no-cache nodejs npm && \
    npm install pm2 -g

# Tạo user để chạy ứng dụng
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Sao chép nginx configuration cho K8s
COPY nginx/nginx-k8s.conf /etc/nginx/nginx.conf

# Sao chép Backend từ builder stage
COPY --from=backend-builder --chown=nodejs:nodejs /app/Backend /app/Backend
COPY --from=backend-builder --chown=nodejs:nodejs /app/Common /app/Common

# Set working directory
WORKDIR /app/Backend

# Tạo thư mục logs và cache cho nginx với quyền phù hợp
RUN mkdir -p /var/log/nginx /var/cache/nginx /tmp && \
    chmod 755 /var/log/nginx /var/cache/nginx /tmp && \
    chown -R nodejs:nodejs /var/log/nginx && \
    chown -R nodejs:nodejs /var/cache/nginx && \
    chown -R nodejs:nodejs /tmp && \
    chown -R nodejs:nodejs /etc/nginx/conf.d

# Tạo script khởi động
RUN cat > /start.sh << 'EOF'
#!/bin/sh
set -e

echo "Starting nginx and backend services..."

# Kiểm tra nginx config
echo "Testing nginx configuration..."
nginx -t

# Khởi động nginx ở background
echo "Starting nginx..."
nginx -g "daemon off;" &

# Chờ nginx khởi động
sleep 3

# Kiểm tra nginx đã khởi động
if ! pgrep nginx > /dev/null; then
    echo "Error: nginx failed to start!"
    exit 1
fi

echo "nginx started successfully"

# Kiểm tra Backend config
cd /app/Backend
if [ ! -f "build/Backend/src/app.js" ]; then
    echo "Error: Backend build files not found!"
    exit 1
fi

echo "Starting Backend with PM2..."
# Khởi động Backend với PM2
exec pm2-runtime ecosystem.config.js
EOF

RUN chmod +x /start.sh && \
    chown nodejs:nodejs /start.sh

# Expose port 8080 cho nginx (non-privileged port)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Tạo thư mục runtime cho nginx với quyền phù hợp
RUN mkdir -p /var/run && \
    chmod 755 /var/run && \
    chown -R nodejs:nodejs /var/run

# Chạy với user nodejs
USER nodejs

# Sử dụng script khởi động
CMD ["/start.sh"]
