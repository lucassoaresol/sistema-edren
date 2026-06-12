# Stack

## Runtime E Gerenciador

- Node.js `>=22.0.0`.
- npm `>=10.0.0`.
- npm workspaces em `apps/*` e `packages/*`.
- Projeto ESM (`type: module`).

## Frontend

- Vite.
- React.
- TypeScript.
- Tailwind CSS via `@tailwindcss/vite`.
- TanStack Router.
- TanStack Query.
- React Hook Form + Zod.
- Sonner instalado.
- Lucide React para icones.
- Componentes UI proprios inspirados em shadcn/CVA.

## Backend

- Fastify.
- TypeScript executado em dev com `tsx`.
- Prisma Client.
- Argon2 para hash de senha.
- `@fastify/cookie` para sessao via cookie assinado.
- Zod para validação.
- Vitest para testes.

## Banco

- PostgreSQL.
- Prisma ORM.
- Migracao inicial em `packages/database/prisma/migrations/20260610120000_init/migration.sql`.

## Deploy Planejado

- Frontend buildado e servido como estatico via Nginx.
- API Fastify via PM2, escutando localmente.
- Proxy `/api` no Nginx.
- Cloudflared Tunnel apontando para Nginx local.
