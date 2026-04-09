export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginSuccess = {
  token: string;
};

export async function loginRequest(credentials: LoginCredentials): Promise<LoginSuccess> {
  await new Promise(resolve => setTimeout(resolve, 600));

  if (!credentials.email.includes('@')) {
    throw new Error('Credenciales inválidas');
  }

  return { token: 'demo-token' };
}
