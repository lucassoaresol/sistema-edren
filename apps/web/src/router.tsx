import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';
import { AppShell } from '@/components/app-shell';
import { DashboardPage } from '@/routes/dashboard';
import { SettingsPage } from '@/routes/settings';
import { ProductDetailPage, ProductsPage } from '@/routes/products';
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

const productsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/products',
  component: ProductsPage,
});

const productDetailRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/products/$productId',
  component: ProductDetailRoute,
});

const placeholderRoutes = [
  createRoute({
    getParentRoute: () => protectedRoute,
    path: '/sales',
    component: () => <PlaceholderPage description="Venda rápida, pagamentos e baixa de estoque." title="Vendas" />,
  }),
  createRoute({
    getParentRoute: () => protectedRoute,
    path: '/customers',
    component: () => <PlaceholderPage description="Cadastro e histórico das clientes." title="Clientes" />,
  }),
  productsRoute,
  productDetailRoute,
  createRoute({
    getParentRoute: () => protectedRoute,
    path: '/collections',
    component: () => <PlaceholderPage description="Organização dos produtos por coleção." title="Coleções" />,
  }),
  createRoute({
    getParentRoute: () => protectedRoute,
    path: '/stock',
    component: () => <PlaceholderPage description="Saldos por SKU e local, entradas e movimentações." title="Estoque" />,
  }),
  createRoute({
    getParentRoute: () => protectedRoute,
    path: '/accounts-receivable',
    component: () => <PlaceholderPage description="Saldos em aberto e histórico financeiro." title="Contas a receber" />,
  }),
  createRoute({
    getParentRoute: () => protectedRoute,
    path: '/reports',
    component: () => <PlaceholderPage description="Vendas do dia, contas a receber e estoque por referência." title="Relatórios" />,
  }),
  createRoute({
    getParentRoute: () => protectedRoute,
    path: '/settings',
    component: SettingsPage,
  }),
];

function ProductDetailRoute() {
  const { productId } = productDetailRoute.useParams();
  return <ProductDetailPage productId={productId} />;
}

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
