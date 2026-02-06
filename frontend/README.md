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

Frontend uses backend auth API routes:
- `src/app/login/page.tsx`
- `src/app/register/page.tsx`

## Runtime env vars

- `NEXT_PUBLIC_API_BASE_URL` (public base URL to backend API, for example `http://<alb-dns>`)

## Main route

Users are redirected from `/` to `/chat` after login flow.
