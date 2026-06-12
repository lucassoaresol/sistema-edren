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

export type ConfigRecord = {
  id: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Size = {
  id: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
  gridId: string;
  createdAt: string;
  updatedAt: string;
};

export type SizeGrid = ConfigRecord & {
  sizes: Size[];
};

export type Color = Omit<ConfigRecord, 'description'> & {
  slug?: string | null;
};

export type ConfigPayload = {
  description?: string | null;
  isActive?: boolean;
  name?: string;
};

export type ColorPayload = {
  isActive?: boolean;
  name?: string;
  slug?: string | null;
};

export type SizePayload = {
  isActive?: boolean;
  name?: string;
  sortOrder?: number;
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

export async function getConfigData() {
  const [sizeGrids, categories, colors, stockLocations, salesChannels, paymentMethods] = await Promise.all([
    getSizeGrids(),
    getConfigRecords('/api/config/categories'),
    getColors(),
    getConfigRecords('/api/config/stock-locations'),
    getConfigRecords('/api/config/sales-channels'),
    getConfigRecords('/api/config/payment-methods'),
  ]);

  return {
    sizeGrids,
    categories,
    colors,
    stockLocations,
    salesChannels,
    paymentMethods,
  };
}

export async function getSizeGrids() {
  const response = await request<ApiResponse<SizeGrid[]>>('/api/config/size-grids');
  return response.data;
}

export async function getConfigRecords(path: string) {
  const response = await request<ApiResponse<ConfigRecord[]>>(path);
  return response.data;
}

export async function getColors() {
  const response = await request<ApiResponse<Color[]>>('/api/config/colors');
  return response.data;
}

export async function createConfigRecord(path: string, input: ConfigPayload) {
  const response = await request<ApiResponse<ConfigRecord>>(path, {
    method: 'POST',
    body: input,
  });

  return response.data;
}

export async function updateConfigRecord(path: string, id: string, input: ConfigPayload) {
  const response = await request<ApiResponse<ConfigRecord>>(`${path}/${id}`, {
    method: 'PATCH',
    body: input,
  });

  return response.data;
}

export async function createColor(input: ColorPayload) {
  const response = await request<ApiResponse<Color>>('/api/config/colors', {
    method: 'POST',
    body: input,
  });

  return response.data;
}

export async function updateColor(id: string, input: ColorPayload) {
  const response = await request<ApiResponse<Color>>(`/api/config/colors/${id}`, {
    method: 'PATCH',
    body: input,
  });

  return response.data;
}

export async function createSize(gridId: string, input: Required<Pick<SizePayload, 'name' | 'sortOrder'>>) {
  const response = await request<ApiResponse<Size>>(`/api/config/size-grids/${gridId}/sizes`, {
    method: 'POST',
    body: input,
  });

  return response.data;
}

export async function updateSize(id: string, input: SizePayload) {
  const response = await request<ApiResponse<Size>>(`/api/config/sizes/${id}`, {
    method: 'PATCH',
    body: input,
  });

  return response.data;
}
