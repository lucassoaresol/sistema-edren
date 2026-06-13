# Roadmap

**Marco atual:** Operações do MVP
**Situação:** Catálogo em release candidate para `v0.2.0`; estoque é a próxima fatia funcional planejada

## Fundação do MVP

**Objetivo:** Criar o monorepo, os apps base, a camada de banco, a autenticação e os dados configuráveis iniciais necessários para todas as features do MVP.
**Alvo:** Concluído quando o desenvolvimento local puder executar frontend, backend, Prisma e dados PostgreSQL semeados.

### Funcionalidades

**Monorepo Setup** - FEITO

- Configurar npm workspaces.
- Criar `apps/web` com Vite, React, TypeScript e Tailwind CSS.
- Criar `apps/api` com Fastify.
- Criar estrutura de packages compartilhados e de banco conforme necessário.

**Database Foundation** - FEITO

- Configurar PostgreSQL e Prisma.
- Modelar usuários, perfis, sessões, cadastros configuráveis, coleções, produtos, SKUs, clientes, estoque, vendas, pagamentos e motivos de movimentação/cancelamento conforme as decisões operacionais.
- Adicionar seeds iniciais para perfis, dados de configuração, coleções, locais de estoque, canais de venda, formas de pagamento e locais futuros/inativos.

**Authentication And Permissions** - EM ANDAMENTO

- Implementar login com username/senha.
- Armazenar senhas com hash seguro.
- Usar cookies de sessão HTTP-only.
- Adicionar permissões simples baseadas em perfil.
- Suportar ativação/inativação de usuários.
- Planejar gestão de usuários por administradores, sem spec criada ainda.

**Situação atual:** login com usuário/senha, verificação argon2, sessões no banco, cookies HTTP-only assinados, app shell protegido, tela de login, script de bootstrap de administrador e cobertura de rotas da API já foram implementados. A gestão de usuários por tela administrativa e a aplicação fina de permissões por perfil ainda ficam pendentes para as futuras telas/ações de negócio.

## Operações do MVP

**Objetivo:** Suportar o fluxo diário central da EDREN para produtos, estoque, clientes, vendas, pagamentos e recebíveis.
**Alvo:** Concluído quando usuários puderem cadastrar produtos/SKUs, movimentar estoque, vender itens, registrar pagamentos e visualizar saldos em aberto.

### Funcionalidades

**Configurable Registrations** - FEITO

- Gerenciar grades de tamanho e tamanhos.
- Gerenciar categorias, cores, locais de estoque, canais de venda e formas de pagamento.

**Products And Collections** - RELEASE CANDIDATE

- Gerenciar coleções.
- Gerenciar produtos com referência comercial e custo opcional.
- Gerenciar SKUs por produto, cor e tamanho.
- Enviar uma imagem principal de produto mantendo o modelo preparado para múltiplas imagens.
- Manter preço de venda e custo no nível de produto/referência.
- Permitir produto sem imagem.

**Situação atual:** implementada e validada em `develop` com typecheck, testes e build. Antes do corte final da `v0.2.0`, validar migration e Cloudinary no ambiente alvo, abrir PR para `main` e atualizar release/tag.

**Customers** - PLANEJADA

- Gerenciar clientes.
- Usar `Cliente Balcão` para vendas rápidas totalmente pagas.
- Exigir cliente real para vendas com saldo em aberto.
- Exigir nome e WhatsApp único para clientes reais.
- Suportar classificação de cliente final e sacoleira/revendedora.

**Stock Control** - PLANEJADA

- Controlar saldos por SKU e local de estoque.
- Registrar entradas de estoque.
- Registrar movimentações de estoque.
- Exigir motivo da movimentação.
- Suportar entrada manual de estoque inicial.
- Restringir ajuste manual de estoque a administradores.
- Suportar condicional e sacoleira apenas como movimentações de estoque com cliente/pessoa responsável.

**Sales And Payments** - PLANEJADA

- Registrar vendas e itens de venda.
- Suportar fluxo rápido de venda com busca por referência do produto.
- Baixar estoque em vendas confirmadas.
- Suportar pagamentos múltiplos e parciais.
- Suportar desconto no nível da venda com motivo obrigatório.
- Exigir usuário responsável e canal de venda.
- Permitir lançamento posterior preservando data da venda e data de entrada.
- Calcular recebíveis a partir do total da venda menos pagamentos ativos.
- Cancelar vendas completas com motivo obrigatório, retorno de estoque e cancelamento/estorno dos pagamentos.
- Cancelar/estornar pagamentos errados com motivo obrigatório.
- Restringir recebimento de pagamento e cancelamento de venda a administradores.

## Visibilidade Do MVP

**Objetivo:** Fornecer visibilidade operacional simples sem dashboards avançados ou exportações.
**Alvo:** Concluído quando a EDREN puder responder perguntas básicas de vendas, estoque e recebíveis pelo sistema.

### Funcionalidades

**Home Panel** - PLANEJADA

- Mostrar indicadores operacionais práticos.
- Manter o painel simples e sem excesso de gráficos.

**Minimum Reports** - PLANEJADA

- Vendas por período, dia e mês.
- Estoque por produto/SKU, referência e local.
- Recebíveis e clientes com saldo em aberto.
- Vendas por coleção e canal.

## Deploy e Operações

**Objetivo:** Preparar o deploy de produção no VPS da EDREN depois que o MVP funcionar localmente.
**Alvo:** Concluído quando a produção puder rodar com Nginx, PM2, PostgreSQL e Cloudflared Tunnel.

### Funcionalidades

**Production Build** - DOCUMENTADA

- Buildar assets estáticos do frontend.
- Buildar backend para execução com PM2.
- Configurar variáveis de ambiente de produção.

**VPS Deployment** - DOCUMENTADA

- Servir frontend pelo Nginx.
- Fazer proxy de `/api` para o Fastify local.
- Manter backend sem domínio público separado para API.
- Configurar processo PM2.

**Backup Preparation** - PLANEJADA

- Documentar backup e restore do PostgreSQL.
- Adicionar script básico de backup durante a fase de deploy.

## Qualidade Técnica e Evolução Arquitetural

**Objetivo:** Reduzir o custo de manutenção antes das próximas fatias críticas de estoque, vendas e recebíveis.
**Alvo:** Concluído quando os módulos mais extensos estiverem divididos por responsabilidade, regras de negócio críticas estiverem fora das rotas e padrões reutilizáveis estiverem documentados.

### Funcionalidades

**Product UI Decomposition** - PLANEJADA

- Dividir `apps/web/src/routes/products.tsx` em rota, componentes de coleção, formulário/lista/detalhe de produto, SKUs, imagem e utilitários.
- Preservar comportamento atual de catálogo, upload de imagem e permissões.
- Reduzir o risco de regressão antes de evoluir estoque e vendas sobre produtos/SKUs.

**Catalog API Service Layer** - PLANEJADA

- Extrair regras de catálogo de `apps/api/src/modules/catalog/routes.ts` para serviços/repositórios/serializadores pequenos.
- Centralizar validações reutilizáveis de coleção vigente, referência única, relações de produto e SKU.
- Preparar transações e reuso por estoque/vendas sem duplicar regra em rotas.

**Shared Frontend API Patterns** - PLANEJADA

- Separar tipos, query keys e clientes de API por domínio em vez de manter tudo em `apps/web/src/lib/api.ts`.
- Criar padrões reutilizáveis para estados de formulário, selects, query state, invalidação e mensagens de erro.
- Melhorar mensagens de erro da UI usando payloads da API quando disponíveis.

## Análise do Estado Atual

- Fundação técnica: parcialmente concluída e já demonstrada com web, API, banco e seed.
- Autenticação: implementada para login/logout/me com usuário/senha; falta gestão de usuários e enforcement de permissões por perfil nas ações de negócio.
- Cadastros configuráveis: modelados e seedados; faltam endpoints e telas CRUD.
- Produtos/SKUs/estoque: modelados; faltam fluxos operacionais e atualização transacional de saldos.
- Clientes: modelados e Cliente Balcão seedado; falta CRUD e histórico financeiro.
- Vendas/pagamentos: modelados; falta API transacional, baixa de estoque, cancelamento e contas a receber calculadas.
- Relatórios: ainda não implementados; dashboard atual é apenas uma prova fullstack.
- Deploy: documento de produção existe; não foi validado nesta análise.

## Fase 2

- Módulo completo de condicional com prazos, alertas e relatórios.
- Módulo completo de sacoleira/revendedora com acertos e relatórios.
- Despesas.
- Comissões.
- Parcelamentos formais.
- Trocas e devoluções parciais.
- Exportações, gráficos, dashboard avançado, metas e comparativos.

## Considerações Futuras

- E-commerce ou pedidos públicos de clientes.
- Integrações com WhatsApp e Instagram.
- Integração com gateway de pagamento.
- Integração fiscal/nota.
- Código de barras e etiquetas.
- App mobile nativo.
- Controle de produção avançado.
- Contabilidade avançada, BI, IA e automação de marketing.
- Ambiente de desenvolvimento publicado no VPS, se necessário.
