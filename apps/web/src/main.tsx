import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

function App() {
  return (
    <main className="min-h-screen bg-stone-950 text-stone-50">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-12">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.35em] text-amber-300">
          Sistema Interno
        </p>
        <h1 className="max-w-3xl text-5xl font-semibold tracking-tight sm:text-7xl">
          EDREN
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-300">
          Base inicial do sistema de gestao para produtos, estoque, vendas,
          pagamentos e contas a receber.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-stone-800 bg-stone-900/70 p-5">
            <h2 className="font-semibold text-amber-200">Produtos</h2>
            <p className="mt-2 text-sm text-stone-400">Colecoes, SKUs e imagens.</p>
          </div>
          <div className="rounded-2xl border border-stone-800 bg-stone-900/70 p-5">
            <h2 className="font-semibold text-amber-200">Estoque</h2>
            <p className="mt-2 text-sm text-stone-400">Saldos por SKU e local.</p>
          </div>
          <div className="rounded-2xl border border-stone-800 bg-stone-900/70 p-5">
            <h2 className="font-semibold text-amber-200">Vendas</h2>
            <p className="mt-2 text-sm text-stone-400">Pagamentos e recebiveis.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
