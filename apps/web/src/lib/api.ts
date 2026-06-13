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

export type CollectionStatus = 'ACTIVE' | 'ARCHIVED';

export type Collection = {
  id: string;
  name: string;
  description?: string | null;
  startDate: string;
  endDate?: string | null;
  status: CollectionStatus;
  createdAt: string;
  updatedAt: string;
};

export type ProductImage = {
  id: string;
  productId: string;
  url: string;
  publicId: string;
  isMain: boolean;
  sortOrder: number;
  createdAt: string;
};

export type ProductVariant = {
  id: string;
  productId: string;
  colorId: string;
  sizeId: string;
  isActive: boolean;
  color: Color;
  size: Size;
  createdAt: string;
  updatedAt: string;
};

export type Product = {
  id: string;
  reference: string;
  name: string;
  description?: string | null;
  salePrice: string;
  cost?: string | null;
  isActive: boolean;
  collectionId: string;
  categoryId: string;
  sizeGridId: string;
  collection: Collection;
  category: ConfigRecord;
  sizeGrid: SizeGrid;
  images: ProductImage[];
  mainImage: ProductImage | null;
  variants: ProductVariant[];
  variantsCount: number;
  createdAt: string;
  updatedAt: string;
};

export type CollectionPayload = {
  description?: string | null;
  endDate?: string | null;
  name?: string;
  startDate?: string;
  status?: CollectionStatus;
};

export type ProductPayload = {
  categoryId?: string;
  collectionId?: string;
  cost?: string | number | null;
  description?: string | null;
  isActive?: boolean;
  name?: string;
  reference?: string;
  salePrice?: string | number;
  sizeGridId?: string;
};

export type ProductFilters = {
  categoryId?: string;
  collectionId?: string;
  isActive?: boolean;
  search?: string;
};

export type VariantPayload = {
  colorId?: string;
  isActive?: boolean;
  sizeId?: string;
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

export async function getCollections() {
  const response = await request<ApiResponse<Collection[]>>('/api/collections');
  return response.data;
}

export async function createCollection(input: Required<Pick<CollectionPayload, 'name' | 'startDate'>> & CollectionPayload) {
  const response = await request<ApiResponse<Collection>>('/api/collections', {
    method: 'POST',
    body: input,
  });

  return response.data;
}

export async function updateCollection(id: string, input: CollectionPayload) {
  const response = await request<ApiResponse<Collection>>(`/api/collections/${id}`, {
    method: 'PATCH',
    body: input,
  });

  return response.data;
}

export async function getProducts(filters: ProductFilters = {}) {
  const response = await request<ApiResponse<Product[]>>(`/api/products${toQueryString(filters)}`);
  return response.data;
}

export async function getProduct(id: string) {
  const response = await request<ApiResponse<Product>>(`/api/products/${id}`);
  return response.data;
}

export async function createProduct(input: Required<Pick<ProductPayload, 'categoryId' | 'collectionId' | 'name' | 'reference' | 'salePrice' | 'sizeGridId'>> & ProductPayload) {
  const response = await request<ApiResponse<Product>>('/api/products', {
    method: 'POST',
    body: input,
  });

  return response.data;
}

export async function updateProduct(id: string, input: ProductPayload) {
  const response = await request<ApiResponse<Product>>(`/api/products/${id}`, {
    method: 'PATCH',
    body: input,
  });

  return response.data;
}

export async function getProductVariants(productId: string) {
  const response = await request<ApiResponse<ProductVariant[]>>(`/api/products/${productId}/variants`);
  return response.data;
}

export async function createProductVariant(productId: string, input: Required<Pick<VariantPayload, 'colorId' | 'sizeId'>> & VariantPayload) {
  const response = await request<ApiResponse<ProductVariant>>(`/api/products/${productId}/variants`, {
    method: 'POST',
    body: input,
  });

  return response.data;
}

export async function updateProductVariant(id: string, input: VariantPayload) {
  const response = await request<ApiResponse<ProductVariant>>(`/api/product-variants/${id}`, {
    method: 'PATCH',
    body: input,
  });

  return response.data;
}

export async function uploadMainProductImage(productId: string, file: File) {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`/api/products/${productId}/images/main`, {
    body: formData,
    credentials: 'include',
    headers: { Accept: 'application/json' },
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const data = await response.json() as ApiResponse<ProductImage>;

  return data.data;
}

export async function removeMainProductImage(productId: string) {
  const response = await request<ApiResponse<{ ok: boolean }>>(`/api/products/${productId}/images/main`, {
    method: 'DELETE',
  });

  return response.data;
}

function toQueryString(filters: ProductFilters) {
  const params = new URLSearchParams();

  if (filters.categoryId) {
    params.set('categoryId', filters.categoryId);
  }

  if (filters.collectionId) {
    params.set('collectionId', filters.collectionId);
  }

  if (filters.isActive !== undefined) {
    params.set('isActive', String(filters.isActive));
  }

  if (filters.search?.trim()) {
    params.set('search', filters.search.trim());
  }

  const query = params.toString();
  return query ? `?${query}` : '';
}
