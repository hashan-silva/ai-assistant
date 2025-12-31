# Helpclub Monorepo

Nordic-focused community and support platform for coordinated local care.

## Stack

- **Backend** – Spring Boot (Maven), Oracle DB, Flyway migrations
- **Frontend** – Next.js 14 + TypeScript + Material UI + SCSS + next-intl
- **Database** – Oracle schema + seeds for local development
- **Terraform** – IaC for AWS networking, compute, database, and CI/CD

## Project layout

```
backend/    # Spring Boot service with Maven build
frontend/   # Next.js application
database/   # Oracle DDL + seed SQL
terraform/  # Modules and environment stacks (dev/prod)
```

## Local development

```
cd backend && mvn spring-boot:run
```

```
cd frontend && npm install && npm run dev
```

```
docker compose up --build
```

Clone the repo, install dependencies (`mvn`, `npm`), and target the appropriate Terraform environment under `terraform/envs/` when deploying.
