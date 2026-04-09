export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginSuccess = {
  token: string;
};

/** Clave en localStorage (JWT del panel admin). */
export const AUTH_TOKEN_KEY = 'raito_admin_token';

function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL;
  if (raw === undefined || String(raw).trim() === '') {
    throw new Error(
      'Falta VITE_API_URL. En local crea .env con VITE_API_URL=http://localhost:3000'
    );
  }
  return String(raw).trim().replace(/\/+$/, '');
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
 * POST /auth/login en el API (misma ruta que monta `app.use('/auth', authRoutes)` en raito-backend).
 */
export async function loginRequest(credentials: LoginCredentials): Promise<LoginSuccess> {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/auth/login`, {
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
