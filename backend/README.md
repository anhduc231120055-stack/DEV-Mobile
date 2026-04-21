# Backend

## Setup

1. Copy `.env.example` to `.env`.
2. Create the MySQL schema from `database/schema.sql`.
3. Seed sample data with `database/seed.sql` if needed.
4. Install dependencies:

```bash
npm install
```

5. Start the API:

```bash
npm run dev
```

## Default URL

- Health check: `GET http://localhost:3000/api/health`
- API base: `http://localhost:3000/api`

## Notes

- React Native Android emulator can use `http://10.0.2.2:3000/api`.
- CORS origins are read from `FRONTEND_URL` as a comma-separated list.
- JWT auth requires `JWT_SECRET`.
