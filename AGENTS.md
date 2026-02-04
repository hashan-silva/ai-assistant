# Repository Guidelines

## Project Mission
- This repository builds an open-source chat AI agent platform.
- The goal is to let contributors ship a practical, self-hostable assistant with a web UI, API layer, and infrastructure-as-code.
- The agent must support prompt versioning, structured outputs, and reliable integration with Ollama-based local models.

## Project Structure & Module Organization
- `backend/` - Spring Boot service (Maven); core logic in `src/main/java`, app config + AI prompt assets in `src/main/resources`, tests in `src/test/java`.
- `frontend/` - Next.js 14 + TypeScript app with Material UI and SCSS; routes in `src/app`, shared UI in `src/components`, utilities in `src/lib`, styles in `src/styles`.
- `database/` - Oracle DDL in `schema/` and deterministic seed SQL in `seeds/`, mirrored by Flyway scripts where applicable.
- `terraform/` - IaC root stack and modules (for example `network`, `compute`, `cicd`, `iam`); keep module files split into `main.tf`, `variables.tf`, and `outputs.tf`.

## Core Product Flows
- Users open a chat session in the frontend and exchange messages with the AI agent.
- The backend orchestrates prompts, model config, context handling, and structured response generation.
- Prompt templates, schema definitions, and model settings are versioned under source control so behavior changes are auditable.
- The platform should remain extensible for role-based agent experiences and future integrations.

## Build, Test, and Development Commands
- `cd backend && mvn spring-boot:run` - run the API locally.
- `cd backend && mvn test` - run backend tests (JUnit 5).
- `cd frontend && npm install && npm run dev` - run the frontend on `http://localhost:3000`.
- `cd frontend && npm run build` - create a production frontend build.
- `cd terraform && terraform init && terraform plan` - validate infrastructure changes locally.

## Deployment & Automation
- Deployments are CI-driven via GitHub Actions; avoid manual `terraform apply` and ad-hoc production deploys.
- Backend Docker images are built in CI and promoted through the pipeline.
- Frontend is deployed as static assets to S3 with CloudFront invalidation (no frontend runtime container).
- Keep AWS deployments serverless-first (ECS Fargate, ALB, managed data services) instead of EC2 hosts.
- Use least-privilege IAM permissions for deployment users, roles, and automation.

## Coding Style & Naming Conventions
- Java: 4-space indentation, package names under `com.hashan0314.aiassistant.*`, classes in `PascalCase`, explicit Spring annotations.
- TypeScript/React: 2-space indentation, components in `PascalCase`, hooks/helpers in `camelCase`, follow Next.js + ESLint defaults.
- Terraform: `snake_case` inputs, lowercase outputs, one resource block per concern.

## Testing Guidelines
- Backend tests: `backend/src/test/java`, named `<Feature>Tests`; cover happy and failure paths for APIs/services.
- Frontend tests: colocated or in `src/__tests__`, using Playwright or React Testing Library when added.

## Commit & Pull Request Guidelines
- Commit format: `<area>: <description>` (for example `backend: add chat context truncation`).
- Branch naming: `<area>/<short-slug>` (for example `docs/update-open-source-positioning`).
- PRs should describe scope, link issues (for example `Fixes #123`), and include screenshots/GIFs for UI changes.

## Security & Configuration Tips
- Never commit secrets or real credentials; use environment variables and CI secret stores.
- Keep sensitive Terraform values in ignored `.tfvars` files and commit sanitized examples only.
- Ensure prompt and model config changes are reviewed like code, especially when they affect response behavior.

## MCP-First Workflow Expectations
- Prefer MCP tooling when inspecting the Next.js app (routes, diagnostics, runtime behavior) before manual deep-dives.
- Use MCP-enabled browser automation for UI verification and console checks where available.
- If MCP tooling is unavailable, document the fallback approach in PR notes.
