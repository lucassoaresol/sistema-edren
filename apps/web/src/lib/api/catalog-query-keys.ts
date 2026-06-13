type ProductListQueryKeyFilters = {
  collectionFilter: string;
  search: string;
  statusFilter: 'active' | 'all' | 'inactive';
};

export const catalogQueryKeys = {
  collections: ['collections'] as const,
  products: ['products'] as const,
  product: (productId: string) => [...catalogQueryKeys.products, productId] as const,
  productList: (filters: ProductListQueryKeyFilters) => [...catalogQueryKeys.products, filters] as const,
};
