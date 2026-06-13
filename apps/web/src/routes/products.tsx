import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  type Collection,
  type CollectionPayload,
  type Product,
  type ProductPayload,
  type ProductVariant,
  type VariantPayload,
  createCollection,
  createProduct,
  createProductVariant,
  getCollections,
  getConfigData,
  getCurrentUser,
  getProduct,
  getProducts,
  removeMainProductImage,
  uploadMainProductImage,
  updateCollection,
  updateProduct,
  updateProductVariant,
} from '@/lib/api';

const productsQueryKey = ['products'] as const;
const collectionsQueryKey = ['collections'] as const;
const configQueryKey = ['config'] as const;

type ProductFormState = {
  categoryId: string;
  collectionId: string;
  cost: string;
  description: string;
  isActive: boolean;
  name: string;
  reference: string;
  salePrice: string;
  sizeGridId: string;
};

type CollectionFormState = {
  description: string;
  endDate: string;
  name: string;
  startDate: string;
};

const emptyProductForm: ProductFormState = {
  categoryId: '',
  collectionId: '',
  cost: '',
  description: '',
  isActive: true,
  name: '',
  reference: '',
  salePrice: '',
  sizeGridId: '',
};

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
        <CollectionsPanel
          collections={collectionsQuery.data ?? []}
          isAdmin={isAdmin}
          loading={collectionsQuery.isLoading}
          onChanged={invalidateCatalog}
        />
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
                <ProductList
                  isAdmin={isAdmin}
                  loading={productsQuery.isLoading}
                  products={products}
                  onEdit={setEditingProduct}
                />
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
        <ProductDetails
          config={configQuery.data}
          isAdmin={isAdmin}
          product={productQuery.data}
          onChanged={invalidateProduct}
        />
      ) : null}
    </div>
  );
}

function CollectionsPanel({ collections, isAdmin, loading, onChanged }: {
  collections: Collection[];
  isAdmin: boolean;
  loading: boolean;
  onChanged: () => Promise<void>;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(() => toDateInputValue(new Date()));
  const [endDate, setEndDate] = useState('');
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(null);
  const [editingCollectionForm, setEditingCollectionForm] = useState<CollectionFormState>({
    description: '',
    endDate: '',
    name: '',
    startDate: '',
  });

  const createMutation = useMutation({
    mutationFn: (input: Required<Pick<CollectionPayload, 'name' | 'startDate'>> & CollectionPayload) => createCollection(input),
    onError: () => toast.error('Não foi possível salvar a coleção.'),
    onSuccess: async () => {
      setName('');
      setDescription('');
      setStartDate(toDateInputValue(new Date()));
      setEndDate('');
      await onChanged();
      toast.success('Coleção salva.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: CollectionPayload }) => updateCollection(id, input),
    onError: () => toast.error('Não foi possível atualizar a coleção.'),
    onSuccess: async () => {
      setEditingCollectionId(null);
      await onChanged();
      toast.success('Coleção atualizada.');
    },
  });

  const startEditingCollection = (collection: Collection) => {
    setEditingCollectionId(collection.id);
    setEditingCollectionForm({
      description: collection.description ?? '',
      endDate: collection.endDate ? toDateInputValue(new Date(collection.endDate)) : '',
      name: collection.name,
      startDate: toDateInputValue(new Date(collection.startDate)),
    });
  };

  const saveEditingCollection = (collection: Collection) => {
    updateMutation.mutate({
      id: collection.id,
      input: {
        description: editingCollectionForm.description || null,
        endDate: editingCollectionForm.endDate || null,
        name: editingCollectionForm.name,
        startDate: editingCollectionForm.startDate,
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Coleções</CardTitle>
        <CardDescription>Organize referências por coleção. O MVP usa apenas ativa ou arquivada.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAdmin ? (
          <form
            className="grid gap-3 md:grid-cols-[1fr_1fr_160px_160px_auto]"
            onSubmit={(event) => {
              event.preventDefault();
              createMutation.mutate({ description: description || null, endDate: endDate || null, name, startDate });
            }}
          >
            <Input onChange={(event) => setName(event.target.value)} placeholder="Nome da coleção" required value={name} />
            <Input onChange={(event) => setDescription(event.target.value)} placeholder="Descrição opcional" value={description} />
            <Input onChange={(event) => setStartDate(event.target.value)} required type="date" value={startDate} />
            <Input onChange={(event) => setEndDate(event.target.value)} type="date" value={endDate} />
            <Button disabled={createMutation.isPending} type="submit">Adicionar</Button>
          </form>
        ) : null}
        <QueryState empty={collections.length === 0} loading={loading} />
        <div className="grid gap-3 md:grid-cols-2">
          {collections.map((collection) => {
            const isEditing = editingCollectionId === collection.id;

            return (
              <div className="rounded-2xl border border-edren-border bg-edren-background/60 p-4" key={collection.id}>
                {isEditing ? (
                  <form
                    className="space-y-3"
                    onSubmit={(event) => {
                      event.preventDefault();
                      saveEditingCollection(collection);
                    }}
                  >
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Nome da coleção">
                        <Input onChange={(event) => setEditingCollectionForm({ ...editingCollectionForm, name: event.target.value })} required value={editingCollectionForm.name} />
                      </Field>
                      <Field label="Descrição">
                        <Input onChange={(event) => setEditingCollectionForm({ ...editingCollectionForm, description: event.target.value })} value={editingCollectionForm.description} />
                      </Field>
                      <Field label="Data de início">
                        <Input onChange={(event) => setEditingCollectionForm({ ...editingCollectionForm, startDate: event.target.value })} required type="date" value={editingCollectionForm.startDate} />
                      </Field>
                      <Field label="Data de fim">
                        <Input onChange={(event) => setEditingCollectionForm({ ...editingCollectionForm, endDate: event.target.value })} type="date" value={editingCollectionForm.endDate} />
                      </Field>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button disabled={updateMutation.isPending} size="sm" type="submit">Salvar</Button>
                      <Button onClick={() => setEditingCollectionId(null)} size="sm" type="button" variant="secondary">Cancelar</Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-edren-green">{collection.name}</p>
                        {collection.description ? <p className="mt-1 text-sm text-edren-text-muted">{collection.description}</p> : null}
                        <p className="mt-1 text-xs text-edren-text-muted">
                          {formatDate(collection.startDate)} a {collection.endDate ? formatDate(collection.endDate) : 'sem data de fim'}
                        </p>
                      </div>
                      <Badge className={collection.status === 'ARCHIVED' ? 'bg-red-50 text-red-800' : undefined}>
                        {collection.status === 'ACTIVE' ? 'Ativa' : 'Arquivada'}
                      </Badge>
                    </div>
                    {isAdmin ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button onClick={() => startEditingCollection(collection)} size="sm" variant="ghost">Editar</Button>
                        <Button
                          onClick={() => updateMutation.mutate({
                            id: collection.id,
                            input: { status: collection.status === 'ACTIVE' ? 'ARCHIVED' : 'ACTIVE' },
                          })}
                          size="sm"
                          variant="secondary"
                        >
                          {collection.status === 'ACTIVE' ? 'Arquivar' : 'Reativar'}
                        </Button>
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function ProductList({ isAdmin, loading, onEdit, products }: {
  isAdmin: boolean;
  loading: boolean;
  onEdit: (product: Product) => void;
  products: Product[];
}) {
  if (loading || products.length === 0) {
    return <QueryState empty={products.length === 0} loading={loading} />;
  }

  return (
    <div className="grid gap-3">
      {products.map((product) => (
        <div
          className="rounded-2xl border border-edren-border bg-edren-surface p-4 transition-colors hover:border-edren-green/50"
          key={product.id}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{product.reference}</Badge>
                <Badge className={product.isActive ? undefined : 'bg-red-50 text-red-800'}>{product.isActive ? 'Ativo' : 'Inativo'}</Badge>
                {product.mainImage ? <Badge>Com imagem</Badge> : <Badge>Sem imagem</Badge>}
              </div>
              <h3 className="mt-3 text-lg font-semibold text-edren-green">{product.name}</h3>
              <p className="mt-1 text-sm text-edren-text-muted">
                {product.collection.name} · {product.category.name} · {product.variantsCount} SKUs
              </p>
              <p className="mt-2 text-sm font-medium text-edren-text">Venda R$ {product.salePrice}</p>
              {isAdmin && product.cost ? <p className="mt-1 text-xs text-edren-text-muted">Custo R$ {product.cost}</p> : null}
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <Link
                className="inline-flex h-9 items-center justify-center rounded-md border border-edren-border bg-edren-surface px-3 text-sm font-medium text-edren-green transition-colors hover:bg-edren-muted"
                params={{ productId: product.id }}
                to="/products/$productId"
              >
                Ver detalhes
              </Link>
              {isAdmin ? <Button onClick={() => onEdit(product)} size="sm" variant="ghost">Editar</Button> : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductForm({ collections, config, currentCollections, editingProduct, onCancelEdit, onSaved }: {
  collections: Collection[];
  config?: Awaited<ReturnType<typeof getConfigData>>;
  currentCollections: Collection[];
  editingProduct: Product | null;
  onCancelEdit: () => void;
  onSaved: (product: Product) => Promise<void>;
}) {
  const [form, setForm] = useState<ProductFormState>(emptyProductForm);
  const isEditing = Boolean(editingProduct);

  useEffect(() => {
    if (editingProduct) {
      setForm({
        categoryId: editingProduct.categoryId,
        collectionId: editingProduct.collectionId,
        cost: editingProduct.cost ?? '',
        description: editingProduct.description ?? '',
        isActive: editingProduct.isActive,
        name: editingProduct.name,
        reference: editingProduct.reference,
        salePrice: editingProduct.salePrice,
        sizeGridId: editingProduct.sizeGridId,
      });
      return;
    }

    setForm((current) => ({
      ...current,
      categoryId: current.categoryId || config?.categories[0]?.id || '',
      collectionId: current.collectionId || currentCollections[0]?.id || '',
      sizeGridId: current.sizeGridId || config?.sizeGrids[0]?.id || '',
    }));
  }, [config, currentCollections, editingProduct]);

  const cancelEdit = () => {
    setForm(emptyProductForm);
    onCancelEdit();
  };

  const collectionOptions = editingProduct
    ? collections.filter((collection) => collection.id === editingProduct.collectionId || isCurrentCollection(collection))
    : currentCollections;

  const mutation = useMutation({
    mutationFn: async () => {
      const payload: ProductPayload = {
        categoryId: form.categoryId,
        collectionId: form.collectionId,
        cost: form.cost || null,
        description: form.description || null,
        isActive: form.isActive,
        name: form.name,
        reference: form.reference,
        salePrice: form.salePrice,
        sizeGridId: form.sizeGridId,
      };

      return editingProduct ? updateProduct(editingProduct.id, payload) : createProduct(payload as Required<Pick<ProductPayload, 'categoryId' | 'collectionId' | 'name' | 'reference' | 'salePrice' | 'sizeGridId'>> & ProductPayload);
    },
    onError: () => toast.error('Não foi possível salvar o produto.'),
    onSuccess: async (product) => {
      setForm(emptyProductForm);
      await onSaved(product);
      toast.success('Produto salvo.');
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Editar produto' : 'Novo produto'}</CardTitle>
        <CardDescription>Referência, preço, custo, categoria, coleção, grade e imagem principal opcional.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4 md:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            mutation.mutate();
          }}
        >
          <Field label="Referência"><Input onChange={(event) => setForm({ ...form, reference: event.target.value })} required value={form.reference} /></Field>
          <Field label="Nome"><Input onChange={(event) => setForm({ ...form, name: event.target.value })} required value={form.name} /></Field>
          <Field label="Preço de venda"><Input min="0" onChange={(event) => setForm({ ...form, salePrice: event.target.value })} required step="0.01" type="number" value={form.salePrice} /></Field>
          <Field label="Custo opcional"><Input min="0" onChange={(event) => setForm({ ...form, cost: event.target.value })} step="0.01" type="number" value={form.cost} /></Field>
          <Field label="Coleção"><Select value={form.collectionId} onChange={(value) => setForm({ ...form, collectionId: value })}>{collectionOptions.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</Select></Field>
          <Field label="Categoria"><Select value={form.categoryId} onChange={(value) => setForm({ ...form, categoryId: value })}>{(config?.categories ?? []).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</Select></Field>
          <Field label="Grade de tamanho"><Select disabled={isEditing} value={form.sizeGridId} onChange={(value) => setForm({ ...form, sizeGridId: value })}>{(config?.sizeGrids ?? []).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</Select></Field>
          <Field label="Status"><Select value={form.isActive ? 'true' : 'false'} onChange={(value) => setForm({ ...form, isActive: value === 'true' })}><option value="true">Ativo</option><option value="false">Inativo</option></Select></Field>
          <label className="space-y-2 md:col-span-2">
            <Label>Descrição opcional</Label>
            <textarea
              className="min-h-24 w-full rounded-xl border border-edren-border bg-edren-surface px-3 py-2 text-sm outline-none focus:border-edren-green focus:ring-2 focus:ring-edren-green/15"
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              value={form.description}
            />
          </label>
          <div className="flex flex-wrap gap-2 md:col-span-2">
            <Button disabled={mutation.isPending} type="submit">{isEditing ? 'Salvar alterações' : 'Criar produto'}</Button>
            {isEditing ? <Button onClick={cancelEdit} type="button" variant="secondary">Cancelar edição</Button> : null}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function ProductDetails({ config, isAdmin, onChanged, product }: {
  config?: Awaited<ReturnType<typeof getConfigData>>;
  isAdmin: boolean;
  onChanged: () => Promise<void>;
  product: Product | null;
}) {
  const [variantColorId, setVariantColorId] = useState('');
  const [variantSizeId, setVariantSizeId] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    setVariantColorId(config?.colors.find((color) => color.isActive)?.id ?? '');
    setVariantSizeId(product?.sizeGrid.sizes.find((size) => size.isActive)?.id ?? '');
  }, [config, product]);

  const createVariantMutation = useMutation({
    mutationFn: (input: Required<Pick<VariantPayload, 'colorId' | 'sizeId'>> & VariantPayload) => createProductVariant(product?.id ?? '', input),
    onError: () => toast.error('Não foi possível salvar o SKU.'),
    onSuccess: async () => {
      await onChanged();
      toast.success('SKU salvo.');
    },
  });

  const updateVariantMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: VariantPayload }) => updateProductVariant(id, input),
    onError: () => toast.error('Não foi possível atualizar o SKU.'),
    onSuccess: async () => {
      await onChanged();
      toast.success('SKU atualizado.');
    },
  });

  const imageMutation = useMutation({
    mutationFn: (file: File) => uploadMainProductImage(product?.id ?? '', file),
    onError: () => toast.error('Não foi possível salvar a imagem.'),
    onSuccess: async () => {
      setImageFile(null);
      await onChanged();
      toast.success('Imagem salva.');
    },
  });

  const removeImageMutation = useMutation({
    mutationFn: () => removeMainProductImage(product?.id ?? ''),
    onError: () => toast.error('Não foi possível remover a imagem.'),
    onSuccess: async () => {
      await onChanged();
      toast.success('Imagem removida.');
    },
  });

  if (!product) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Detalhe do produto</CardTitle>
          <CardDescription>Selecione ou crie um produto para gerenciar SKUs.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{product.reference}</CardTitle>
          <CardDescription>{product.name}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-edren-border bg-edren-background">
            {product.mainImage ? (
              <img alt={product.name} className="h-52 w-full object-cover" src={product.mainImage.url} />
            ) : (
              <div className="flex h-52 items-center justify-center text-sm text-edren-text-muted">Produto sem imagem</div>
            )}
          </div>
          <div className="grid gap-2 text-sm">
            <p><span className="font-medium text-edren-green">Coleção:</span> {product.collection.name}</p>
            <p><span className="font-medium text-edren-green">Grade:</span> {product.sizeGrid.name}</p>
            <p><span className="font-medium text-edren-green">Preço:</span> R$ {product.salePrice}</p>
            {isAdmin && product.cost ? <p><span className="font-medium text-edren-green">Custo:</span> R$ {product.cost}</p> : null}
          </div>
        </CardContent>
      </Card>

      {isAdmin ? (
        <Card>
          <CardHeader>
            <CardTitle>Imagem principal</CardTitle>
            <CardDescription>Envie a foto principal do produto para o Cloudinary.</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                if (!imageFile) {
                  toast.error('Selecione uma imagem para enviar.');
                  return;
                }
                imageMutation.mutate(imageFile);
              }}
            >
              <Input
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
                required={!product.mainImage}
                type="file"
              />
              <p className="text-xs text-edren-text-muted">Formatos aceitos: JPG, PNG, WebP ou GIF até 5 MB.</p>
              <div className="flex flex-wrap gap-2">
                <Button disabled={imageMutation.isPending} type="submit">Enviar imagem</Button>
                {product.mainImage ? <Button onClick={() => removeImageMutation.mutate()} type="button" variant="secondary">Remover</Button> : null}
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>SKUs</CardTitle>
          <CardDescription>Variações por cor e tamanho da grade {product.sizeGrid.name}.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAdmin ? (
            <form
              className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]"
              onSubmit={(event) => {
                event.preventDefault();
                createVariantMutation.mutate({ colorId: variantColorId, sizeId: variantSizeId });
              }}
            >
              <Select value={variantColorId} onChange={setVariantColorId}>{(config?.colors ?? []).filter((color) => color.isActive).map((color) => <option key={color.id} value={color.id}>{color.name}</option>)}</Select>
              <Select value={variantSizeId} onChange={setVariantSizeId}>{product.sizeGrid.sizes.filter((size) => size.isActive).map((size) => <option key={size.id} value={size.id}>{size.name}</option>)}</Select>
              <Button disabled={createVariantMutation.isPending} type="submit">Adicionar SKU</Button>
            </form>
          ) : null}
          {product.variants.length === 0 ? <p className="rounded-xl bg-edren-muted px-3 py-2 text-sm text-edren-text-muted">Nenhum SKU cadastrado.</p> : null}
          <div className="grid gap-2">
            {product.variants.map((variant) => (
              <VariantRow
                isAdmin={isAdmin}
                key={variant.id}
                onToggle={(item) => updateVariantMutation.mutate({ id: item.id, input: { isActive: !item.isActive } })}
                variant={variant}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function VariantRow({ isAdmin, onToggle, variant }: {
  isAdmin: boolean;
  onToggle: (variant: ProductVariant) => void;
  variant: ProductVariant;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-edren-border bg-edren-surface px-3 py-2">
      <div>
        <p className="font-medium text-edren-green">{variant.color.name} / {variant.size.name}</p>
        <p className="text-xs text-edren-text-muted">SKU por cor e tamanho</p>
      </div>
      <div className="flex items-center gap-2">
        <Badge className={variant.isActive ? undefined : 'bg-red-50 text-red-800'}>{variant.isActive ? 'Ativo' : 'Inativo'}</Badge>
        {isAdmin ? <Button onClick={() => onToggle(variant)} size="sm" variant="secondary">{variant.isActive ? 'Inativar' : 'Ativar'}</Button> : null}
      </div>
    </div>
  );
}

function Field({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <label className="space-y-2">
      <Label>{label}</Label>
      {children}
    </label>
  );
}

function Select({ children, disabled, onChange, value }: {
  children: React.ReactNode;
  disabled?: boolean;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <select
      className="h-11 w-full rounded-xl border border-edren-border bg-edren-surface px-3 text-sm text-edren-text outline-none transition-colors focus:border-edren-green focus:ring-2 focus:ring-edren-green/15 disabled:opacity-60"
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      value={value}
    >
      {children}
    </select>
  );
}

function QueryState({ empty, loading }: { empty: boolean; loading: boolean }) {
  if (loading) {
    return <p className="rounded-xl bg-edren-muted px-3 py-2 text-sm text-edren-text-muted">Carregando catálogo...</p>;
  }

  if (empty) {
    return <p className="rounded-xl bg-edren-muted px-3 py-2 text-sm text-edren-text-muted">Nenhum registro encontrado.</p>;
  }

  return null;
}

function isCurrentCollection(collection: Collection) {
  const now = new Date();
  const startDate = new Date(collection.startDate);
  const endDate = collection.endDate ? endOfDay(new Date(collection.endDate)) : null;
  return collection.status === 'ACTIVE' && startDate <= now && (!endDate || endDate >= now);
}

function endOfDay(date: Date) {
  const value = new Date(date);
  value.setUTCHours(23, 59, 59, 999);
  return value;
}

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(new Date(value));
}
