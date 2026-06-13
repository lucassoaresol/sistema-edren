# Tasks de Produtos, Coleções e SKUs

## Status

Backend de catálogo implementado até T4; cliente API do frontend implementado em T5; tela `/products` implementada em T6; datas/vigência de coleções implementadas em T7; upload Cloudinary implementado em T8; validação fullstack concluída em T9.

## Tarefas

### T1 - Preparar módulo de catálogo na API

**Status:** Concluida
**Requisitos:** REQ-PROD-001 a REQ-PROD-035
**Onde:** `apps/api/src/modules/catalog`, `apps/api/src/app.ts`
**Depende de:** Nenhuma
**Reusa:** `requireAuth`, erros centralizados, plugin Prisma, padrão de `configRoutes`
**Feito quando:** O módulo existe, está registrado no app e possui schemas base de params/payloads.
**Testes:** `npm run typecheck`
**Gate:** Typecheck passa.

### T2 - Implementar rotas de coleções

**Status:** Concluida
**Requisitos:** REQ-PROD-001 a REQ-PROD-006, REQ-PROD-030, REQ-PROD-031, REQ-PROD-033
**Onde:** `apps/api/src/modules/catalog/routes.ts`, `apps/api/src/modules/catalog/schemas.ts`, `apps/api/src/modules/catalog/routes.test.ts`
**Depende de:** T1
**Reusa:** Prisma `collection`, `requireAuth`, `requireAdmin`
**Feito quando:** API lista, cria e edita coleções com status `ACTIVE | ARCHIVED`, bloqueia duplicidade e bloqueia escrita para não-admin.
**Testes:** Testes de API para auth, permissão, criação, edição e duplicidade.
**Gate:** `npm run test --workspace apps/api`

### T3 - Implementar rotas de produtos

**Status:** Concluida
**Requisitos:** REQ-PROD-007 a REQ-PROD-023, REQ-PROD-030 a REQ-PROD-033
**Onde:** `apps/api/src/modules/catalog/routes.ts`, `apps/api/src/modules/catalog/schemas.ts`, `apps/api/src/modules/catalog/routes.test.ts`
**Depende de:** T2
**Reusa:** Prisma `product`, `productImage`, `collection`, `category`, `sizeGrid`
**Feito quando:** API lista, detalha, cria e edita produtos; valida referência única e relações; permite produto sem imagem; retorna dinheiro como string; omite `cost` para não-admin.
**Testes:** Testes de API para produto válido, referência duplicada, relações inválidas, produto sem imagem, produto com imagem e ocultação de custo.
**Gate:** `npm run test --workspace apps/api`

### T4 - Implementar rotas de SKUs e imagem principal

**Status:** Concluida
**Requisitos:** REQ-PROD-019 a REQ-PROD-029, REQ-PROD-031, REQ-PROD-033
**Onde:** `apps/api/src/modules/catalog/routes.ts`, `apps/api/src/modules/catalog/schemas.ts`, `apps/api/src/modules/catalog/routes.test.ts`
**Depende de:** T3
**Reusa:** Prisma `productVariant`, `productImage`, `color`, `size`, `product`
**Feito quando:** API lista, cria e edita SKUs; valida tamanho da grade do produto; bloqueia combinação duplicada; gerencia imagem principal por URL/publicId.
**Testes:** Testes de API para SKU válido, SKU duplicado, tamanho de outra grade, inativação de SKU, criar/remover imagem principal.
**Gate:** `npm run test --workspace apps/api`

### T5 - Estender cliente API do frontend

**Status:** Concluida
**Requisitos:** REQ-PROD-001 a REQ-PROD-035
**Onde:** `apps/web/src/lib/api.ts`
**Depende de:** T2, T3, T4
**Reusa:** helper `request`, tipos de config existentes
**Feito quando:** Tipos e funções de coleções, produtos, SKUs e imagem principal estão disponíveis para a UI.
**Testes:** `npm run typecheck --workspace apps/web`
**Gate:** Typecheck do web passa.

### T6 - Implementar tela `/products`

**Status:** Concluida
**Requisitos:** REQ-PROD-001 a REQ-PROD-035
**Onde:** `apps/web/src/routes/products.tsx`, `apps/web/src/router.tsx`
**Depende de:** T5
**Reusa:** `Card`, `Button`, `Input`, `Label`, `Badge`, TanStack Query, `getConfigData`, `getCurrentUser`
**Feito quando:** Placeholder de produtos é substituído por tela responsiva com formulário de novo produto/edição antes da listagem, filtros simples, custo oculto para não-admin; detalhe completo, imagem principal opcional e gerenciamento de SKUs ficam em página dedicada.
**Testes:** `npm run typecheck --workspace apps/web`, `npm run build --workspace apps/web`
**Gate:** Typecheck e build do web passam.

### T7 - Implementar datas e vigência de coleções

**Status:** Concluida
**Requisitos:** REQ-PROD-004 a REQ-PROD-009, REQ-PROD-033, REQ-PROD-035
**Onde:** `packages/database/prisma/schema.prisma`, `packages/database/prisma/migrations`, `apps/api/src/modules/catalog`, `apps/web/src/routes/products.tsx`, `apps/web/src/lib/api.ts`
**Depende de:** T2, T3, T5, T6
**Reusa:** Prisma `collection`, schemas Zod, formulário de coleções, formulário de produto
**Feito quando:** Coleção tem data de início obrigatória e data de fim opcional; API valida período na criação e edição; UI permite editar nome, descrição, data de início e data de fim; produto novo só pode ser vinculado a coleção vigente; UI mostra apenas coleções vigentes no cadastro de produto; textos da tela de produtos estão em português com acentuação correta.
**Testes:** `npm run db:generate -w packages/database`, `npm run db:migrate -w packages/database`, `npm run typecheck -w apps/api`, `npm run typecheck -w apps/web`, `npm run test -w apps/api -- catalog`
**Gate:** Typechecks passam e testes de catálogo passam.

### T8 - Implementar upload Cloudinary de imagem principal

**Status:** Concluida
**Requisitos:** REQ-PROD-019 a REQ-PROD-021C, REQ-PROD-031, REQ-PROD-033, REQ-PROD-035
**Onde:** `apps/api/src/lib/env.ts`, `apps/api/src/lib/cloudinary.ts`, `apps/api/src/modules/catalog`, `apps/web/src/lib/api.ts`, `apps/web/src/routes/products.tsx`, `apps/api/package.json`
**Depende de:** T4, T5, T6
**Reusa:** `ProductImage`, rota atual de imagem principal, cookies de sessão, TanStack Query
**Feito quando:** A UI permite selecionar arquivo para imagem principal; a API recebe multipart, envia para Cloudinary, grava `url/publicId`, substitui a imagem principal atual no banco, remove o asset anterior do Cloudinary e retorna erro claro para arquivo inválido ou Cloudinary não configurado.
**Testes:** `npm run typecheck -w apps/api`, `npm run typecheck -w apps/web`, `npm run test -w apps/api -- catalog`
**Gate:** Typechecks passaram; testes de catálogo cobrem upload autorizado, substituição/remocao do asset anterior, bloqueio para não-admin, arquivo inválido e Cloudinary sem configuração.

### T9 - Validar integração fullstack

**Status:** Concluida
**Requisitos:** Todos
**Onde:** Projeto inteiro
**Depende de:** T1 a T8
**Reusa:** Scripts raiz de validação
**Feito quando:** API, frontend e fluxos manuais principais estão validados.
**Testes:** `npm run typecheck`, `npm run test`, `npm run build`
**Gate:** `npm run typecheck`, `npm run test` e `npm run build` passaram em 2026-06-13. Checagem manual de `/products` e `/products/:productId` registrada em 2026-06-13, incluindo produto com upload de imagem e produto sem imagem.

## Plano de Execução

1. Executar T1 a T4 primeiro para fechar contrato e regras de negócio no backend.
2. Executar T5 para conectar o frontend aos contratos reais.
3. Executar T6 com UI simples, evitando galeria/múltiplos uploads.
4. Executar T7 para fechar regra de datas/vigência descoberta no UAT.
5. Executar T8 para substituir URL/publicId manual por upload Cloudinary.
6. Executar T9 antes de marcar a feature como implementada.

## Observações

- Decisão 2026-06-13: upload real para Cloudinary é obrigatório agora para imagem principal de produto; URL/publicId manual foi apenas etapa intermediária e deve sair do fluxo principal.
- Se o schema precisar remover `FUTURE` de `CollectionStatus`, tratar como migration separada; não é necessário para o contrato do MVP.
- Não implementar estoque inicial nesta feature, mesmo que a UI de produto já liste SKUs.
