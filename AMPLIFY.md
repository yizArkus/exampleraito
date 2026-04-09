# Despliegue en AWS Amplify Hosting (React + Vite + TypeScript)

Este proyecto genera la SPA en **`dist/`** (no `build/`). El archivo **`amplify.yml`** en la raíz define el pipeline de build.

---

## 1. Qué hace `amplify.yml`

| Fase          | Descripción                                                  |
| ------------- | ------------------------------------------------------------ |
| **preBuild**  | `nvm use 20`, `npm ci`, `npm run lint`, `npm run type-check` |
| **build**     | `npm run build` (equivale a `tsc -b && vite build`)          |
| **artifacts** | Publica el contenido de **`dist/`**                          |
| **cache**     | `node_modules` para acelerar builds siguientes               |

Si quieres **más velocidad** y aceptas menos controles en Amplify, puedes comentar `lint` y `type-check` en `amplify.yml` (el `build` sigue ejecutando `tsc -b`).

---

## 2. Variables de entorno (`VITE_`)

Vite solo expone al cliente las variables que **empiezan por `VITE_`** (seguridad en el bundle).

### En la consola de Amplify

1. App → **Hosting** → **Environment variables** (o **Build settings** → **Environment variables**).
2. Añade pares clave/valor, por ejemplo:
   - `VITE_API_BASE_URL` = `https://api.tu-dominio.com`
   - `VITE_APP_NAME` = `RAITO Admin`

### En el código

```ts
const base = import.meta.env.VITE_API_BASE_URL;
```

### Build

Amplify inyecta esas variables **durante** `npm run build`. No hace falta `npm run build` en local con las mismas vars para que la app en producción las lea; solo deben existir en la app de Amplify.

**Nunca** pongas secretos de servidor (claves API privadas) en `VITE_*`: van al bundle público.

---

## 3. Rewrites SPA (React Router) — obligatorio

Sin esto, al recargar `/dashboard` Amplify devuelve **404** porque busca un archivo en disco.

En la consola: **App** → **Hosting** → **Rewrites and redirects** → **Add rule**.

### Regla recomendada (regex)

| Campo      | Valor             |
| ---------- | ----------------- | --------- | --- | --- | --- | ---- | --- | --- | --- | --- | --- | ---- | ----- | --- | --- | ---- | ---- | ------------------------- |
| **Source** | `</^[^.]+$        | \.(?!(css | gif | ico | jpg | jpeg | js  | mjs | png | txt | svg | woff | woff2 | ttf | map | json | webp | webmanifest)$)([^.]+$)/>` |
| **Target** | `/index.html`     |
| **Type**   | **200 (Rewrite)** |

Orden: esta regla debe **quedar por debajo** de reglas que sirvan archivos estáticos reales si las tienes; en muchos setups solo esta regla para SPA basta.

### Alternativa simple (menos precisa)

- **Source:** `/<*>`
- **Target:** `/index.html`
- **Type:** `404-200` (solo si no rompe tus rutas; la regex es más segura para assets).

Tras guardar, redeploy o espera al siguiente push.

---

## 4. Conectar el repositorio (GitHub / GitLab / Bitbucket)

### Opción A — Consola (recomendada)

1. **AWS Amplify** → **Create new app** → **Host web app**.
2. Conecta tu proveedor Git y el repositorio `raito-admin`.
3. Rama **main** (o la que uses).
4. Amplify detecta **`amplify.yml`** automáticamente.
5. **Save and deploy**.

### Opción B — AWS Amplify CLI (Gen 1)

```bash
npm install -g @aws-amplify/cli
amplify init   # solo si usas backend Amplify; para hosting puro suele bastar la consola
```

Para **solo hosting** conectado a Git, la consola suele ser más simple que el CLI.

### Opción C — GitHub Actions

Puedes desplegar con `aws amplify start-job` (API) y OIDC; no es obligatorio si usas el build integrado de Amplify con `amplify.yml`.

---

## 5. Checklist antes del primer deploy

- [ ] `package-lock.json` presente (necesario para `npm ci`).
- [ ] `amplify.yml` en la **raíz** del repo.
- [ ] Build local OK: `npm ci && npm run build` → carpeta `dist/` con `index.html`.
- [ ] Regla SPA en **Rewrites and redirects**.
- [ ] Variables `VITE_*` creadas si la app las usa.

---

## 6. Solución de problemas

| Síntoma                        | Acción                                                                                |
| ------------------------------ | ------------------------------------------------------------------------------------- |
| Build falla en `npm ci`        | `package-lock.json` desincronizado; ejecuta `npm install` local y sube el lock.       |
| Pantalla en blanco / rutas 404 | Revisa la regla SPA y que **base** de Vite sea `/` (por defecto en `vite.config.ts`). |
| Variables no llegan al cliente | Nombre `VITE_*` y redeploy tras cambiar env en Amplify.                               |

---

## 7. Referencias

- [Amplify build settings](https://docs.aws.amazon.com/amplify/latest/userguide/build-settings.html)
- [Vite env variables](https://vite.dev/guide/env-and-mode.html)
