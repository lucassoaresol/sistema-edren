# Estrutura

```text
apps/
  api/                 # Fastify API
  web/                 # Vite React frontend
packages/
  database/            # Prisma schema, migrations, seed e scripts
  shared/              # pacote compartilhado ainda minimo
  config/              # pacote de config ainda minimo
  context/             # decisoes e especificacoes de negocio
  deploy/              # documentacao de producao
.specs/                # mapeamento spec-driven criado nesta analise
```

## Apps

- `apps/api/src/app.ts`: cria Fastify, registra plugins e rotas.
- `apps/api/src/server.ts`: entrada do servidor.
- `apps/api/src/modules/auth`: autenticacao, sessao, schemas e contexto.
- `apps/api/src/routes/health.ts`: health checks basicos e health do banco.
- `apps/web/src/router.tsx`: rotas TanStack.
- `apps/web/src/components/app-shell.tsx`: layout autenticado com menu.
- `apps/web/src/routes/login.tsx`: login.
- `apps/web/src/routes/dashboard.tsx`: painel inicial/prova fullstack.
- `apps/web/src/routes/placeholder.tsx`: paginas placeholder.

## Pacotes

- `packages/database/prisma/schema.prisma`: modelo principal do dominio.
- `packages/database/prisma/seed.ts`: seeds iniciais.
- `packages/database/scripts/create-admin.ts`: criacao de administrador.
- `packages/shared/src/index.ts`: ainda sem dominio relevante observado.
- `packages/config/src/index.ts`: ainda sem dominio relevante observado.
