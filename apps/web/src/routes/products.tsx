import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  type Product,
  getCollections,
  getConfigData,
  getCurrentUser,
  getProduct,
  getProducts,
} from '@/lib/api';
import { CollectionsPanel } from '@/components/catalog/collections-panel';
import { isCurrentCollection } from '@/components/catalog/collection-dates';
import { ProductDetails } from '@/components/catalog/product-details';
import { ProductForm } from '@/components/catalog/product-form';
import { ProductList } from '@/components/catalog/product-list';
import { QueryState, Select } from '@/components/catalog/product-ui';

const productsQueryKey = ['products'] as const;
const collectionsQueryKey = ['collections'] as const;
const configQueryKey = ['config'] as const;

export function ProductsPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState<'products' | 'collections'>('products');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [collectionFilter, setCollectionFilter] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const currentUserQuery = useQuery({ queryKey: ['auth', 'me'], queryFn: getCurrentUser });
  const isAdmin = currentUserQuery.data?.profile.code === 'ADMIN';
  const configQuery = useQuery({ queryKey: configQueryKey, queryFn: getConfigData });
  const collectionsQuery = useQuery({ queryKey: collectionsQueryKey, queryFn: getCollections });
  const productsQuery = useQuery({
    queryKey: [...productsQueryKey, { collectionFilter, search, statusFilter }],
    queryFn: () => getProducts({
      collectionId: collectionFilter || undefined,
      isActive: statusFilter === 'all' ? undefined : statusFilter === 'active',
      search: search || undefined,
    }),
  });

  const products = productsQuery.data ?? [];
  const currentCollections = (collectionsQuery.data ?? []).filter(isCurrentCollection);

  const invalidateCatalog = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: productsQueryKey }),
      queryClient.invalidateQueries({ queryKey: collectionsQueryKey }),
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-edren-text-muted">Catálogo</p>
          <h1 className="mt-2 text-3xl font-semibold text-edren-green">Produtos</h1>
          <p className="mt-2 max-w-2xl text-sm text-edren-text-muted">
            Referências, coleções, SKUs e imagem principal que alimentam estoque, vendas e relatórios.
          </p>
        </div>
        <Badge>{isAdmin ? 'Administrador' : 'Consulta sem custo'}</Badge>
      </div>

      <div className="flex gap-2 overflow-x-auto rounded-2xl border border-edren-border bg-edren-surface p-2">
        <Button onClick={() => setActivePanel('products')} variant={activePanel === 'products' ? 'default' : 'ghost'}>
          Produtos e SKUs
        </Button>
        <Button onClick={() => setActivePanel('collections')} variant={activePanel === 'collections' ? 'default' : 'ghost'}>
          Coleções
        </Button>
      </div>

      {activePanel === 'collections' ? (
        <CollectionsPanel collections={collectionsQuery.data ?? []} isAdmin={isAdmin} loading={collectionsQuery.isLoading} onChanged={invalidateCatalog} />
      ) : (
        <div className="space-y-6">
          {isAdmin ? (
            <ProductForm
              collections={collectionsQuery.data ?? []}
              currentCollections={currentCollections}
              config={configQuery.data}
              editingProduct={editingProduct}
              onCancelEdit={() => setEditingProduct(null)}
              onSaved={async (product) => {
                setEditingProduct(null);
                await invalidateCatalog();
                await navigate({ params: { productId: product.id }, to: '/products/$productId' });
              }}
            />
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle>Lista de produtos</CardTitle>
              <CardDescription>Busque por referência ou nome e filtre por coleção/status.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-[1fr_220px_160px]">
                <Input onChange={(event) => setSearch(event.target.value)} placeholder="Buscar referência ou nome" value={search} />
                <Select value={collectionFilter} onChange={setCollectionFilter}>
                  <option value="">Todas as coleções</option>
                  {(collectionsQuery.data ?? []).map((collection) => (
                    <option key={collection.id} value={collection.id}>{collection.name}</option>
                  ))}
                </Select>
                <Select value={statusFilter} onChange={(value) => setStatusFilter(value as typeof statusFilter)}>
                  <option value="all">Todos</option>
                  <option value="active">Ativos</option>
                  <option value="inactive">Inativos</option>
                </Select>
              </div>
              <ProductList isAdmin={isAdmin} loading={productsQuery.isLoading} products={products} onEdit={setEditingProduct} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export function ProductDetailPage({ productId }: { productId: string }) {
  const queryClient = useQueryClient();
  const currentUserQuery = useQuery({ queryKey: ['auth', 'me'], queryFn: getCurrentUser });
  const isAdmin = currentUserQuery.data?.profile.code === 'ADMIN';
  const configQuery = useQuery({ queryKey: configQueryKey, queryFn: getConfigData });
  const productQuery = useQuery({ queryKey: [...productsQueryKey, productId], queryFn: () => getProduct(productId) });

  const invalidateProduct = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: productsQueryKey }),
      queryClient.invalidateQueries({ queryKey: [...productsQueryKey, productId] }),
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-edren-text-muted">Produto</p>
          <h1 className="mt-2 text-3xl font-semibold text-edren-green">Detalhe do produto</h1>
          <p className="mt-2 max-w-2xl text-sm text-edren-text-muted">
            Dados do produto, imagem principal e SKUs em uma página dedicada.
          </p>
        </div>
        <Link
          className="inline-flex h-10 items-center justify-center rounded-md border border-edren-border bg-edren-surface px-4 py-2 text-sm font-medium text-edren-green transition-colors hover:bg-edren-muted"
          to="/products"
        >
          Voltar para produtos
        </Link>
      </div>

      {productQuery.isLoading ? <QueryState empty={false} loading /> : null}
      {!productQuery.isLoading && !productQuery.data ? <QueryState empty loading={false} /> : null}
      {productQuery.data ? (
        <ProductDetails config={configQuery.data} isAdmin={isAdmin} product={productQuery.data} onChanged={invalidateProduct} />
      ) : null}
    </div>
  );
}
