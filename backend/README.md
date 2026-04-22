# Backend

This folder contains the Express + MySQL API used by the mobile app.

## Setup

1. Copy `.env.example` to `.env`
2. Create the schema from `database/schema.sql`
3. Seed sample data with `database/seed.sql` if needed
4. Install dependencies:

```bash
cd backend
npm install
```

5. Start the API:

```bash
npm run dev
```

You can also run it from the repository root:

```bash
npm run backend:dev
```

## Default URLs

- Health check: `GET http://localhost:3000/api/health`
- API base: `http://localhost:3000/api`

## Notes

- `FRONTEND_URL` accepts a comma-separated list of allowed origins
- `JWT_SECRET` must be defined for authentication to work
- Android emulator clients usually connect through `http://10.0.2.2:3000/api`
