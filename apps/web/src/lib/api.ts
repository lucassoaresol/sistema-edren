export type DatabaseHealth = {
  ok: boolean;
  database: 'reachable';
  seed: {
    profiles: number;
    collections: number;
  };
};

export type AuthUser = {
  id: string;
  name: string;
  username: string;
  profile: {
    code: string;
    name: string;
  };
};

type ApiResponse<T> = {
  data: T;
};

type RequestOptions = {
  body?: unknown;
  method?: string;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(path, {
    credentials: 'include',
    method: options.method ?? 'GET',
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function getDatabaseHealth() {
  return request<DatabaseHealth>('/api/health/db');
}

export async function getCurrentUser() {
  const response = await request<ApiResponse<AuthUser | null>>('/api/auth/me');
  return response.data;
}

export async function login(input: { password: string; username: string }) {
  const response = await request<ApiResponse<AuthUser>>('/api/auth/login', {
    method: 'POST',
    body: input,
  });

  return response.data;
}

export async function logout() {
  await request<ApiResponse<{ ok: boolean }>>('/api/auth/logout', {
    method: 'POST',
  });
}
