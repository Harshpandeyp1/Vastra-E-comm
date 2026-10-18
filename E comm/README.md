# Vastra E-Commerce Frontend

React + Vite storefront. The frontend uses the Render Spring Boot API at
`https://vastra-e-comm.onrender.com` by default.

## Run locally

```sh
npm ci
npm run dev
```

To use a local Spring Boot server instead of the deployed API, create
`.env.local` with:

```env
VITE_API_URL=http://localhost:8081
```

`VITE_API_URL` is the API origin (do not add a trailing slash or endpoint path).
Vite reads it at startup/build time, so restart the dev server after changing it.

## Deploy to Render

This repository includes a `render.yaml` Blueprint for a Render Static Site.
Create a new Blueprint from this repository, or configure a Static Site with:

- Build command: `npm ci && npm run build`
- Publish directory: `dist`
- Environment variable: `VITE_API_URL=https://vastra-e-comm.onrender.com`

The rewrite in `render.yaml` sends client-side routes to `index.html`, so
refreshing a nested React route works. If deploying without the Blueprint, add
the equivalent `/*` → `/index.html` rewrite in the Render Static Site settings.

The backend must allow browser requests from the deployed frontend's origin via
its CORS configuration. Configure that origin in Spring Boot if API requests
are blocked by CORS.
