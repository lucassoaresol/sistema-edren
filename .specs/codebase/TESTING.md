# Testes

## Ferramentas

- API usa Vitest.
- Typecheck por workspace via `npm run typecheck --workspaces --if-present`.
- Build raiz executa build de `packages/shared`, `packages/config`, `apps/api` e `apps/web`.

## Testes Existentes

- `apps/api/src/routes/health.test.ts`.
- `apps/api/src/modules/auth/routes.test.ts`.
- `apps/api/src/test/create-test-app.ts` cria app para testes.

## Gaps

- Nao foram observados testes do frontend.
- Nao ha testes de dominio para estoque, vendas, pagamentos ou permissoes porque as rotas ainda nao existem.
- Quando venda/estoque forem implementados, testes devem cobrir transacoes, rollback, baixa de estoque, cancelamento e pagamentos parciais.

## Comandos Relevantes

- `npm run test`
- `npm run typecheck`
- `npm run build`
- `npm run check`
