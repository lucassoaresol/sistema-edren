- [x] TASK-FE-API-001: Separar `apps/web/src/lib/api.ts` em request base e APIs por domínio (`auth`, `health`, `config`, `catalog`), preservando exports públicos temporários quando útil para reduzir impacto.
  - Requisitos: REQ-FE-API-001, REQ-FE-API-002, REQ-FE-API-006, REQ-FE-API-007.
  - Verificação: `npm run typecheck` passou em 2026-06-13; imports existentes continuam compilando.

- [x] TASK-FE-API-002: Mover query keys de catálogo/configuração para arquivos claros por domínio e atualizar páginas/componentes consumidores.
  - Requisitos: REQ-FE-API-003, REQ-FE-API-007.
  - Verificação: `npm run typecheck` passou em 2026-06-13; `/products` e `/configuracoes` seguem usando as mesmas chaves lógicas.

- [x] TASK-FE-API-003: Melhorar tratamento de erro do request base para expor mensagem estruturada da API quando existir.
  - Requisitos: REQ-FE-API-002, REQ-FE-API-005.
  - Verificação: `npm run typecheck` passou em 2026-06-13; testes existentes da API continuam passando com `npm test`.

- [x] TASK-FE-API-004: Extrair padrões reutilizados da tela de configurações para componentes de domínio sem alterar visual ou comportamento.
  - Requisitos: REQ-FE-API-004, REQ-FE-API-006, REQ-FE-API-007.
  - Verificação: `npm run typecheck` passou em 2026-06-13; checagem manual da tela de configurações.

- [ ] TASK-FE-API-005: Rodar validação final da spec e registrar resultado.
  - Requisitos: todos.
  - Verificação: `npm run typecheck`, `npm test`, `npm run build`.
