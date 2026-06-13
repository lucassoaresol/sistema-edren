import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ColorsCard } from '@/components/settings/colors-card';
import { ConfigCard } from '@/components/settings/config-card';
import { SizeGridsCard } from '@/components/settings/size-grids-card';

type ConfigTab = 'size-grids' | 'categories' | 'colors' | 'stock-locations' | 'sales-channels' | 'payment-methods';

const sections = [
  {
    tab: 'categories',
    title: 'Categorias',
    description: 'Tipos de produto usados no catálogo.',
    path: '/api/config/categories',
  },
  {
    tab: 'stock-locations',
    title: 'Locais de estoque',
    description: 'Locais reais onde a EDREN controla saldo.',
    path: '/api/config/stock-locations',
  },
  {
    tab: 'sales-channels',
    title: 'Canais de venda',
    description: 'Origem comercial obrigatória das vendas.',
    path: '/api/config/sales-channels',
  },
  {
    tab: 'payment-methods',
    title: 'Formas de pagamento',
    description: 'Meios usados no registro de pagamentos.',
    path: '/api/config/payment-methods',
  },
] as const;

const tabs = [
  { id: 'size-grids', label: 'Grades e tamanhos' },
  { id: 'categories', label: 'Categorias' },
  { id: 'colors', label: 'Cores' },
  { id: 'stock-locations', label: 'Locais de estoque' },
  { id: 'sales-channels', label: 'Canais de venda' },
  { id: 'payment-methods', label: 'Formas de pagamento' },
] satisfies Array<{ id: ConfigTab; label: string }>;

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<ConfigTab>('size-grids');
  const activeSection = sections.find((section) => section.tab === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-edren-text-muted">Operação</p>
          <h1 className="mt-2 text-3xl font-semibold text-edren-green">Configurações</h1>
          <p className="mt-2 max-w-2xl text-sm text-edren-text-muted">
            Cadastros editáveis que alimentam produtos, estoque, vendas e pagamentos.
          </p>
        </div>
        <Badge>Somente administradores alteram</Badge>
      </div>

      <div className="flex gap-2 overflow-x-auto rounded-2xl border border-edren-border bg-edren-surface p-2">
        {tabs.map((tab) => (
          <Button
            className="shrink-0"
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            variant={activeTab === tab.id ? 'default' : 'ghost'}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {activeTab === 'size-grids' ? <SizeGridsCard /> : null}
      {activeTab === 'colors' ? <ColorsCard /> : null}
      {activeSection ? (
        <ConfigCard
          description={activeSection.description}
          path={activeSection.path}
          queryKey={activeSection.tab}
          title={activeSection.title}
        />
      ) : null}
    </div>
  );
}
