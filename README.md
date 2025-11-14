# Helpclub Monorepo

Multi-tier freelancer marketplace inspired by Freelancer.com and Upwork.

## Stack

- **Backend** – Spring Boot (Maven), Oracle DB, Flyway migrations
- **Frontend** – Next.js 14 + TypeScript + Tailwind CSS
- **Database** – Oracle schema + seeds for local development
- **Terraform** – IaC for AWS networking, compute, database, and CI/CD

## Project layout

```
backend/    # Spring Boot service with Maven build
frontend/   # Next.js application
database/   # Oracle DDL + seed SQL
terraform/  # Modules and environment stacks (dev/prod)
```

Clone the repo, install dependencies (`mvn`, `npm`), and target the appropriate Terraform environment under `terraform/envs/` when deploying.
