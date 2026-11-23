# AUTOVERSE PRODUCTION SETUP & DEPLOYMENT GUIDE
## Enterprise Multi-Node Cluster Configuration

**Target Platform:** Linux (Ubuntu 22.04 LTS / Debian 12 / RHEL 9)  
**Containerization:** Docker / Kubernetes (Helm)  
**Database:** PostgreSQL 15+ with pgvector / TimescaleDB  
**Reverse Proxy:** NGINX / Traefik with TLS 1.3  

---

### 1. Environment Configuration

Create production `.env` file for the backend:

```ini
# Database (PostgreSQL)
DATABASE_URL=postgresql://autoverse_admin:SecurePassw0rd!@postgres-cluster.internal:5432/autoverse_prod

# Application Settings
ENVIRONMENT=production
LOG_LEVEL=info
CORS_ORIGINS=https://autoverse.engineering,https://app.autoverse.engineering

# Security & Secrets
JWT_SECRET_KEY=generate_with_openssl_rand_hex_32
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Specialized Workers (Phase 24)
REDIS_URL=redis://redis-broker.internal:6379/0
CELERY_RESULT_BACKEND=redis://redis-broker.internal:6379/1
```

---

### 2. Docker Compose Multi-Service Deployment

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_DB: autoverse_prod
      POSTGRES_USER: autoverse_admin
      POSTGRES_PASSWORD: SecurePassw0rd!
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U autoverse_admin -d autoverse_prod"]
      interval: 10s
      timeout: 5s
      retries: 5

  api:
    build:
      context: .
      dockerfile: services/api/Dockerfile
    restart: always
    environment:
      - DATABASE_URL=postgresql://autoverse_admin:SecurePassw0rd!@postgres:5432/autoverse_prod
    ports:
      - "8000:8000"
    depends_on:
      postgres:
        condition: service_healthy

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "80:80"
    depends_on:
      - api

volumes:
  postgres_data:
```
