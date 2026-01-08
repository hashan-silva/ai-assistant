# Helpclub Monorepo

Helpclub is evolving into a hiring platform that connects job seekers with job posters through a single ChatGPT-style experience. Job posters chat with an AI agent to capture requirements, generate a structured job post JSON, and receive suggested candidates based on skills. Job seekers create profiles via AI chat and get email notifications when new jobs match their skills.

## Stack

- **Backend** – Spring Boot (Maven), Oracle DB, Flyway migrations
- **Frontend** – Next.js 14 + TypeScript + Material UI + SCSS + next-intl
- **AI** – Ollama for chat-driven job post and profile creation
- **Database** – Oracle schema + seeds for local development
- **Terraform** – IaC for OCI networking, compute, and database

## Core flows

- Job posters chat with the AI agent to define role requirements; the agent outputs a normalized job post JSON and suggests matching seekers.
- Job seekers chat with the AI agent to create or update their profiles and skills.
- When a job post matches a seeker’s skills, an email notification is sent.

## Project layout

```
backend/    # Spring Boot service with Maven build
frontend/   # Next.js application
database/   # Oracle DDL + seed SQL
terraform/  # Modules and environment stack (envs/helpclub)
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

Clone the repo, install dependencies (`mvn`, `npm`), and target the Terraform environment under `terraform/envs/helpclub` when deploying.

## Terraform deployment

Reusable modules for OCI networking, compute, Oracle Autonomous Database, and environment stack under `terraform/envs/helpclub`. State is managed in Terraform Cloud.

```bash
cd terraform/envs/helpclub
terraform init
terraform plan
```

Terraform Cloud workspace: `helpclub-main` (organization `helpclub`).
