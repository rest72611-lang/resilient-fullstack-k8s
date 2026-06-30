# DevOps Notes

This project is a DevOps-oriented full-stack deployment demo. It keeps the application small so the deployment and debugging flow stays easy to understand.

## Docker Compose

Docker Compose runs the local stack with MySQL, backend, frontend, and Nginx. It gives a repeatable local environment without installing every service directly on the host machine.

The MySQL container uses a named volume so local database data can survive container restarts.

## Nginx Reverse Proxy

Nginx is the public entry point in the Compose setup. It routes:

- `/` to the frontend container
- `/api` to the backend API
- `/health` to the backend health endpoint

This matches a common deployment pattern where one HTTP entry point hides internal service details.

## Kubernetes Deployments

Deployments describe how each application component should run in Kubernetes. The frontend and backend use two replicas to demonstrate how stateless services can be duplicated. MySQL uses one replica because this demo does not implement database clustering.

## Services

Services provide stable internal DNS names for pods:

- `frontend-service`
- `backend-service`
- `mysql-service`

The backend connects to MySQL through `mysql-service`, not a pod IP.

## Ingress

Ingress defines external HTTP routing into the cluster. In this project it routes `devops-demo.local` traffic to the frontend and backend services.

## ConfigMaps

ConfigMaps store non-sensitive configuration such as database host, database name, and backend port.

## Secrets

Secrets are used for sensitive values such as database passwords. The repository includes only `secret.example.yml`; real secret files should be created locally and not committed.

## Persistent Volume Claim

The MySQL PVC requests persistent storage for database files. This demonstrates the difference between stateless app containers and stateful database storage.

## Health Checks

The backend exposes:

- `/live` for process liveness
- `/health` for readiness and database connectivity

Docker Compose and Kubernetes use health checks to detect whether services are ready to receive traffic.

## Logs

Logs are the first place to inspect most runtime issues:

```bash
docker compose logs -f backend
kubectl logs deployment/backend-deployment
```

## CI

GitHub Actions installs dependencies, builds the frontend, builds Docker images, and checks Kubernetes YAML with a client-side dry run. It does not deploy anywhere.
