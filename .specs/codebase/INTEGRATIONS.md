# Integracoes

## PostgreSQL

- Configurado por `DATABASE_URL`.
- Usado via Prisma.

## Cloudinary

- Previsto em `.env.example` por `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` e `CLOUDINARY_API_SECRET`.
- Previsto em documentos para imagens de produto.
- Não há integração de upload implementada no código analisado.

## Nginx / Cloudflared / PM2

- Documentados em `docs/deploy/PRODUCAO.md`.
- Nginx serve frontend e faz proxy `/api` para Fastify local.
- PM2 executa `apps/api/dist/server.js`.
- Cloudflared expoe o dominio publico apontando para Nginx local.

## Browser/API

- Frontend chama endpoints relativos `/api/...`.
- Autenticacao depende de cookie HTTP-only assinado.
