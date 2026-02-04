# AI Assistant Frontend (React + Next.js)

Next.js chat UI for the AI assistant.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run start
```

## Auth

Frontend uses Cognito-backed login/register API routes:
- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/register/route.ts`

## Runtime env vars

- `API_BASE_URL` (server-side proxy base URL to backend API)
- `NEXT_PUBLIC_API_BASE_URL` (public API base URL for client-side usage)
- `COGNITO_REGION`
- `COGNITO_USER_POOL_ID`
- `COGNITO_USER_POOL_CLIENT_ID`

## Main route

Users are redirected from `/` to `/chat` after login flow.
