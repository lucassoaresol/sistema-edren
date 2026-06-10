import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';
import { AppShell } from '@/components/app-shell';
import { DashboardPage } from '@/routes/dashboard';
import { PlaceholderPage } from '@/routes/placeholder';

const rootRoute = createRootRoute({
  component: AppShell,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
});

const placeholderRoutes = [
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/vendas',
    component: () => <PlaceholderPage description="Venda rapida, pagamentos e baixa de estoque." title="Vendas" />,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/clientes',
    component: () => <PlaceholderPage description="Cadastro e historico das clientes." title="Clientes" />,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/produtos',
    component: () => <PlaceholderPage description="Referencias, colecoes, SKUs e imagens." title="Produtos" />,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/colecoes',
    component: () => <PlaceholderPage description="Organizacao dos produtos por colecao." title="Colecoes" />,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/estoque',
    component: () => <PlaceholderPage description="Saldos por SKU e local, entradas e movimentacoes." title="Estoque" />,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/contas-a-receber',
    component: () => <PlaceholderPage description="Saldos em aberto e historico financeiro." title="Contas a receber" />,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/relatorios',
    component: () => <PlaceholderPage description="Vendas do dia, contas a receber e estoque por referencia." title="Relatorios" />,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/configuracoes',
    component: () => <PlaceholderPage description="Cadastros configuraveis e usuarios do sistema." title="Configuracoes" />,
  }),
];

const routeTree = rootRoute.addChildren([indexRoute, ...placeholderRoutes]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
