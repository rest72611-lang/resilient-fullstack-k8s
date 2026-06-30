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

## Kubernetes Pod Is CrashLoopBackOff

Describe the pod and read logs:

```bash
kubectl get pods
kubectl describe pod POD_NAME
kubectl logs POD_NAME --previous
```

Common causes are missing secrets, wrong image names, bad environment variables, or failing startup commands.

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

## Check Ports And Services

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
