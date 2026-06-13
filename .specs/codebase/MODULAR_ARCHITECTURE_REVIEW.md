# Revisão Arquitetural Modular

**Data:** 2026-06-13.
**Motivação:** nova visão de módulos como contextos operacionais, com referência transversal entre Confecção/Criação, Loja/Catálogo, Estoque, Vendas e Relatórios.

## Resumo Executivo

A arquitetura atual está adequada para o estágio de fundação e catálogo, mas ainda não está pronta para crescer com a nova visão modular sem ajustes. O sistema já tem monorepo, API Fastify, Prisma, autenticação por sessão, perfis, catálogo e cadastros configuráveis. O ponto de atenção é que as fronteiras de contexto ainda existem mais nas specs do que no código.

Antes de implementar Confecção/Criação, Estoque e Vendas, a arquitetura precisa evoluir em três frentes:

- fronteiras de domínio mais claras no backend;
- autorização por contexto e ação, não apenas `requireAdmin` local;
- organização do frontend por módulo/contexto, não uma navegação plana com placeholders e um cliente de API centralizado.

## Estado Atual Observado

### Backend

- `apps/api/src/app.ts` registra módulos de `auth`, `catalog` e `config`.
- `catalog/routes.ts` concentra rotas, regras, serialização, validação de relações, autorização e integração Cloudinary.
- `config/routes.ts` também concentra rotas e regras simples de cadastros.
- `requireAuth` é centralizado em `auth-context.ts`.
- `requireAdmin` existe duplicado dentro de módulos, não como política reutilizável.
- Não há camada explícita de serviços/repositórios para domínio.
- Não há módulo de Confecção/Criação, Estoque, Clientes, Vendas, Recebíveis ou Relatórios implementado.

### Frontend

- `AppShell` exibe navegação plana para módulos do MVP.
- Rotas reais existem para dashboard, login, configurações, produtos e detalhe de produto.
- Vendas, clientes, coleções, estoque, contas a receber e relatórios ainda são placeholders.
- `products.tsx` concentra muitas responsabilidades da UI de catálogo.
- `settings.tsx` concentra múltiplos cadastros configuráveis.
- `lib/api.ts` concentra tipos e chamadas de API de vários domínios.
- Não há filtro de navegação por perfil/contexto.

### Banco

- O schema Prisma já cobre usuários, perfis, sessões, configuração, catálogo, estoque, clientes, vendas e pagamentos.
- A referência comercial está em `Product.reference`.
- Não existe modelo para referência em criação/confecção, croqui, itens de custo ou promoção para produto.
- `ProductImage` cobre a imagem principal comercial. A lacuna atual é separar croqui/imagem de criação da imagem de produto comercial.
- Estoque e vendas já estão modelados, mas não têm serviços transacionais implementados.

## Nova Visão Arquitetural

Módulo deve ser tratado como contexto operacional. Isso implica:

- dados próprios;
- vocabulário próprio;
- permissões próprias;
- rotas/API próprias;
- componentes e páginas próprias;
- regras de transição entre contextos.

A referência passa a ser conceito transversal:

- em Confecção/Criação, representa nascimento, croqui, custo e preparação de fabricação;
- em Loja/Catálogo, representa produto vendável;
- em Estoque, aparece via SKUs e saldos;
- em Vendas, aparece como busca/identificação comercial;
- em Relatórios, consolida leitura operacional.

## Lacunas Arquiteturais

### 1. Falta Um Modelo De Contexto De Negócio

Hoje a aplicação tem módulos técnicos, mas ainda não tem uma definição codificada de contexto operacional. Isso afeta navegação, autorização, nomes de rota, organização de API e futuras decisões de UI.

Melhoria necessária:

- definir contextos oficiais do MVP: `creation`/`production`, `catalog`, `stock`, `sales`, `customers`, `finance`, `reports`, `settings`;
- mapear cada contexto para perfis e ações permitidas;
- usar essa matriz como base para backend e frontend.

### 2. Autorização Ainda É Simples Demais Para Contextos

`requireAuth` está centralizado, mas `requireAdmin` está duplicado e limitado a uma decisão binária. A nova visão precisa de permissões por ação: consultar catálogo, editar produto, ver custo, criar referência de confecção, aprovar referência, vender, cancelar venda, ajustar estoque, ver recebíveis.

Melhoria necessária:

- criar helpers reutilizáveis de autorização, por exemplo `requireProfile`, `requireAnyProfile` ou `requirePermission`;
- manter permissões por perfil no MVP;
- não criar permissões customizadas por usuário agora;
- garantir que a API valide permissões mesmo quando a UI esconder botões.

### 3. Catálogo Precisa Virar Serviço Reutilizável

A promoção de uma referência de Confecção para Produto Comercial vai precisar reutilizar regras já existentes: referência única, coleção vigente, relações obrigatórias, custo opcional e serialização com ocultação de custo.

Se isso continuar dentro de `catalog/routes.ts`, o módulo de Confecção tende a duplicar regra ou chamar rota interna de forma inadequada.

Melhoria necessária:

- executar a spec `catalog-api-service-layer` antes da promoção para produto;
- extrair regras de coleção, produto, SKU, imagem e serialização;
- expor funções de domínio que possam ser usadas por catálogo e criação.

### 4. Frontend Ainda Não Está Organizado Por Contexto

O menu atual é uma lista plana e mostra placeholders. Com contextos e perfis, a navegação precisa filtrar o que cada usuário vê e distinguir Confecção de Produtos.

Melhoria necessária:

- introduzir configuração de navegação com `context`, `requiredProfiles` e status de implementação;
- adicionar item de menu para Confecção/Criação apenas quando a feature existir ou quando for intencional mostrar como planejada;
- separar API client, query keys e tipos por domínio;
- decompor `products.tsx` antes de criar vínculos com criação.

### 5. Banco Ainda Não Representa A Referência Em Criação

`Product.reference` representa o produto comercial. O caderno mostra que existe uma etapa anterior. Forçar tudo em `Product` tornaria campos comerciais obrigatórios cedo demais ou criaria muitos dados nulos em produto vendável.

Melhoria necessária:

- criar modelo próprio para referência em criação, por exemplo `ProductReference` ou `CreationReference`;
- relacionar opcionalmente com `Product` quando promovida;
- modelar imagens de criação de forma separada da imagem comercial, pelo menos para croqui;
- modelar itens de custo da referência;
- decidir se o número da referência nasce obrigatório ou pode começar como rascunho sem número oficial.

### 6. Imagens Precisam Separar Criação De Produto

Hoje `ProductImage` atende imagem comercial principal. Para o próximo passo, a separação necessária é mais simples: croqui/imagem de criação de um lado e imagem de produto comercial do outro.

Melhoria necessária:

- evitar sobrecarregar `ProductImage` com croqui se isso confundir produto vendável;
- manter `ProductImage` como imagem comercial do produto, se isso continuar suficiente para catálogo;
- criar armazenamento/vínculo próprio para croqui ou imagem de criação no módulo Confecção/Criação;
- deixar foto na modelo, foto de detalhe e galeria avançada como evolução futura;
- preservar upload Cloudinary e limpeza de assets órfãos.

### 7. Estoque E Vendas Precisam De Serviços Transacionais

O schema já modela estoque e venda, mas sem serviços. A nova visão reforça que estoque e vendas dependem do produto comercial/SKUs, não da ficha de Confecção.

Melhoria necessária:

- implementar serviços transacionais para entrada/movimentação de estoque;
- implementar serviço transacional de venda com baixa de estoque e pagamentos;
- manter dependência de estoque/vendas em `ProductVariant`, não em referência de criação;
- expor referência nos filtros e relatórios por join via produto.

### 8. Relatórios Precisam Respeitar Contexto E Perfil

Relatórios por referência podem cruzar venda, estoque e custo. Isso cria risco de expor custo a perfis que não devem ver.

Melhoria necessária:

- separar relatórios operacionais de relatórios administrativos;
- ocultar custo, margem e dados de confecção de `SELLER_OPERATOR`;
- definir se `MANAGER` vê custo antes de implementar relatórios.

## Arquitetura Alvo Recomendada

### Backend

Estrutura alvo incremental:

```text
apps/api/src/modules/
  auth/
  authorization/
    policies.ts
  config/
  catalog/
    routes.ts
    services.ts
    serializers.ts
    repositories.ts
  creation/
    routes.ts
    services.ts
    serializers.ts
  stock/
    routes.ts
    services.ts
  sales/
    routes.ts
    services.ts
  reports/
```

Diretrizes:

- rotas validam HTTP, auth e payload;
- serviços aplicam regra de negócio e transações;
- serializadores aplicam visibilidade por perfil;
- repositórios só entram quando houver reuso real ou transações complexas;
- autorização deve ser compartilhada.

### Frontend

Estrutura alvo incremental:

```text
apps/web/src/
  modules/
    auth/
    catalog/
      api.ts
      queries.ts
      components/
      routes/
    creation/
      api.ts
      queries.ts
      components/
      routes/
    stock/
    sales/
    reports/
  components/
    app-shell.tsx
    ui/
```

Diretrizes:

- `lib/api.ts` deve virar base request + erro estruturado, não catálogo de todos os endpoints;
- cada módulo deve ter tipos, query keys e funções de API próprios;
- `AppShell` deve derivar navegação de uma configuração com contexto e perfis;
- componentes de domínio devem ficar próximos do módulo.

### Banco

Modelagem candidata para design futuro:

```text
CreationReference
  id
  reference
  status
  title/name opcional
  notes
  calculatedCost
  productId opcional unico
  createdById
  approvedAt
  promotedAt

CreationReferenceImage
  id
  referenceId
  kind: SKETCH
  url
  publicId
  sortOrder

CreationCostItem
  id
  referenceId
  kind: MATERIAL | SERVICE | FINISHING | OTHER
  description
  quantity
  unit
  unitCost
  totalCost
```

Essa modelagem ainda precisa de spec/design próprio antes de migration.

## Ordem Recomendada De Melhoria

1. **Authorization Policies:** centralizar helpers de autorização e matriz simples por perfil/contexto.
2. **Catalog API Service Layer:** separar regras reutilizáveis de catálogo antes da promoção de referência.
3. **Shared Frontend API Patterns:** dividir cliente de API, query keys e erro estruturado por domínio.
4. **Product UI Decomposition:** reduzir risco da tela de produtos antes de adicionar vínculo com criação.
5. **Creation Reference Data Design:** desenhar schema/migration do módulo Confecção/Criação.
6. **Creation Reference MVP:** CRUD mínimo de referência, croqui e custo.
7. **Promotion To Product:** transição explícita para produto comercial usando serviços de catálogo.
8. **Stock Services:** entradas/movimentações transacionais por SKU/local.
9. **Sales Services:** venda transacional com baixa de estoque, pagamentos e cancelamento.
10. **Reports By Context:** relatórios respeitando perfil e visibilidade de custo.

## Melhorias De Curto Prazo

- Criar spec técnica para autorização modular antes de novos módulos administrativos.
- Atualizar `ARCHITECTURE.md` para refletir módulos como contextos operacionais.
- Atualizar `CONCERNS.md` com riscos específicos da nova visão modular.
- Evitar implementar Confecção/Criação direto em `catalog/routes.ts` ou `products.tsx`.
- Não alterar o fluxo comercial validado sem teste de regressão.

## Riscos Se Nada For Ajustado

- Confecção vira um conjunto de campos extras dentro de Produto e deixa o cadastro comercial pesado.
- Produto comercial passa a aceitar dados incompletos demais para venda.
- Regras de referência única, custo e promoção são duplicadas em múltiplos módulos.
- Vendedoras podem ver dados internos de custo/fabricação se a autorização continuar genérica.
- Estoque e vendas podem depender de uma referência ainda não vendável.
- O frontend fica difícil de manter porque cada novo módulo aumenta `lib/api.ts`, `AppShell` e páginas grandes.

## Decisão Arquitetural Recomendada

Adotar arquitetura modular por contexto, mantendo o MVP simples:

- permissões por perfil, não por usuário;
- serviços de domínio apenas onde há regra reutilizável ou transação;
- frontend por módulo quando a tela deixa de ser trivial;
- referência de criação separada de produto comercial;
- promoção explícita entre Confecção/Criação e Loja/Catálogo.
