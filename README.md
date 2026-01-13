# Helpclub Monorepo

Helpclub is evolving into a hiring platform that connects job seekers with job posters through a single ChatGPT-style experience. Job posters chat with an AI agent to capture requirements, generate a structured job post JSON, and receive suggested candidates based on skills. Job seekers create profiles via AI chat and get email notifications when new jobs match their skills.

[![Terraform Lint & Security](https://github.com/hashan-silva/helpclub/actions/workflows/terraform-ci.yml/badge.svg)](https://github.com/hashan-silva/helpclub/actions/workflows/terraform-ci.yml)
[![SonarCloud Scan](https://github.com/hashan-silva/helpclub/actions/workflows/sonarcloud.yml/badge.svg)](https://github.com/hashan-silva/helpclub/actions/workflows/sonarcloud.yml)
[![Deploy to AWS](https://github.com/hashan-silva/helpclub/actions/workflows/terraform-deployment.yml/badge.svg)](https://github.com/hashan-silva/helpclub/actions/workflows/terraform-deployment.yml)
[![Frontend Lint](https://github.com/hashan-silva/helpclub/actions/workflows/frontend-lint.yml/badge.svg)](https://github.com/hashan-silva/helpclub/actions/workflows/frontend-lint.yml)

## Stack

- **Backend** – Spring Boot (Maven), Flyway migrations
- **Frontend** – Next.js 14 + TypeScript + Material UI + SCSS + next-intl
- **AI** – Ollama for chat-driven job post and profile creation
- **Database** – Oracle schema + seeds for local development
- **Terraform** – IaC for AWS serverless networking and compute

## Core flows

- Job posters chat with the AI agent to define role requirements; the agent outputs a normalized job post JSON and suggests matching seekers.
- Job seekers chat with the AI agent to create or update their profiles and skills.
- When a job post matches a seeker’s skills, an email notification is sent.

## Project layout

```
backend/    # Spring Boot service with Maven build
frontend/   # Next.js application
database/   # Oracle DDL + seed SQL
terraform/  # Modules and root Terraform stack
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

Clone the repo, install dependencies (`mvn`, `npm`), and target the Terraform stack under `terraform/` when deploying.

## Terraform deployment

Reusable modules for AWS VPC, ALB, ECS Fargate, and IAM live under `terraform/`. State is managed in Terraform Cloud.

```bash
cd terraform
terraform init
terraform plan
```

Terraform Cloud workspace: `helpclub-main` (organization `hashan-silva`).

### AWS serverless notes

- ECS Fargate runs the frontend, backend, and Ollama containers in a single task behind an Application Load Balancer.
- An IAM deploy user is created with least-privilege permissions for ECS task registration and service updates. Store the access keys in GitHub Actions secrets.
- Some ECS actions (e.g., task definition registration) require wildcard resource permissions; the policy keeps wildcard scope limited to those actions only.

Required Terraform variables (examples):

```bash
aws_region="eu-north-1"
frontend_image="ghcr.io/hashan-silva/helpclub-frontend:latest"
backend_image="ghcr.io/hashan-silva/helpclub-backend:latest"
ollama_image="ollama/ollama:latest"
```
