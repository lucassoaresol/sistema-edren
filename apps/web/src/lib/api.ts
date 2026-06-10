export type DatabaseHealth = {
  ok: boolean;
  database: 'reachable';
  seed: {
    profiles: number;
    collections: number;
  };
};

async function request<T>(path: string): Promise<T> {
  const response = await fetch(path, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function getDatabaseHealth() {
  return request<DatabaseHealth>('/api/health/db');
}
