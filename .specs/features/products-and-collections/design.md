# Design de Produtos, Colecoes e SKUs

## Objetivo Tecnico

Implementar a primeira fatia de catalogo operacional da EDREN usando o schema Prisma existente e os padroes atuais de API modular, autenticacao por sessao, respostas `{ data: ... }`, validacao com Zod, TanStack Query no frontend e UI clara responsiva.

## Decisoes

- A feature usa os modelos Prisma existentes: `Collection`, `Product`, `ProductImage` e `ProductVariant`.
- Nao criar migration inicialmente, salvo se a implementacao mostrar uma lacuna real entre spec e schema.
- Colecoes expostas no MVP usam apenas `ACTIVE` e `ARCHIVED`.
- O enum `CollectionStatus.FUTURE` pode continuar no schema, mas nao aparece na UI nem deve ser aceito pela API desta feature.
- Criacao e edicao de catalogo ficam restritas a `ADMIN`, reaproveitando o padrao de `requireAdmin` usado em configuracoes.
- Usuarios autenticados sem `ADMIN` podem listar/consultar catalogo, mas nao veem `cost`.
- A primeira entrega de imagem deve usar upload real para Cloudinary. A UI envia arquivo, a API faz upload autenticado com credenciais do servidor e grava `url` e `publicId` retornados no `ProductImage` principal.
- O fluxo manual por `url`/`publicId` foi aceito apenas como etapa intermediaria durante a implementacao inicial e deve ser substituido pelo upload de arquivo.
- Produtos e SKUs nao terao exclusao fisica nesta feature; somente ativacao/inativacao ou arquivamento de colecoes.

## Backend

### Modulos

Adicionar modulo em `apps/api/src/modules/catalog` com:

- `routes.ts`: rotas Fastify de colecoes, produtos, variantes e imagem principal.
- `schemas.ts`: schemas Zod de params e payloads.
- `routes.test.ts`: cobertura de autenticacao, permissao e regras de negocio.

Adicionar utilitario simples de integracao em `apps/api/src/lib/cloudinary.ts` ou modulo equivalente quando T8 for implementada:

- configurar SDK do Cloudinary com `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` e `CLOUDINARY_API_SECRET` vindos de `env`;
- expor funcao de upload para imagem de produto principal;
- usar pasta/prefixo especifico, por exemplo `edren/products`, para separar assets do catalogo.

Registrar o modulo em `apps/api/src/app.ts` com prefixos:

- `/api/collections`
- `/api/products`

Pode ser um unico plugin registrado duas vezes ou um plugin que registre ambos os namespaces. Preferir a solucao mais simples e consistente com `configRoutes`.

### Contratos

`GET /api/collections`

- Autenticado.
- Retorna colecoes ordenadas por nome.
- Retorna `{ data: Collection[] }`.

`POST /api/collections`

- Apenas `ADMIN`.
- Payload: `name`, `description?`, `status?` limitado a `ACTIVE | ARCHIVED`.
- Bloqueia nome duplicado.

`PATCH /api/collections/:id`

- Apenas `ADMIN`.
- Permite alterar `name`, `description`, `status` limitado a `ACTIVE | ARCHIVED`.
- Bloqueia nome duplicado.

`GET /api/products`

- Autenticado.
- Deve aceitar filtros simples opcionais: `isActive`, `collectionId`, `categoryId`, `search`.
- Retorna lista com produto, colecao, categoria, grade de tamanho, imagem principal e contagem/lista resumida de SKUs.
- Para nao-admin, omitir `cost` no payload.

`POST /api/products`

- Apenas `ADMIN`.
- Payload: `reference`, `name`, `description?`, `salePrice`, `cost?`, `isActive?`, `collectionId`, `categoryId`, `sizeGridId`, `mainImage?`.
- Valida referencia unica.
- Valida existencia de colecao, categoria e grade.
- Cria produto e, se informada, imagem principal em transacao.

`GET /api/products/:id`

- Autenticado.
- Retorna produto com relacoes, imagem principal e SKUs.
- Para nao-admin, omitir `cost`.

`PATCH /api/products/:id`

- Apenas `ADMIN`.
- Permite alterar campos do produto e imagem principal por endpoint separado.
- Se `reference` mudar, valida unicidade.
- Se `sizeGridId` mudar, deve impedir a troca quando existirem SKUs com tamanhos fora da nova grade; a alternativa mais simples para o MVP e bloquear troca de grade quando o produto ja tiver SKUs.

`GET /api/products/:id/variants`

- Autenticado.
- Retorna SKUs do produto com cor e tamanho ordenados por cor e ordem do tamanho.

`POST /api/products/:id/variants`

- Apenas `ADMIN`.
- Payload: `colorId`, `sizeId`, `isActive?`.
- Valida existencia do produto, cor e tamanho.
- Valida que o tamanho pertence a grade do produto.
- Bloqueia combinacao duplicada.

`PATCH /api/product-variants/:id`

- Apenas `ADMIN`.
- Permite alterar `colorId`, `sizeId`, `isActive`.
- Valida que novo tamanho pertence a grade do produto.
- Bloqueia combinacao duplicada.

`POST /api/products/:id/images/main`

- Apenas `ADMIN`.
- Payload: multipart/form-data com campo `image`.
- Faz upload do arquivo para Cloudinary pelo backend.
- Grava `url` e `publicId` retornados pelo Cloudinary.
- Substitui a imagem principal atual por uma nova imagem principal no banco e remove o asset anterior do Cloudinary após a troca.
- Deve garantir no maximo uma imagem principal por produto na logica da aplicacao.
- Deve rejeitar arquivo ausente, tipo nao suportado, tamanho acima do limite e Cloudinary sem configuracao com mensagens claras.

`DELETE /api/products/:id/images/main`

- Apenas `ADMIN`.
- Remove o registro da imagem principal atual.
- Remove o asset correspondente no Cloudinary antes de remover o registro do banco.

### Configuracao Cloudinary

- A API deve validar `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` e `CLOUDINARY_API_SECRET` quando o upload for acionado.
- As variaveis podem permanecer opcionais para permitir rodar partes do sistema sem upload em desenvolvimento/teste, mas a rota de upload deve retornar erro claro se estiverem ausentes.
- Incluir dependencia `cloudinary` em `apps/api` e `@fastify/multipart` ou alternativa equivalente para receber arquivo multipart.

### Serializacao de Dinheiro

Prisma `Decimal` deve ser retornado de forma segura para frontend. Preferir converter `salePrice` e `cost` para string decimal no payload, evitando perda de precisao.

### Permissoes

Criar helper local `requireAdmin` ou extrair o helper existente de `config/routes.ts` somente se isso reduzir duplicacao sem aumentar escopo. Se extrair, manter compatibilidade com o modulo de configuracoes.

### Erros

Usar classes existentes em `apps/api/src/lib/errors.ts`:

- `UnauthorizedError` via `requireAuth`.
- `ForbiddenError` para escrita por nao-admin.
- `NotFoundError` para relacoes inexistentes.
- `ConflictError` para duplicidade.

Mensagens devem ser claras em portugues, seguindo o padrao atual sem depender de acentos.

## Frontend

### Cliente API

Estender `apps/web/src/lib/api.ts` com tipos e funcoes:

- `Collection`, `Product`, `ProductVariant`, `ProductPayload`, `VariantPayload` e upload de imagem principal por `File`/`FormData`.
- `getCollections`, `createCollection`, `updateCollection`.
- `getProducts`, `getProduct`, `createProduct`, `updateProduct`.
- `getProductVariants`, `createProductVariant`, `updateProductVariant`.
- `uploadMainProductImage`, `removeMainProductImage`.

### Rotas

Substituir placeholder de `/products` por `ProductsPage`.

Manter `/collections` como placeholder ou redirecionar visualmente para o gerenciamento dentro de produtos, para evitar duplicar UI agora. Se for simples, incluir uma aba de colecoes em `/products`.

### UI

`ProductsPage` deve oferecer:

- cabecalho com contexto da feature e aviso de que catalogo alimenta estoque/vendas;
- filtros simples por busca, colecao e status;
- lista responsiva de produtos com referencia, nome, colecao, categoria, preco, status e indicacao de imagem;
- formulario de criacao/edicao de produto para admin;
- ocultacao do custo para perfis nao-admin;
- area de SKUs no produto selecionado, com cor, tamanho e status;
- formulario de SKU usando cores e tamanhos ativos da grade do produto;
- area simples de imagem principal por upload de arquivo, com preview/estado sem imagem e feedback de erro.

Reaproveitar componentes existentes (`Card`, `Button`, `Input`, `Label`, `Badge`) e manter o estilo EDREN claro.

### Estado Remoto

Usar TanStack Query com chaves separadas:

- `['collections']`
- `['products']`
- `['products', productId]`
- `['products', productId, 'variants']`
- `['config']` para listas de categorias, cores e grades ja existentes.

Invalidar queries apos criacao/edicao.

## Testes

Criar testes de API para:

- exigir autenticacao em listagens;
- permitir leitura para usuario autenticado nao-admin;
- bloquear escrita para nao-admin;
- criar/editar colecao e bloquear duplicidade;
- criar produto com referencia unica e relacoes validas;
- bloquear referencia duplicada;
- criar produto sem imagem;
- fazer upload de imagem principal para produto existente;
- substituir imagem principal removendo o asset anterior do Cloudinary;
- remover imagem principal apagando o asset do Cloudinary;
- bloquear upload de imagem para nao-admin;
- rejeitar upload sem arquivo, tipo invalido, tamanho excedido e Cloudinary sem configuracao;
- ocultar `cost` para nao-admin;
- criar SKU valido;
- bloquear SKU duplicado;
- bloquear SKU com tamanho de outra grade;
- inativar produto e SKU.

Frontend nao possui harness de teste no projeto; validacao sera por `typecheck`, `build` e checagem manual.

## Riscos

- Cloudinary ainda nao esta implementado; T8 deve fechar essa lacuna antes da validacao fullstack final da feature.
- Mudar grade de produto depois de criar SKUs pode quebrar consistencia; bloquear no MVP e mais seguro.
- O schema tem `FUTURE` para colecao, mas o MVP nao precisa; API deve limitar o contrato a `ACTIVE | ARCHIVED`.
- Produtos e SKUs serao base transacional de estoque/venda; evitar exclusao fisica desde agora reduz retrabalho.
