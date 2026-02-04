# Open Source Chat AI Agent

This monorepo powers an open-source, self-hostable chat AI agent platform. It includes a web UI, backend orchestration service, AI prompt/schema assets, and Terraform modules for cloud deployment.

[![Terraform Lint & Security](https://github.com/hashan-silva/helpclub/actions/workflows/terraform-ci.yml/badge.svg)](https://github.com/hashan-silva/helpclub/actions/workflows/terraform-ci.yml)
[![SonarCloud Scan](https://github.com/hashan-silva/helpclub/actions/workflows/sonarcloud.yml/badge.svg)](https://github.com/hashan-silva/helpclub/actions/workflows/sonarcloud.yml)
[![Deploy to AWS](https://github.com/hashan-silva/helpclub/actions/workflows/terraform-deployment.yml/badge.svg)](https://github.com/hashan-silva/helpclub/actions/workflows/terraform-deployment.yml)
[![Frontend Lint](https://github.com/hashan-silva/helpclub/actions/workflows/frontend-lint.yml/badge.svg)](https://github.com/hashan-silva/helpclub/actions/workflows/frontend-lint.yml)

## Stack

- **Backend** - Spring Boot (Maven), Flyway migrations
- **Frontend** - Next.js 14 + TypeScript + Material UI + SCSS + next-intl
- **AI Runtime** - Ollama with versioned prompts, schema definitions, and model config
- **Database** - Oracle schema + deterministic seed SQL for local development
- **Terraform** - IaC for AWS serverless infrastructure

## Core flows

- Users chat with the AI agent through the web interface.
- The backend manages instructions, context handling, and structured responses.
- Prompt templates and output schemas are stored in-repo for reproducibility and review.
- The architecture is designed for extension with additional agent personas and integrations.

## Project layout

```
backend/    # Spring Boot service with Maven build
frontend/   # Next.js application
database/   # Oracle DDL + seed SQL
terraform/  # Modules and root Terraform stack
```

## Local development

```bash
cd backend && mvn spring-boot:run
```

```bash
cd frontend && npm install && npm run dev
```

```bash
docker compose up --build
```

Useful checks:

```bash
cd backend && mvn test
cd frontend && npm run build
```

## Terraform deployment

Reusable modules for AWS networking, compute, CI/CD, and IAM live under `terraform/`.

```bash
cd terraform
terraform init
terraform plan
```

Deployments are intended to run through GitHub Actions. Use local `terraform plan` for validation and review.

### AWS serverless notes

- ECS Fargate runs the frontend, backend, and Ollama containers in a single task behind an Application Load Balancer.
- Deployment IAM principals should have least-privilege permissions and use CI secrets.
- Some ECS actions (for example task definition registration) may require wildcard resource permissions; keep that scope minimal and documented.

Required Terraform variables (examples):

```bash
aws_region="eu-north-1"
frontend_image="ghcr.io/<org>/<project>-frontend:latest"
backend_image="ghcr.io/<org>/<project>-backend:latest"
ollama_image="ollama/ollama:latest"
```
