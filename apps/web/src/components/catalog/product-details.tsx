import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  type Product,
  type ProductVariant,
  type VariantPayload,
  createProductVariant,
  getConfigData,
  removeMainProductImage,
  updateProductVariant,
  uploadMainProductImage,
} from '@/lib/api';
import { Select } from './product-ui';

export function ProductDetails({ config, isAdmin, onChanged, product }: {
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
