# Runbook

Use this guide when the demo does not behave as expected.

## App Does Not Start

Check container status:

```bash
docker compose ps
docker compose logs -f
```

Rebuild from a clean image cache if dependencies changed:

```bash
docker compose build
docker compose up -d
```

## Backend Cannot Connect To MySQL

Check whether MySQL is healthy:

```bash
docker compose ps mysql
docker compose logs -f mysql
```

Confirm backend environment variables:

```bash
docker compose exec backend env
```

In Kubernetes, inspect the backend pod and ConfigMap:

```bash
kubectl describe pod -l app=backend
kubectl get configmap app-config -o yaml
```

## Frontend Cannot Reach Backend

In Compose, the browser should call the API through Nginx at `/api`.

Check:

```bash
curl http://localhost:8080/api/tasks
docker compose logs -f nginx
docker compose logs -f backend
```

In Kubernetes, confirm that the ingress routes `/api` to `backend-service`.

## Nginx Returns 502

A 502 usually means Nginx cannot reach the upstream service.

Check:

```bash
docker compose ps
docker compose logs -f nginx
docker compose logs -f frontend
docker compose logs -f backend
```

Confirm service names in `nginx/nginx.conf` match the Compose service names.

## Docker Container Keeps Restarting

Check which service is restarting:

```bash
docker compose ps
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mysql
```

Inspect the container health check:

```bash
docker inspect demo-backend
docker inspect demo-frontend
docker inspect demo-mysql
```

## Kubernetes Pod Is CrashLoopBackOff

Describe the pod and read logs:

```bash
kubectl get pods
kubectl describe pod POD_NAME
kubectl logs POD_NAME --previous
```

Common causes are missing secrets, wrong image names, bad environment variables, or failing startup commands.

## Kubernetes Service Is Not Reachable

Check that the service selector matches pod labels:

```bash
kubectl get pods --show-labels
kubectl get svc
kubectl describe svc backend-service
kubectl describe svc frontend-service
kubectl describe svc mysql-service
```

If using Ingress, check the route:

```bash
kubectl get ingress
kubectl describe ingress fullstack-ingress
```

## MySQL Data Is Missing

For Docker Compose, confirm the named volume still exists:

```bash
docker volume ls
```

Avoid deleting volumes unless you want to reset the database:

```bash
docker compose down -v
```

For Kubernetes, confirm the PVC exists:

```bash
kubectl get pvc
kubectl describe pvc mysql-pvc
```

## Check Environment Variables

Compose:

```bash
docker compose exec backend env
docker compose exec mysql env
```

Kubernetes:

```bash
kubectl describe deployment backend-deployment
kubectl get configmap app-config -o yaml
kubectl get secret app-secret -o yaml
```

Do not paste real secret values into public issues, documentation, or commits.

## Inspect Logs

Compose:

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mysql
```

Kubernetes:

```bash
kubectl logs deployment/backend-deployment
kubectl logs deployment/frontend-deployment
kubectl logs deployment/mysql-deployment
```

## Check Ports

Compose:

```bash
docker compose ps
curl http://localhost:8080/health
```

Kubernetes:

```bash
kubectl get svc
kubectl get ingress
kubectl describe ingress fullstack-ingress
```

## Restart The System Safely

Compose restart without deleting database volume:

```bash
docker compose down
docker compose up -d --build
```

Kubernetes restart without deleting the PVC:

```bash
kubectl rollout restart deployment/backend-deployment
kubectl rollout restart deployment/frontend-deployment
kubectl rollout restart deployment/mysql-deployment
```

Only delete volumes or PVCs when you intentionally want to reset data.
