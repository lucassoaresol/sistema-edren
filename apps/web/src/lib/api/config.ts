import { type ApiResponse, request } from './request';

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
