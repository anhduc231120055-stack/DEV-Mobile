# Frontend

This folder contains the Expo React Native mobile client.

## Main folders

- `src/navigation`: auth, user, and admin navigation flows
- `src/screens/auth`: login and register screens
- `src/screens/user`: customer-facing screens
- `src/screens/admin`: admin dashboard and management screens
- `src/components`: shared UI building blocks
- `src/context`: app state and session handling
- `src/services`: API client and domain services
- `src/types`: shared TypeScript models

## Run the app

```bash
cd frontend
npm install
npm start
```

You can also run it from the repository root:

```bash
npm run frontend:start
```

## API configuration

Create `frontend/.env` from `frontend/.env.example` only if you want to force a specific API URL.

```env
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.24:3000/api
```

If `EXPO_PUBLIC_API_BASE_URL` is not set, the app tries to auto-detect the backend host from the Expo dev server host:

- Physical phone usually resolves to your machine's LAN IP automatically
- Android emulator falls back to `http://10.0.2.2:3000/api`
- Web or iOS simulator falls back to `http://localhost:3000/api`

## Notes

- The app uses Expo and React Navigation
- The frontend is wired to the API inside this same repository
- Login session data is persisted locally between app launches
