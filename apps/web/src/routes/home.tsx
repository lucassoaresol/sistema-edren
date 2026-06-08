import { ArrowRight, Boxes, ClipboardList, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const foundations = [
  {
    title: 'Produtos',
    description: 'Colecoes, referencias, SKUs e imagens com Cloudinary.',
    icon: ClipboardList,
  },
  {
    title: 'Estoque',
    description: 'Saldos por SKU e local, entradas e movimentacoes.',
    icon: Boxes,
  },
  {
    title: 'Vendas',
    description: 'Pagamentos parciais, recebiveis e cancelamentos seguros.',
    icon: CreditCard,
  },
];

export function HomePage() {
  return (
    <main className="min-h-screen bg-edren-background text-edren-text">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-12">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.35em] text-edren-green">
            Sistema Interno
          </p>
          <h1 className="text-5xl font-semibold tracking-tight text-edren-green sm:text-7xl">
            EDREN
          </h1>
          <p className="mt-2 text-sm uppercase tracking-[0.28em] text-edren-text-muted">
            Vestuario Feminino
          </p>
          <p className="mt-6 text-lg leading-8 text-edren-text-muted">
            Base inicial do sistema de gestao para produtos, estoque, vendas,
            pagamentos e contas a receber.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button>
              Preparar MVP
              <ArrowRight className="size-4" />
            </Button>
            <Button variant="secondary">Ver especificacao</Button>
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {foundations.map((item) => {
            const Icon = item.icon;

            return (
              <Card key={item.title}>
                <CardHeader>
                  <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-edren-ivory text-edren-green">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-edren-text-muted">Fundacao preparada para evoluir em telas CRUD.</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </main>
  );
}
