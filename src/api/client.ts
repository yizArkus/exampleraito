/**
 * VITE_API_URL is the API host only (e.g. https://api.example.com), without /api.
 * All REST paths are built as `${origin}/api${path}`.
 */

function getApiOrigin(): string {
  const raw = import.meta.env.VITE_API_URL;
  if (raw === undefined || String(raw).trim() === '') {
    throw new Error(
      'Missing VITE_API_URL. Set it in .env or Amplify (e.g. https://api.example.com).'
    );
  }
  let origin = String(raw).trim().replace(/\/+$/, '');
  origin = origin.replace(/\/api$/i, '');
  return origin;
}

/**
 * @param path - Path under /api, must start with `/` (e.g. `/auth/login`).
 */
export function apiUrl(path: string): string {
  const origin = getApiOrigin();
  const segment = path.startsWith('/') ? path : `/${path}`;
  return `${origin}/api${segment}`.replace(/([^:]\/)\/+/g, '$1');
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

export function parseBackendErrorMessage(json: unknown): string {
  if (!isRecord(json)) return 'Request failed.';
  const err = json.error;
  if (!isRecord(err) || typeof err.message !== 'string') {
    return 'Request failed.';
  }
  return err.message;
}

export async function postJson<TResponse>(
  url: string,
  body: Record<string, unknown>
): Promise<TResponse> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(parseBackendErrorMessage(json));
  }
  return json as TResponse;
}
