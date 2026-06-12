# Roadmap

**Marco atual:** Operacoes do MVP
**Situacao:** Fundacao publicada; autenticacao concluida; operacoes em planejamento

## Fundacao Do MVP

**Objetivo:** Criar o monorepo, os apps base, a camada de banco, a autenticacao e os dados configuraveis iniciais necessarios para todas as features do MVP.
**Alvo:** Concluido quando o desenvolvimento local puder executar frontend, backend, Prisma e dados PostgreSQL semeados.

### Funcionalidades

**Monorepo Setup** - FEITO

- Configurar npm workspaces.
- Criar `apps/web` com Vite, React, TypeScript e Tailwind CSS.
- Criar `apps/api` com Fastify.
- Criar estrutura de packages compartilhados e de banco conforme necessario.

**Database Foundation** - FEITO

- Configurar PostgreSQL e Prisma.
- Modelar usuarios, perfis, sessoes, cadastros configuraveis, colecoes, produtos, SKUs, clientes, estoque, vendas, pagamentos e motivos de movimentacao/cancelamento conforme as decisoes operacionais.
- Adicionar seeds iniciais para perfis, dados de configuracao, colecoes, locais de estoque, canais de venda, formas de pagamento e locais futuros/inativos.

**Authentication And Permissions** - EM ANDAMENTO

- Implementar login com username/senha.
- Armazenar senhas com hash seguro.
- Usar cookies de sessao HTTP-only.
- Adicionar permissoes simples baseadas em perfil.
- Suportar ativacao/inativacao de usuarios.

**Situacao atual:** login com username/senha, verificacao argon2, sessoes no banco, cookies HTTP-only assinados, app shell protegido, tela de login, script de bootstrap de administrador e cobertura de rotas da API ja foram implementados. A aplicacao fina de permissoes por perfil ainda fica pendente para as futuras telas/acoes de negocio.

## Operacoes Do MVP

**Objetivo:** Suportar o fluxo diario central da EDREN para produtos, estoque, clientes, vendas, pagamentos e recebiveis.
**Alvo:** Concluido quando usuarios puderem cadastrar produtos/SKUs, movimentar estoque, vender itens, registrar pagamentos e visualizar saldos em aberto.

### Funcionalidades

**Configurable Registrations** - FEITO

- Gerenciar grades de tamanho e tamanhos.
- Gerenciar categorias, cores, locais de estoque, canais de venda e formas de pagamento.

**Products And Collections** - PLANEJADA

- Gerenciar colecoes.
- Gerenciar produtos com referencia comercial e custo opcional.
- Gerenciar SKUs por produto, cor e tamanho.
- Enviar uma imagem principal de produto mantendo o modelo preparado para multiplas imagens.
- Manter preco de venda e custo no nivel de produto/referencia.
- Permitir produto sem imagem.

**Customers** - PLANEJADA

- Gerenciar clientes.
- Usar `Cliente Balcão` para vendas rapidas totalmente pagas.
- Exigir cliente real para vendas com saldo em aberto.
- Exigir nome e WhatsApp unico para clientes reais.
- Suportar classificacao de cliente final e sacoleira/revendedora.

**Stock Control** - PLANEJADA

- Controlar saldos por SKU e local de estoque.
- Registrar entradas de estoque.
- Registrar movimentacoes de estoque.
- Exigir motivo da movimentacao.
- Suportar entrada manual de estoque inicial.
- Restringir ajuste manual de estoque a administradores.
- Suportar condicional e sacoleira apenas como movimentacoes de estoque com cliente/pessoa responsavel.

**Sales And Payments** - PLANEJADA

- Registrar vendas e itens de venda.
- Suportar fluxo rapido de venda com busca por referencia do produto.
- Baixar estoque em vendas confirmadas.
- Suportar pagamentos multiplos e parciais.
- Suportar desconto no nivel da venda com motivo obrigatorio.
- Exigir usuario responsavel e canal de venda.
- Permitir lancamento posterior preservando data da venda e data de entrada.
- Calcular recebiveis a partir do total da venda menos pagamentos ativos.
- Cancelar vendas completas com motivo obrigatorio, retorno de estoque e cancelamento/estorno dos pagamentos.
- Cancelar/estornar pagamentos errados com motivo obrigatorio.
- Restringir recebimento de pagamento e cancelamento de venda a administradores.

## Visibilidade Do MVP

**Objetivo:** Fornecer visibilidade operacional simples sem dashboards avancados ou exportacoes.
**Alvo:** Concluido quando a EDREN puder responder perguntas basicas de vendas, estoque e recebiveis pelo sistema.

### Funcionalidades

**Home Panel** - PLANEJADA

- Mostrar indicadores operacionais praticos.
- Manter o painel simples e sem excesso de graficos.

**Minimum Reports** - PLANEJADA

- Vendas por periodo, dia e mes.
- Estoque por produto/SKU, referencia e local.
- Recebiveis e clientes com saldo em aberto.
- Vendas por colecao e canal.

## Deploy E Operacoes

**Objetivo:** Preparar o deploy de producao no VPS da EDREN depois que o MVP funcionar localmente.
**Alvo:** Concluido quando a producao puder rodar com Nginx, PM2, PostgreSQL e Cloudflared Tunnel.

### Funcionalidades

**Production Build** - DOCUMENTADA

- Buildar assets estaticos do frontend.
- Buildar backend para execucao com PM2.
- Configurar variaveis de ambiente de producao.

**VPS Deployment** - DOCUMENTADA

- Servir frontend pelo Nginx.
- Fazer proxy de `/api` para o Fastify local.
- Manter backend sem dominio publico separado para API.
- Configurar processo PM2.

**Backup Preparation** - PLANEJADA

- Documentar backup e restore do PostgreSQL.
- Adicionar script basico de backup durante a fase de deploy.

## Analise Do Estado Atual

- Fundacao tecnica: parcialmente concluida e ja demonstrada com web, API, banco e seed.
- Autenticacao: implementada para login/logout/me; falta CRUD de usuarios e enforcement de permissoes por perfil nas acoes de negocio.
- Cadastros configuraveis: modelados e seedados; faltam endpoints e telas CRUD.
- Produtos/SKUs/estoque: modelados; faltam fluxos operacionais e atualizacao transacional de saldos.
- Clientes: modelados e Cliente Balcão seedado; falta CRUD e historico financeiro.
- Vendas/pagamentos: modelados; falta API transacional, baixa de estoque, cancelamento e contas a receber calculadas.
- Relatorios: ainda nao implementados; dashboard atual e apenas uma prova fullstack.
- Deploy: documento de producao existe; nao foi validado nesta analise.

## Fase 2

- Modulo completo de condicional com prazos, alertas e relatorios.
- Modulo completo de sacoleira/revendedora com acertos e relatorios.
- Despesas.
- Comissoes.
- Parcelamentos formais.
- Trocas e devolucoes parciais.
- Exportacoes, graficos, dashboard avancado, metas e comparativos.

## Consideracoes Futuras

- E-commerce ou pedidos publicos de clientes.
- Integracoes com WhatsApp e Instagram.
- Integracao com gateway de pagamento.
- Integracao fiscal/nota.
- Codigo de barras e etiquetas.
- App mobile nativo.
- Controle de producao avancado.
- Contabilidade avancada, BI, IA e automacao de marketing.
- Ambiente de desenvolvimento publicado no VPS, se necessario.
