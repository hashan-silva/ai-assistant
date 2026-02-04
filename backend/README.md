# AI Assistant Backend

Spring Boot service powering the chat AI assistant API.

## Running locally

```bash
mvn spring-boot:run
```

## Building

```bash
mvn clean package
```

## AI instructions

Versioned AI instruction files live under `src/main/resources/ai/<version>/`.
Use `system.md` for the assistant system prompt.
Set `AI_INSTRUCTIONS_VERSION` to select the instruction version (defaults to `v1`).

## API endpoint

- `POST /api/chat`
