export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginSuccess = {
  token: string;
};

/** Clave en localStorage (JWT del panel admin). */
export const AUTH_TOKEN_KEY = 'raito_admin_token';

/**
 * Raíz del API donde Express monta `app.use('/api', apiRouter)`.
 * - Puedes poner `VITE_API_URL` con o sin `/api` al final:
 *   - `https://host` → se usa `https://host/api/...`
 *   - `https://host/api` → se usa `https://host/api/...` (sin duplicar)
 * Local típico: `http://localhost:3000` → `http://localhost:3000/api/auth/login`
 */
function getApiRoot(): string {
  const raw = import.meta.env.VITE_API_URL;
  if (raw === undefined || String(raw).trim() === '') {
    throw new Error(
      'Falta VITE_API_URL. Ej.: VITE_API_URL=http://localhost:3000 o https://tu-cloudfront.net/api'
    );
  }
  let base = String(raw).trim().replace(/\/+$/, '');
  if (!base.endsWith('/api')) {
    base = `${base}/api`;
  }
  return base;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function parseErrorMessage(json: unknown): string {
  if (!isRecord(json)) return 'Error al iniciar sesión.';
  const err = json.error;
  if (!isRecord(err) || typeof err.message !== 'string') {
    return 'Error al iniciar sesión.';
  }
  return err.message;
}

/**
 * POST /api/auth/login (router: apiRouter.use('/auth', authRoutes) → POST /login).
 */
export async function loginRequest(credentials: LoginCredentials): Promise<LoginSuccess> {
  const root = getApiRoot();
  const res = await fetch(`${root}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const json: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(parseErrorMessage(json));
  }

  if (!isRecord(json) || json.success !== true || !isRecord(json.data)) {
    throw new Error('Respuesta inválida del servidor.');
  }

  const data = json.data as Record<string, unknown>;
  const token = data.token;
  if (typeof token !== 'string' || token.length === 0) {
    throw new Error('Respuesta inválida del servidor.');
  }

  localStorage.setItem(AUTH_TOKEN_KEY, token);

  return { token };
}
