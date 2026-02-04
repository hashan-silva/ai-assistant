# Open Source Chat AI Agent

This monorepo powers an open-source, self-hostable chat AI agent platform. It includes a web UI, backend orchestration service, AI prompt/schema assets, and Terraform modules for cloud deployment.

[![CodeQL](https://github.com/hashan-silva/ai-assistant/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/hashan-silva/ai-assistant/actions/workflows/github-code-scanning/codeql)
[![Deploy to AWS](https://github.com/hashan-silva/ai-assistant/actions/workflows/terraform-deployment.yml/badge.svg)](https://github.com/hashan-silva/ai-assistant/actions/workflows/terraform-deployment.yml)
[![Frontend Lint](https://github.com/hashan-silva/ai-assistant/actions/workflows/frontend-lint.yml/badge.svg)](https://github.com/hashan-silva/ai-assistant/actions/workflows/frontend-lint.yml)
[![SonarCloud Scan](https://github.com/hashan-silva/ai-assistant/actions/workflows/sonarcloud.yml/badge.svg)](https://github.com/hashan-silva/ai-assistant/actions/workflows/sonarcloud.yml)
[![Terraform Lint & Security](https://github.com/hashan-silva/ai-assistant/actions/workflows/terraform-ci.yml/badge.svg)](https://github.com/hashan-silva/ai-assistant/actions/workflows/terraform-ci.yml)

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

Deployments are intended to run through GitHub Actions. The pipeline deploys backend/Ollama on ECS Fargate and publishes the frontend static build to S3 + CloudFront.

### AWS serverless notes

- ECS Fargate runs backend and Ollama containers behind an Application Load Balancer.
- Frontend assets are built in CI and synced to an S3 bucket fronted by CloudFront.
- Deployment IAM principals should have least-privilege permissions and use CI secrets.
- Some ECS actions (for example task definition registration) may require wildcard resource permissions; keep that scope minimal and documented.

Required Terraform variables (examples):

```bash
aws_region="eu-north-1"
backend_image="ghcr.io/<org>/<project>-backend:latest"
ollama_image="ollama/ollama:latest"
```
