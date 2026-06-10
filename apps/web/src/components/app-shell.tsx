import { Link, Outlet, useRouterState } from '@tanstack/react-router';
import {
  BarChart3,
  Boxes,
  CreditCard,
  Home,
  Package,
  ReceiptText,
  Settings,
  ShoppingBag,
  Tags,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Painel', to: '/', icon: Home },
  { label: 'Vendas', to: '/vendas', icon: ShoppingBag },
  { label: 'Clientes', to: '/clientes', icon: Users },
  { label: 'Produtos', to: '/produtos', icon: Package },
  { label: 'Colecoes', to: '/colecoes', icon: Tags },
  { label: 'Estoque', to: '/estoque', icon: Boxes },
  { label: 'Contas a receber', to: '/contas-a-receber', icon: CreditCard },
  { label: 'Relatorios', to: '/relatorios', icon: BarChart3 },
  { label: 'Configuracoes', to: '/configuracoes', icon: Settings },
] as const;

export function AppShell() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <div className="min-h-screen bg-edren-background text-edren-text">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-edren-border bg-edren-green px-5 py-6 text-edren-surface lg:flex lg:flex-col">
        <div>
          <p className="text-3xl font-semibold tracking-[0.18em]">EDREN</p>
          <p className="mt-1 text-xs uppercase tracking-[0.28em] text-edren-ivory">
            Vestuario Feminino
          </p>
        </div>

        <nav className="mt-10 flex flex-1 flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.to === '/' ? pathname === '/' : pathname.startsWith(item.to);

            return (
              <Link
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
                  isActive
                    ? 'bg-edren-ivory text-edren-green'
                    : 'text-edren-surface/80 hover:bg-edren-surface/10 hover:text-edren-surface',
                )}
                key={item.to}
                to={item.to}
              >
                <Icon className="size-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <p className="text-xs leading-5 text-edren-surface/65">
          Sistema interno para acompanhar produtos, estoque, vendas e recebiveis.
        </p>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-edren-border bg-edren-background/90 px-5 py-4 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xl font-semibold tracking-[0.18em] text-edren-green">EDREN</p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-edren-text-muted">
                Vestuario Feminino
              </p>
            </div>
            <span className="rounded-full bg-edren-ivory px-3 py-1 text-xs font-medium text-edren-green">
              MVP
            </span>
          </div>
          <nav className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {navItems.map((item) => {
              const isActive = item.to === '/' ? pathname === '/' : pathname.startsWith(item.to);

              return (
                <Link
                  className={cn(
                    'whitespace-nowrap rounded-full border px-3 py-1.5 text-xs transition-colors',
                    isActive
                      ? 'border-edren-green bg-edren-green text-edren-surface'
                      : 'border-edren-border bg-edren-surface text-edren-green',
                  )}
                  key={item.to}
                  to={item.to}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        <div className="mx-auto max-w-7xl px-5 py-8 lg:px-10 lg:py-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
