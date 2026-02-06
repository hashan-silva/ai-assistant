# AI Assistant: Ollama + Java + React + Terraform on AWS

This repository publishes a complete, open-source setup for a chat AI agent on AWS.

It combines:
- Ollama model runtime
- Spring Boot backend (Java)
- Next.js frontend (React + TypeScript)
- Terraform infrastructure modules and GitHub Actions deployment

[![CodeQL](https://github.com/hashan-silva/ai-assistant/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/hashan-silva/ai-assistant/actions/workflows/github-code-scanning/codeql)
[![Deploy to AWS](https://github.com/hashan-silva/ai-assistant/actions/workflows/terraform-deployment.yml/badge.svg)](https://github.com/hashan-silva/ai-assistant/actions/workflows/terraform-deployment.yml)
[![Frontend Lint](https://github.com/hashan-silva/ai-assistant/actions/workflows/frontend-lint.yml/badge.svg)](https://github.com/hashan-silva/ai-assistant/actions/workflows/frontend-lint.yml)
[![SonarCloud Scan](https://github.com/hashan-silva/ai-assistant/actions/workflows/sonarcloud.yml/badge.svg)](https://github.com/hashan-silva/ai-assistant/actions/workflows/sonarcloud.yml)
[![Terraform Lint & Security](https://github.com/hashan-silva/ai-assistant/actions/workflows/terraform-ci.yml/badge.svg)](https://github.com/hashan-silva/ai-assistant/actions/workflows/terraform-ci.yml)

## Architecture

- Frontend static app hosted on S3 + CloudFront
- Backend + Ollama on ECS Fargate
- ALB for backend public API
- Cognito for authentication
- Terraform manages AWS resources end-to-end

## Project layout

```text
backend/    # Spring Boot API and AI orchestration
frontend/   # Next.js chat app
terraform/  # AWS infrastructure as code
```

## Local development

Backend:
```bash
cd backend && mvn spring-boot:run
```

Frontend:
```bash
cd frontend && npm install && npm run dev
```

Docker (backend + Ollama):
```bash
docker compose up --build
```

## Backend (Spring Boot)

Responsibilities:
- Accept chat messages from frontend
- Build prompt payload from versioned instruction files
- Call Ollama and return assistant response

Build/test:
```bash
cd backend
mvn clean package
mvn test
```

Key env vars:
- `OLLAMA_BASE_URL` (default: `http://localhost:11434`)
- `OLLAMA_MODEL` (default: `qwen2.5:0.5b`)
- `AI_INSTRUCTIONS_VERSION` (default: `v1`)

AI instruction assets:
- `backend/src/main/resources/ai/<version>/`
- `system.md`
- `config.yml`
- `schema.json` (optional)

API:
- `POST /api/chat`

## Frontend (Next.js)

Run locally:
```bash
cd frontend
npm install
npm run dev
```

Build:
```bash
cd frontend
npm run build
npm run start
```

Auth routes:
- `frontend/src/app/login/page.tsx`
- `frontend/src/app/register/page.tsx`

Runtime env vars:
- `NEXT_PUBLIC_API_BASE_URL` (optional). Leave unset in production to use `/api/*` via CloudFront. Set to `http://localhost:8080` for local backend.

Main route:
Users are redirected from `/` to `/chat` after login flow.

## Terraform (AWS)

What it provisions:
- Network (VPC + public subnets)
- ECS Fargate services (backend + Ollama)
- ALB for backend API exposure
- Cognito user pool and client
- Frontend hosting (S3 + CloudFront)
- IAM deployment permissions

Usage:
```bash
cd terraform
terraform init
terraform plan
```

Use CI/CD (`terraform-deployment.yml`) for apply in shared environments.

Important outputs:
- `alb_dns_name`
- `cognito_user_pool_id`
- `cognito_user_pool_client_id`
- `frontend_bucket_name`
- `frontend_cloudfront_distribution_id`

## Deploy to AWS

Deployments are CI-driven via GitHub Actions.

Workflow `.github/workflows/terraform-deployment.yml`:
- builds backend/frontend images
- runs `terraform apply`
- reads Terraform outputs (ALB, Cognito, frontend distribution targets)
- builds frontend with runtime env values
- syncs frontend assets to S3 and invalidates CloudFront

Default AWS region is Stockholm: `eu-north-1`.

## Required GitHub secrets

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`
- `TF_API_TOKEN`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

Optional:
- `AWS_REGION` (defaults to `eu-north-1`)
- `AWS_OLLAMA_IMAGE` (defaults to `ollama/ollama:latest`)
- `SONAR_TOKEN`
- `TOKEN_CICD`
