# Vercel deployment

Deploy this repository as **one Vercel multi-service project**. The root
[`vercel.json`](./vercel.json) declares the Vite frontend and Express backend as
services. Requests under `/api/` are routed to Express; all other paths go to
the frontend, including client-side routes such as `/result` and `/buy`.

## Vercel project settings

Import the repository as a single project and use:

- **Root Directory:** repository root (`.`); do not set it to `client` or
  `server`
- **Framework Preset:** Other / multi-service, with service frameworks read
  from the root `vercel.json` (`vite` for `client`, `express` for `server`)
- **Install and build settings:** use the service defaults/configuration; the
  client uses `npm ci`, `npm run build`, and `dist`, while Express has no
  separate compile step

Do not create separate frontend and backend Vercel projects for this layout.
The frontend calls relative `/api/...` URLs, so the root service rewrites route
those requests to the backend without a public backend URL or CORS setup.

## Environment variables

Add these variables to the Vercel project's Production and Preview environments.
Keep them as server-side variables; do not prefix secrets with `VITE_`:

- `MONGODB_URI`: MongoDB connection URI. The server selects the `imagify`
  database separately, so a database path in this URI is not required.
- `JWT_SECRET`: a strong, private signing secret.
- `CLIPDROP_API`: the Clipdrop API key used for image generation.

The app also supports an optional public `VITE_BACKEND_URL` override, but leave
it unset for the multi-service setup because requests should use same-origin
`/api` paths. Ensure MongoDB Atlas network access permits connections from the
deployment environment.

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
