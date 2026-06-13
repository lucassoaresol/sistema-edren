import { Link } from '@tanstack/react-router';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type Product } from '@/lib/api';
import { QueryState } from './product-ui';

export function ProductList({ isAdmin, loading, onEdit, products }: {
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
