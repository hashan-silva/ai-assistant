# Repository Guidelines

## Project Structure & Module Organization
- `backend/` – Spring Boot service (Maven) with domain logic under `src/main/java`, configuration + Flyway migrations under `src/main/resources`, and tests in `src/test/java`.
- `frontend/` – Next.js 14 + TypeScript app with Material UI, SCSS, and next-intl; routes live in `src/app`, shared UI in `src/components`, utilities in `src/lib`, styles in `src/styles`, and static assets in `public/`.
- `database/` – Oracle DDL in `schema/` and deterministic seed SQL in `seeds/`, mirrored by Flyway scripts.
- `terraform/` – Modules for `network`, `compute`, `cicd`, `iam` plus root stack under `terraform/`; each module follows the `main.tf`, `variables.tf`, `outputs.tf` convention for clarity.

## Product Direction & Core Flows
- Helpclub is a hiring platform that connects job seekers with job posters.
- Job posters chat with an AI agent to define requirements; the agent produces a structured job post JSON and suggests matching seekers by skills.
- Job seekers chat with an AI agent to create or update profiles; they receive email notifications when new job posts match their skills.
- AI integration uses Ollama and should keep prompts, schema definitions, and model configs versioned in the repo.

## Build, Test, and Development Commands
- `cd backend && mvn spring-boot:run` – start the API against the configured Oracle instance.
- `cd backend && mvn test` – run unit/integration tests via JUnit 5.
- `cd frontend && npm install && npm run dev` – launch the Next.js dev server on `http://localhost:3000`.
- `cd frontend && npm run build` – production build used by Docker and Terraform deploys.
- `cd terraform && terraform init && terraform plan` – validate infrastructure changes.

## Deployment & Automation
- Deployments are automated via GitHub Actions only; do not run manual Docker or Terraform applies.
- Docker images are built in CI and deployed via Terraform from the pipeline.
- Treat Terraform runs as CI-owned; local usage should be limited to `terraform plan` for validation.
- AWS deployments must use serverless components (ECS Fargate, ALB, Aurora Serverless v2) instead of EC2.
- IAM users must be scoped to least-privilege policies for the specific deployment actions they need.

## Coding Style & Naming Conventions
- Java: 4-space indentation, package names `com.helpclub.*`, classes in `PascalCase`, Spring components annotated explicitly. Auto-format with `mvn fmt:format` if added.
- TypeScript/React: follow Next.js defaults, 2-space indentation, functional components in `PascalCase`, hooks/helpers in `camelCase`. Prefer Material UI components and SCSS modules or global SCSS in `src/styles`. Run `npm run lint` to enforce ESLint + Next rules.
- Terraform: snake_case for variables, module outputs in lowercase, keep one resource block per concern.
  - Module files must stay split into `main.tf`, `variables.tf`, and `outputs.tf`; avoid reintroducing monolithic files.

## Testing Guidelines
- Backend tests live under `src/test/java`; name classes `<Feature>Tests` and cover service + repository layers. Aim for happy path + failure path per endpoint.
- Frontend tests (when added) should live beside components or under `src/__tests__`, using Playwright or React Testing Library; name files `<component>.test.tsx`.

## Commit & Pull Request Guidelines
- Commit message format: `<area>: <commit message description>` (e.g., `ci: add frontend lint workflow`, `docs: clarify branch naming`).
- Branch naming: use `<area>/<short-slug>` without issue numbers. Use `ci/` for CI/CD work (e.g., `ci/add-frontend-lint-workflow`) and `docs/` for documentation-only updates.
- Each PR should describe scope, link issues (e.g., `Fixes #123`), include screenshots/GIFs for UI tweaks, and mention any Terraform state impacts. Keep PRs focused per layer (API vs. frontend vs. infra) when possible.

## Security & Configuration Tips
- Never commit real Oracle credentials; rely on environment variables (`SPRING_DATASOURCE_URL`, `DB_PASSWORD`).
- Configure Terraform remote state (S3 + DynamoDB or equivalent) before running `apply` to avoid drift.
- Keep secrets in `.tfvars` files that are gitignored; share sample templates (e.g., `dev.tfvars.example`) when needed.
- Dockerfiles expect multi-stage builds; ensure CI caches dependencies or uses registry-based build cache to reduce deployment time.
- Store AWS IAM access keys in CI secrets only; do not commit them to the repo.

## MCP-First Workflow Expectations
- Prefer MCP servers when inspecting the Next.js app: start the dev server and connect via the Next.js MCP endpoint before reading files manually. Use MCP tools to list routes, inspect build errors, and gather diagnostics.
- When verifying UI behavior, use MCP-enabled browser automation (Playwright integration) to render pages and capture console output instead of curl-based checks.
- Document any MCP limitations (missing tooling, offline server) in PR descriptions so reviewers know why fallback methods were used.
