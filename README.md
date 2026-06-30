# Full Stack DevOps + Kubernetes Demo

מערכת לימודית פשוטה כדי להבין DevOps:

- React Frontend
- Node/Express Backend
- MySQL
- Docker Compose
- Nginx Reverse Proxy
- Kubernetes manifests
- GitHub Actions CI

## Local Docker Compose

```bash
docker compose up -d --build
```

Open:

```text
http://localhost:8080
```

Health check:

```bash
curl http://localhost:8080/health
```

API:

```bash
curl http://localhost:8080/api/tasks
```

Logs:

```bash
docker compose logs backend
docker compose logs nginx
```

Stop without deleting DB volume:

```bash
docker compose down
```

Danger: deletes volumes:

```bash
docker compose down -v
```

## Kubernetes Flow

Main idea:

```text
User
↓
Ingress
↓
Service
↓
Pod
↓
Container
```

App flow:

```text
User
↓
Ingress
├── /       → frontend-service → frontend Pods
├── /api    → backend-service  → backend Pods
└── /health → backend-service  → backend Pods
                              ↓
                         mysql-service
                              ↓
                         mysql Pod + PVC
```

## Important Kubernetes files

```text
k8s/configmap.yml            non-sensitive config
k8s/secret.example.yml       template for secrets (copy to secret.yml locally, never commit secret.yml)
k8s/mysql-pvc.yml            persistent MySQL storage
k8s/mysql-deployment.yml     runs MySQL pod
k8s/mysql-service.yml        internal MySQL address
k8s/backend-deployment.yml   runs backend pods
k8s/backend-service.yml      internal backend address
k8s/frontend-deployment.yml  runs frontend pods
k8s/frontend-service.yml     internal frontend address
k8s/ingress.yml              external routing
```

## Before Kubernetes apply

You must build and push images, or load them into Minikube/Kind.

Current placeholder images:

```text
arie/fullstack-backend:v1
arie/fullstack-frontend:v1
```

Replace `arie` with your Docker Hub username or GHCR path.

## Example Docker Hub flow

```bash
docker build -t YOUR_DOCKERHUB_USER/fullstack-backend:v1 ./backend
docker build -t YOUR_DOCKERHUB_USER/fullstack-frontend:v1 ./frontend

docker push YOUR_DOCKERHUB_USER/fullstack-backend:v1
docker push YOUR_DOCKERHUB_USER/fullstack-frontend:v1
```

Then update:

```text
k8s/backend-deployment.yml
k8s/frontend-deployment.yml
```

## Kubernetes apply

Before applying, create your local secret file (never commit this):

```bash
cp k8s/secret.example.yml k8s/secret.yml
# edit k8s/secret.yml with real values
```

```bash
kubectl apply -f k8s/
```

Check:

```bash
kubectl get pods
kubectl get services
kubectl get ingress
```

Logs:

```bash
kubectl logs deployment/backend-deployment
```

Debug:

```bash
kubectl describe pod POD_NAME
```

## What this project teaches

- Dockerfile
- Docker Compose
- Nginx reverse proxy
- MySQL volume
- Kubernetes Deployment
- Kubernetes Service
- Kubernetes Ingress
- ConfigMap and Secret
- PVC
- Logs
- Health checks
- CI build
