import { Link, Outlet, useRouterState } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import {
  BarChart3,
  Boxes,
  CreditCard,
  Home,
  Package,
  Settings,
  ShoppingBag,
  Tags,
  Users,
} from 'lucide-react';
import { BrandLogo } from '@/components/brand-logo';
import { Button } from '@/components/ui/button';
import { authQueryKey } from '@/lib/auth';
import { getCurrentUser, logout } from '@/lib/api';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Painel', to: '/', icon: Home },
  { label: 'Vendas', to: '/sales', icon: ShoppingBag },
  { label: 'Clientes', to: '/customers', icon: Users },
  { label: 'Produtos', to: '/products', icon: Package },
  { label: 'Coleções', to: '/collections', icon: Tags },
  { label: 'Estoque', to: '/stock', icon: Boxes },
  { label: 'Contas a receber', to: '/accounts-receivable', icon: CreditCard },
  { label: 'Relatórios', to: '/reports', icon: BarChart3 },
  { label: 'Configurações', to: '/settings', icon: Settings },
] as const;

export function AppShell() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const currentUser = useQuery({
    queryKey: authQueryKey,
    queryFn: getCurrentUser,
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      queryClient.setQueryData(authQueryKey, null);
      await navigate({ to: '/login' });
    },
  });

  if (currentUser.isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-edren-background text-edren-text-muted">
        Carregando sistema...
      </main>
    );
  }

  if (!currentUser.data) {
    void navigate({ to: '/login' });
    return null;
  }

  return (
    <div className="min-h-screen bg-edren-background text-edren-text">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-edren-border bg-edren-green px-5 py-6 text-edren-surface lg:flex lg:flex-col">
        <BrandLogo className="mx-auto h-8 w-40 text-edren-surface" />

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

        <div className="space-y-3">
          <div className="rounded-2xl bg-edren-surface/10 p-3">
            <p className="text-sm font-medium text-edren-surface">{currentUser.data.name}</p>
            <p className="mt-1 text-xs text-edren-surface/65">{currentUser.data.profile.name}</p>
          </div>
          <Button
            className="w-full justify-center border-edren-surface/20 bg-transparent text-edren-surface hover:bg-edren-surface/10"
            disabled={logoutMutation.isPending}
            onClick={() => logoutMutation.mutate()}
            variant="secondary"
          >
            Sair
          </Button>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-edren-border bg-edren-background/90 px-5 py-4 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-4">
            <div>
              <BrandLogo className="h-7 w-32 text-edren-green" />
            </div>
            <span className="rounded-full bg-edren-ivory px-3 py-1 text-xs font-medium text-edren-green">
              {currentUser.data.name}
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
