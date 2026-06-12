import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';
import { AppShell } from '@/components/app-shell';
import { DashboardPage } from '@/routes/dashboard';
import { LoginPage } from '@/routes/login';
import { PlaceholderPage } from '@/routes/placeholder';

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'protected',
  component: AppShell,
});

const indexRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/',
  component: DashboardPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const placeholderRoutes = [
  createRoute({
    getParentRoute: () => protectedRoute,
    path: '/vendas',
    component: () => <PlaceholderPage description="Venda rapida, pagamentos e baixa de estoque." title="Vendas" />,
  }),
  createRoute({
    getParentRoute: () => protectedRoute,
    path: '/clientes',
    component: () => <PlaceholderPage description="Cadastro e historico das clientes." title="Clientes" />,
  }),
  createRoute({
    getParentRoute: () => protectedRoute,
    path: '/produtos',
    component: () => <PlaceholderPage description="Referencias, colecoes, SKUs e imagens." title="Produtos" />,
  }),
  createRoute({
    getParentRoute: () => protectedRoute,
    path: '/colecoes',
    component: () => <PlaceholderPage description="Organizacao dos produtos por colecao." title="Colecoes" />,
  }),
  createRoute({
    getParentRoute: () => protectedRoute,
    path: '/estoque',
    component: () => <PlaceholderPage description="Saldos por SKU e local, entradas e movimentacoes." title="Estoque" />,
  }),
  createRoute({
    getParentRoute: () => protectedRoute,
    path: '/contas-a-receber',
    component: () => <PlaceholderPage description="Saldos em aberto e historico financeiro." title="Contas a receber" />,
  }),
  createRoute({
    getParentRoute: () => protectedRoute,
    path: '/relatorios',
    component: () => <PlaceholderPage description="Vendas do dia, contas a receber e estoque por referencia." title="Relatorios" />,
  }),
  createRoute({
    getParentRoute: () => protectedRoute,
    path: '/configuracoes',
    component: () => <PlaceholderPage description="Cadastros configuraveis e usuarios do sistema." title="Configuracoes" />,
  }),
];

const routeTree = rootRoute.addChildren([
  loginRoute,
  protectedRoute.addChildren([indexRoute, ...placeholderRoutes]),
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
