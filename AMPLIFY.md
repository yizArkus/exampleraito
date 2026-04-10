# AWS Amplify Hosting (React + Vite + TypeScript)

Output is **`dist/`**. Build pipeline is defined in **`amplify.yml`** at the repo root.

## 1. `amplify.yml` phases

| Phase         | Commands                                                             |
| ------------- | -------------------------------------------------------------------- |
| **preBuild**  | `nvm install/use 20`, `npm ci`, `npm run lint`, `npm run type-check` |
| **build**     | `npm run build` (`tsc -b && vite build`)                             |
| **artifacts** | **`dist/`**                                                          |
| **cache**     | `node_modules/**/*`                                                  |

## 2. Environment variables (`VITE_*`)

Only variables prefixed with **`VITE_`** are exposed to the client bundle.

Set in Amplify: **Hosting** → **Environment variables**.

- **`VITE_API_URL`** — API **origin only** (no `/api` suffix), e.g. `https://api.example.com` or `http://localhost:3000`.  
  The app builds paths as `${VITE_API_URL}/api/...`.

```ts
import.meta.env.VITE_API_URL;
```

Redeploy after changing env vars. Never put server-only secrets in `VITE_*`.

## 3. SPA rewrites (React Router)

**Hosting** → **Rewrites and redirects** → add:

| Field      | Value             |
| ---------- | ----------------- | --------- | --- | --- | --- | ---- | --- | --- | --- | --- | --- | ---- | ----- | --- | --- | ---- | ---- | ------------------------- |
| **Source** | `</^[^.]+$        | \.(?!(css | gif | ico | jpg | jpeg | js  | mjs | png | txt | svg | woff | woff2 | ttf | map | json | webp | webmanifest)$)([^.]+$)/>` |
| **Target** | `/index.html`     |
| **Type**   | **200 (Rewrite)** |

## 4. Connect Git

Amplify → **Create app** → **Host web app** → connect repo/branch; `amplify.yml` is picked up automatically.

## 5. References

- [Amplify build settings](https://docs.aws.amazon.com/amplify/latest/userguide/build-settings.html)
- [Vite env variables](https://vite.dev/guide/env-and-mode.html)
