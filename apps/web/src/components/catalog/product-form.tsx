import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  type Collection,
  type Product,
  type ProductPayload,
  createProduct,
  getConfigData,
  updateProduct,
} from '@/lib/api';
import { isCurrentCollection } from './collection-dates';
import { Field, Select } from './product-ui';

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

export function ProductForm({ collections, config, currentCollections, editingProduct, onCancelEdit, onSaved }: {
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
