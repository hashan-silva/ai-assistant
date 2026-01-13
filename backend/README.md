# Helpclub Backend

Spring Boot service powering the Helpclub freelancer marketplace.

## Running locally

```bash
mvn spring-boot:run
```

## Building

```bash
mvn clean package
```

## Environment

Database connection defaults are stored in `src/main/resources/application.yml`. Override using standard Spring profile properties or environment variables such as `SPRING_DATASOURCE_URL`.

## AI instructions

Versioned AI instruction files live under `src/main/resources/ai/<version>/`.
Set `AI_INSTRUCTIONS_VERSION` to select the instruction version (defaults to `v1`).
