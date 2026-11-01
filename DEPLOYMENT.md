# Vercel deployment

Deploy this repository as **two Vercel projects**. The frontend is a static Vite
site, while the backend is an Express application that Vercel runs as a
serverless function. Both projects can be connected to the same Git repository.

## Frontend project

Create a Vercel project for this repository with these settings:

- **Root Directory:** `client`
- **Framework Preset:** Vite
- **Install Command:** `npm ci`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

These settings are also recorded in `client/vercel.json`. Its rewrite sends
client-side routes such as `/result` and `/buy` to the React entry page.

Add this environment variable to the frontend project's Production and Preview
environments:

- `VITE_BACKEND_URL`: the backend project's HTTPS origin, with no trailing
  slash (for example, `https://your-api.vercel.app`). This value is public in
  the built frontend; do not put credentials or API keys in it.

## Backend project

Create a second Vercel project for the same repository:

- **Root Directory:** `server`
- **Framework Preset:** Express
- **Install Command:** `npm ci`
- **Build Command:** leave at the Express preset default (there is no compile
  step)
- **Output Directory:** none; Vercel runs the exported Express app as a
  serverless function.

`server/index.js` exports the Express app for Vercel. The app handles the
existing `/api/user/...` and `/api/image/...` routes directly. The local
`npm run server` command remains available and starts a regular HTTP listener.

Add these environment variables to the backend project's Production and
Preview environments. Keep them server-side; do not add them to the frontend
project or use a `VITE_` prefix:

- `MONGODB_URI`: MongoDB connection URI. The server selects the `imagify`
  database separately, so a database path in this URI is not required.
- `JWT_SECRET`: a strong, private signing secret.
- `CLIPDROP_API`: the Clipdrop API key used for image generation.

After deploying the backend, copy its HTTPS origin into the frontend's
`VITE_BACKEND_URL`, then redeploy the frontend because Vite embeds that value at
build time. Ensure the MongoDB Atlas network access rules allow connections
from the deployment environment.

## Local development and checks

Run the API from `server` with `npm run server` and the frontend from `client`
with `npm run dev`. Vite proxies `/api` requests to `http://localhost:4000`, so
local frontend development does not need `VITE_BACKEND_URL`. Local backend
secrets belong in `server/.env`, which is ignored by Git.

From `client`, run `npm ci`, `npm run lint`, and `npm run build`. From `server`,
run `npm ci` and `node --check server.js`.

## Runtime considerations

- The current API does not accept uploaded files and does not write user data
  or generated images to local disk. User records are stored in MongoDB.
- Image generation calls Clipdrop during the request and returns its PNG as a
  base64 data URL in JSON. This behavior is preserved, but large image
  responses can hit Vercel's function payload limits. If that happens, use
  object storage for generated images and return a URL instead.
- There are no background jobs or WebSocket connections in the current
  implementation. Image generation does wait for Clipdrop, so unusually slow
  responses can run into the function's execution-duration limit.
- The credit purchase screen currently displays plans but does not implement a
  payment request/checkout flow.

## Repository secret cleanup

The existing `server/.env` was tracked by Git before this deployment setup.
It is now excluded from future commits, but removing it from the latest
revision does not erase it from prior Git history. Rotate any credentials that
were stored there, especially if the repository or its history was shared.
