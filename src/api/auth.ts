import { apiUrl, postJson } from './client';

export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginSuccess = {
  token: string;
};

export const AUTH_TOKEN_KEY = 'raito_admin_token';

type LoginResponse = {
  success: true;
  data: {
    token: string;
    user: { id: string; email: string };
  };
};

function isLoginResponse(json: unknown): json is LoginResponse {
  if (typeof json !== 'object' || json === null) return false;
  const o = json as Record<string, unknown>;
  if (o.success !== true || typeof o.data !== 'object' || o.data === null) return false;
  const data = o.data as Record<string, unknown>;
  return typeof data.token === 'string' && data.token.length > 0;
}

export async function loginRequest(credentials: LoginCredentials): Promise<LoginSuccess> {
  const json = await postJson<unknown>(apiUrl('/auth/login'), {
    email: credentials.email,
    password: credentials.password,
  });

  if (!isLoginResponse(json)) {
    throw new Error('Invalid server response.');
  }

  localStorage.setItem(AUTH_TOKEN_KEY, json.data.token);
  return { token: json.data.token };
}
