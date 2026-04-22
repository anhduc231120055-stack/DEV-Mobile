# DEV-Mobile

This repository is now split into two clear application boundaries:

- `frontend/`: Expo React Native mobile client
- `backend/`: Express + MySQL API

The root folder only contains shared repo files and helper scripts so you can run each side without guessing where it lives.

## Project structure

```text
DEV-Mobile/
|-- frontend/
|   |-- App.tsx
|   |-- app.json
|   |-- package.json
|   `-- src/
|-- backend/
|   |-- server.js
|   |-- package.json
|   `-- database/
|-- .gitignore
|-- package.json
`-- README.md
```

## Quick start

Install each side once:

```bash
npm run install:frontend
npm run install:backend
```

Run the mobile app:

```bash
npm run frontend:start
```

Run the API:

```bash
npm run backend:dev
```

## Environment files

- `frontend/.env.example` contains the mobile API base URL example
- `backend/.env.example` contains the API server and database settings

## Notes

- Android emulator usually needs `http://10.0.2.2:3000/api` instead of `localhost`
- Physical devices should point `EXPO_PUBLIC_API_BASE_URL` to your machine's LAN IP
- Frontend-specific setup is documented in `frontend/README.md`
- Backend-specific setup is documented in `backend/README.md`
