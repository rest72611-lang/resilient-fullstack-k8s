COMPOSE = docker compose
KUBECTL = kubectl

.PHONY: compose-up compose-down compose-build compose-logs backend-logs frontend-logs mysql-logs health
.PHONY: k8s-apply k8s-delete k8s-status k8s-logs-backend k8s-logs-frontend k8s-logs-mysql

compose-up:
	$(COMPOSE) up --build

compose-down:
	$(COMPOSE) down

compose-build:
	$(COMPOSE) build

compose-logs:
	$(COMPOSE) logs -f

backend-logs:
	$(COMPOSE) logs -f backend

frontend-logs:
	$(COMPOSE) logs -f frontend

mysql-logs:
	$(COMPOSE) logs -f mysql

health:
	curl http://localhost:8080/health || true

k8s-apply:
	$(KUBECTL) apply -f k8s/

k8s-delete:
	$(KUBECTL) delete -f k8s/

k8s-status:
	$(KUBECTL) get pods,svc,ingress,pvc

k8s-logs-backend:
	$(KUBECTL) logs deployment/backend-deployment

k8s-logs-frontend:
	$(KUBECTL) logs deployment/frontend-deployment

k8s-logs-mysql:
	$(KUBECTL) logs deployment/mysql-deployment
