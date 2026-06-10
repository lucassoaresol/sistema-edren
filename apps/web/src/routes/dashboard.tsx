import { useQuery } from '@tanstack/react-query';
import { AlertCircle, CheckCircle2, Database, Package, Sparkles, Tags } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getDatabaseHealth } from '@/lib/api';

export function DashboardPage() {
  const databaseHealth = useQuery({
    queryKey: ['database-health'],
    queryFn: getDatabaseHealth,
    refetchInterval: 30_000,
  });

  const seed = databaseHealth.data?.seed;

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-edren-border bg-edren-surface p-6 shadow-sm lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <Badge>Fundacao fullstack</Badge>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-edren-green lg:text-5xl">
              Painel EDREN
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-edren-text-muted">
              A aplicacao ja conversa com a API e com o banco PostgreSQL. Este painel sera
              evoluido para mostrar vendas do dia, contas a receber e estoque por referencia.
            </p>
          </div>
          <div className="rounded-2xl bg-edren-ivory px-4 py-3 text-sm font-medium text-edren-green">
            A moda que abraca. A elegancia que inspira.
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-edren-ivory text-edren-green">
              {databaseHealth.isError ? <AlertCircle className="size-5" /> : <CheckCircle2 className="size-5" />}
            </div>
            <CardTitle>Banco de dados</CardTitle>
            <CardDescription>
              {databaseHealth.isLoading && 'Verificando conexao com o PostgreSQL...'}
              {databaseHealth.isError && 'Nao foi possivel conectar ao banco.'}
              {databaseHealth.isSuccess && 'API conectada ao PostgreSQL.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-edren-text-muted">
              Endpoint: <span className="font-medium text-edren-green">/api/health/db</span>
            </p>
          </CardContent>
        </Card>

        <MetricCard
          description="Perfis iniciais carregados pelo seed."
          icon={Database}
          label="Perfis"
          value={seed?.profiles ?? '-'}
        />
        <MetricCard
          description="Colecoes iniciais disponiveis para produtos."
          icon={Tags}
          label="Colecoes"
          value={seed?.collections ?? '-'}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Proximas areas do MVP</CardTitle>
            <CardDescription>Rotas preparadas para evoluir em CRUDs reais.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {['Vendas', 'Clientes', 'Produtos', 'Estoque'].map((item) => (
                <div className="rounded-xl border border-edren-border bg-edren-background p-4" key={item}>
                  <p className="font-medium text-edren-green">{item}</p>
                  <p className="mt-1 text-sm text-edren-text-muted">Modulo em preparacao.</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-edren-ivory text-edren-green">
              <Sparkles className="size-5" />
            </div>
            <CardTitle>Valor visivel</CardTitle>
            <CardDescription>
              Esta tela confirma a primeira fatia fullstack: frontend, API e banco trabalhando juntos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 rounded-xl border border-edren-border bg-edren-background p-4">
              <Package className="size-5 text-edren-green" />
              <p className="text-sm text-edren-text-muted">
                O proximo passo pode ser autenticar usuarios ou criar o primeiro CRUD real.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

type MetricCardProps = {
  description: string;
  icon: typeof Database;
  label: string;
  value: number | string;
};

function MetricCard({ description, icon: Icon, label, value }: MetricCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-edren-ivory text-edren-green">
          <Icon className="size-5" />
        </div>
        <CardTitle>{label}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-semibold text-edren-green">{value}</p>
      </CardContent>
    </Card>
  );
}
