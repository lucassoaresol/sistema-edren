# Integracoes

## PostgreSQL

- Configurado por `DATABASE_URL`.
- Usado via Prisma.

## Cloudinary

- Previsto em `.env.example` por `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` e `CLOUDINARY_API_SECRET`.
- Previsto em documentos para imagens de produto.
- Upload de imagem principal de produto implementado em `apps/api/src/lib/cloudinary.ts` e `POST /api/products/:productId/images/main`.
- O upload usa credenciais do servidor, aceita arquivo multipart enviado pela UI e grava `url` e `publicId` em `ProductImage`.
- Ao substituir ou remover a imagem principal, a API remove o asset anterior no Cloudinary para evitar imagens órfãs.
- Quando Cloudinary não está configurado, a rota retorna erro claro e não grava imagem.

## Nginx / Cloudflared / PM2

- Documentados em `docs/deploy/PRODUCAO.md`.
- Nginx serve frontend e faz proxy `/api` para Fastify local.
- PM2 executa `apps/api/dist/server.js`.
- Cloudflared expoe o dominio publico apontando para Nginx local.

## Browser/API

- Frontend chama endpoints relativos `/api/...`.
- Autenticacao depende de cookie HTTP-only assinado.
