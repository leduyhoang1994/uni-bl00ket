# Hướng dẫn triển khai Uni Class Game lên Kubernetes

## Tổng quan

Dự án này sử dụng một container duy nhất chạy cả Backend (Node.js) và nginx để tối ưu hóa việc triển khai trên Kubernetes.

## Cấu trúc

- `Dockerfile.k8s`: Multi-stage Dockerfile để build image chứa cả Backend và nginx
- `k8s-deployment.yaml`: Kubernetes manifests bao gồm Deployment, Service, ConfigMap, Secret và Ingress

## Cách triển khai

### 1. Build Docker image

```bash
# Build image từ Dockerfile.k8s
docker build -f Dockerfile.k8s -t your-registry/uni-class-game:latest .

# Push image lên registry
docker push your-registry/uni-class-game:latest
```

### 2. Cấu hình Kubernetes

Trước khi deploy, cần cập nhật các giá trị trong `k8s-deployment.yaml`:

- Thay `your-registry/uni-class-game:latest` bằng image path thực tế
- Cập nhật `FRONTEND_DOMAIN`, `redis-url`, `mongo-url`
- Cập nhật `api-key` trong Secret (base64 encoded)
- Cập nhật `host` trong Ingress

### 3. Deploy lên Kubernetes

```bash
# Apply manifests
kubectl apply -f k8s-deployment.yaml

# Kiểm tra deployment
kubectl get pods -l app=uni-class-game-backend-nginx
kubectl get services
kubectl get ingress
```

### 4. Kiểm tra logs

```bash
# Xem logs của pod
kubectl logs -l app=uni-class-game-backend-nginx -f
```

## Kiến trúc

### Container Architecture
- **Base Image**: nginx:stable-alpine
- **Backend**: Node.js 20 + PM2 chạy ở cluster mode
- **Web Server**: nginx làm reverse proxy
- **Process Management**: nginx chạy ở background, PM2 quản lý Node.js processes

### Networking
- nginx listen trên port 80
- Backend chạy trên port 4000 (internal)
- nginx proxy requests tới Backend
- WebSocket support được cấu hình

### Scaling
- Deployment có thể scale theo số replicas
- PM2 cluster mode tự động sử dụng tất cả CPU cores
- Health checks đảm bảo pod readiness

## Monitoring

### Health Checks
- **Liveness Probe**: HTTP GET trên port 80
- **Readiness Probe**: HTTP GET trên port 80
- **Health Check**: Built-in health check trong Dockerfile

### Logs
- nginx logs: `/var/log/nginx/`
- Application logs: PM2 quản lý
- Container logs: `kubectl logs`

## Troubleshooting

### Common Issues

1. **Pod không start**: Kiểm tra image pull policy và registry access
2. **Backend không connect được**: Kiểm tra ConfigMap và Secret
3. **nginx proxy errors**: Kiểm tra nginx.conf và service discovery

### Debug Commands

```bash
# Kiểm tra pod status
kubectl describe pod <pod-name>

# Xem events
kubectl get events --sort-by=.metadata.creationTimestamp

# Exec vào container
kubectl exec -it <pod-name> -- /bin/sh

# Kiểm tra nginx config
kubectl exec -it <pod-name> -- nginx -t
```

## Performance Tuning

### Resource Limits
- **CPU**: 250m request, 500m limit
- **Memory**: 256Mi request, 512Mi limit
- **Replicas**: 2 (có thể điều chỉnh theo load)

### nginx Optimization
- Worker processes: auto
- Worker connections: 1024
- Keep-alive timeout: 65s

### PM2 Configuration
- Cluster mode với max instances
- Auto restart enabled
- Watch disabled cho production
