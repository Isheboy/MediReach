# MediReach Server

Quick notes to run the backend locally and view API docs.

Prereqs

- Node.js (v18+ recommended)
- MongoDB accessible at `MONGO_URI`

Run locally

1. Copy environment variables:

   - copy `server/.env.example` to `server/.env` and fill in real values.

2. Install deps and start dev server:

   ```powershell
   cd server
   npm install
   npm run dev
   ```

3. Optional: start reminder worker in a separate terminal:

   ```powershell
   npm run worker
   ```

API docs

- A minimal embedded OpenAPI spec is available at `GET /openapi.json`.
- If `swagger-ui-express` is installed, interactive docs will be served at `/docs`.

Smoke tests

- Use Postman or `Invoke-RestMethod` to call protected endpoints. Example invalid register test:

```powershell
Invoke-RestMethod -Uri http://localhost:5000/api/auth/register -Method POST -ContentType 'application/json' -Body '{"name":"","phone":"not-a-phone"}'
```

Notes

- The code embeds a small OpenAPI spec to avoid issues with malformed JSON files in the repo; if you prefer a file-based spec, add a valid `openapi.json` in the server root and adjust the app.
