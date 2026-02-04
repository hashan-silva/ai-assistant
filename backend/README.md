# AI Assistant Backend (Java + Spring Boot)

Backend API for the chat agent.

Responsibilities:
- Accept chat messages from frontend
- Build prompt payload from versioned instruction files
- Call Ollama and return assistant response

## Run locally

```bash
mvn spring-boot:run
```

## Build/test

```bash
mvn clean package
mvn test
```

## Key env vars

- `OLLAMA_BASE_URL` (default: `http://localhost:11434`)
- `OLLAMA_MODEL` (default: `qwen2.5:3b`)
- `AI_INSTRUCTIONS_VERSION` (default: `v1`)

## AI instruction assets

Path: `src/main/resources/ai/<version>/`

Current files include:
- `system.md`
- `config.yml`
- `schema.json` (optional)

## API

- `POST /api/chat`
