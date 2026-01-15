# Helpclub Frontend

Next.js app for the freelancer marketplace experience.

## Scripts

- `npm run dev` – start dev server on http://localhost:3000
- `npm run build` – production build
- `npm run start` – run built app

## Env

Configure the backend API base URL via `NEXT_PUBLIC_API_URL`. Default pages call the Spring Boot API at `http://localhost:8080`.

Auth (Cognito):
- `NEXT_PUBLIC_COGNITO_REGION`
- `NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID`
