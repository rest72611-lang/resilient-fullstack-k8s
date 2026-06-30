# Production Improvements

This repository demonstrates production-like patterns, but it is intentionally simplified for a portfolio project.

In a real production environment, the following would be added or strengthened:

- TLS certificates and HTTPS-only traffic.
- A real secret manager such as Kubernetes External Secrets, AWS Secrets Manager, Vault, or Doppler.
- A container image registry such as GHCR, Docker Hub, ECR, GCR, or ACR.
- CI/CD deployment automation with environment approvals.
- Monitoring with metrics for app health, latency, errors, and resource usage.
- Alerting for service failures, high error rates, and database issues.
- Centralized logs with searchable retention.
- Database backups and tested restore procedures.
- Autoscaling for stateless services.
- More careful resource tuning based on load testing.
- Security scanning for dependencies, containers, and Kubernetes manifests.
- Network policies and stricter runtime security contexts.
- Separate environments for development, staging, and production.
- Managed database or a more robust stateful database setup.
