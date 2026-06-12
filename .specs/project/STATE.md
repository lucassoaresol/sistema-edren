# Estado do Projeto

Atualizado em: 2026-06-12.

## Decisoes

- Usar `main` como branch estavel e `develop` como branch de integracao.
- Seguir Conventional Commits para mensagens de commit.
- Tratar o `PROJECT.md` da raiz como contexto amplo, nao como escopo fechado do MVP.
- Usar `.specs/project/PROJECT.md` como especificacao oficial e concisa do projeto.
- Documentacao deve ser escrita em portugues; nomes de codigo, comandos, rotas, paths, APIs, schemas, commits e identificadores tecnicos permanecem em ingles.
- Codigo deve permanecer em ingles; somente textos visiveis para o usuario final ficam em portugues.
- O MVP foca nas operacoes centrais: usuarios, cadastros configuraveis, colecoes, produtos, SKUs, estoque, clientes, vendas, pagamentos, recebiveis e relatorios simples.
- No MVP, uma "peca" significa SKU/variacao de produto com quantidade, nao uma unidade individualmente rastreada.
- O estoque e controlado por SKU e local.
- Condicional e sacoleira entram no MVP apenas como movimentacoes de estoque com cliente/pessoa responsavel; modulos completos ficam para a Fase 2.
- A referencia comercial pertence ao produto; o SKU e identificado por produto + cor + tamanho.
- O custo do produto e opcional no MVP.
- Vendas com saldo em aberto exigem cliente real; vendas rapidas totalmente pagas podem usar o seed `Cliente Balcão`.
- Vendas, pagamentos e movimentacoes de estoque devem preservar historico e evitar exclusao fisica.
- Cancelamento completo de venda faz parte do MVP e deve retornar estoque, cancelar/estornar pagamentos e exigir motivo.
- Pagamentos errados sao cancelados/estornados com motivo obrigatorio em vez de excluidos.
- Modelar imagens de produto para multiplas imagens, mas a primeira interface pode suportar apenas uma imagem principal.
- Comecar o desenvolvimento localmente; ambiente de desenvolvimento publicado no VPS nao e necessario inicialmente.
- O alvo de producao e um VPS com Nginx, PM2, PostgreSQL, Cloudflared Tunnel e acesso a API apenas por `/api`.
- Usar React com Vite no frontend porque o sistema tera muitas telas internas de gestao e componentes reutilizaveis.
- Usar TanStack Router, TanStack Query, TanStack Table, React Hook Form, Zod, Sonner e Lucide React para roteamento, server state, tabelas, formularios, validacao, notificacoes e icones.
- Usar username + senha para autenticacao em vez de email + senha.
- Usar cookies de sessao server-side HTTP-only para autenticacao; nao usar JWT no MVP.
- Nao habilitar CORS por padrao porque frontend e API devem rodar na mesma origem via `/api` em desenvolvimento e producao.
- Seguir a identidade visual da EDREN: clara, elegante, acolhedora, feminina, moderna e operacionalmente legivel.
- Usar o verde EDREN `#294F40` como cor primaria e o marfim vivo `#FFD699` como destaque de apoio.
- Evitar tema escuro como identidade padrao do frontend.
- Comecar o Prisma com entidades de fundacao nao controversas: usuarios, perfis, sessoes, grades de tamanho, tamanhos, categorias, cores, locais de estoque, canais de venda e formas de pagamento.
- A descoberta operacional ja respondeu as principais regras de produto, SKU, cliente, movimentacao de estoque, venda, pagamento, relatorio e permissoes para o MVP.
- Referencias de produto sao obrigatorias, unicas, manuais e nunca reutilizadas entre colecoes.
- Preco e custo pertencem ao produto/referencia, nao ao SKU.
- Imagem de produto e opcional.
- Estoque inicial e lancado manualmente.
- Fábrica e Casa EDREN sao locais de estoque ativos; locais ou canais que ainda nao existem operacionalmente nao devem ser cadastrados como futuros no MVP.
- Remover o conceito `FUTURE` dos cadastros configuraveis do MVP; usar apenas ativo/inativo para locais de estoque e canais de venda.
- Toda movimentacao de estoque exige motivo.
- Ajuste manual de estoque e restrito a administradores.
- Vendas suportam desconto no nivel da venda, multiplos pagamentos, usuario responsavel, canal obrigatorio e lancamento posterior com data real da venda.
- Clientes reais exigem WhatsApp unico; vendas com saldo em aberto exigem cliente real.
- Recebimento de pagamento, cancelamento de venda, ajuste de estoque, alteracao de preco, criacao/edicao de produto, visibilidade de custo e acesso a recebiveis sao acoes de administrador no MVP.
- Vendas so podem ser canceladas no mesmo dia no MVP e devem retornar estoque ao local original.
- Relatorios prioritarios sao vendas do dia, recebiveis e estoque por referencia.

## Bloqueios

- Nenhum atualmente.

## Aprendizados

- A proxima fatia de operacoes foi iniciada como spec em `.specs/features/configurable-registrations/spec.md`, antes de implementar os CRUDs de cadastros configuraveis.
- O primeiro briefing amplo foi reduzido intencionalmente para um MVP menor e mais viavel, evitando overbuilding.
- Dados de configuracao devem ser editaveis em vez de hardcoded: grades de tamanho, categorias, cores, locais de estoque, canais de venda e formas de pagamento.
- Recebiveis podem ser calculados a partir do total da venda menos pagamentos ativos; parcelamentos formais nao sao necessarios no MVP.
- A primeira tela escura do frontend conflitava com a identidade visual da EDREN e deve seguir a paleta clara da marca.
- A config do Prisma deve carregar explicitamente o `.env` da raiz do monorepo porque `prisma.config.ts` desativa o carregamento padrao do Prisma.
- A migration inicial e o seed foram aplicados com sucesso no PostgreSQL de desenvolvimento depois da correcao das credenciais do banco.
- A API carrega o `.env` da raiz por meio de `@edren/database` e expoe `/api/health/db` para validar conectividade com banco e contagens de seed.
- Variaveis de ambiente da API sao validadas com Zod antes da inicializacao do servidor.
- O logging da API usa Fastify/Pino com pretty logs em desenvolvimento, JSON logs em producao e redaction para cookies, authorization, password e password hashes.
- Erros da API usam subclasses de `AppError` e um error handler centralizado com payloads consistentes e request IDs.
- Requisicoes da API aceitam `x-request-id` ou geram um UUID.
- O codigo da API deve crescer por modulos em `apps/api/src/modules`, mantendo routes, schemas, services e repositories separados conforme as features forem adicionadas.
- O frontend agora tem um app shell interno com navegacao EDREN e dashboard consumindo `/api/health/db` via TanStack Query.
- O proxy do Vite para `/api` foi validado contra a API Fastify e o endpoint de health do PostgreSQL.
- A release `v0.1.0` foi concluida como fundacao fullstack inicial e publicada a partir de `main`.
- Usuarios administradores iniciais nao sao criados por seed ou senha padrao; usar o script terminal-only `npm run users:create-admin` para criar o primeiro administrador com hash argon2id.
- Autenticacao por sessao foi implementada com username/senha, verificacao argon2, cookies HTTP-only assinados, sessoes no banco, `/api/auth/login`, `/api/auth/logout` e `/api/auth/me`.
- O app shell do frontend e protegido por `/api/auth/me`; usuarios nao autenticados sao redirecionados para `/login`.
- Cobertura de rotas da API agora usa Vitest e cobre health routes e comportamento de auth login/me/logout.
- Specs foram inicialmente usadas mais como memoria do projeto; specs retroativas agora existem para Fundacao do MVP e Autenticacao por Sessao. Proximas features grandes devem ser especificadas antes da implementacao.
- Cadastros configuraveis foram implementados com migration para ativo/inativo, seed sem `Nova Loja`, rotas `/api/config`, escrita restrita a administradores, leitura autenticada, testes de API e tela `/configuracoes`.

## Levantamento Brownfield 2026-06-12

- O schema do banco ja antecipou muitas entidades alem da primeira fatia funcional. Isso deve ser tratado como base planejada, nao como produto pronto.
- O frontend ja criou a estrutura de menus e placeholders para todos os modulos centrais. Esses placeholders devem virar epicos/tarefas formais no roadmap.
- O dashboard atual mede `profiles` e `collections` via health check; isso e uma prova fullstack, nao um relatorio de negocio.
- A autenticacao usa `username`, enquanto parte da especificacao falava em email. A decisao registrada favorece `username`, mas futuras telas de usuario devem manter consistencia.
- Os seeds foram corrigidos para dados visiveis com acentos, incluindo `Fábrica`, `Cliente Balcão`, `Calça`, `Macacão`, formas de pagamento e `Grade P ao GG`.
- O documento de producao usa porta `43101`, enquanto `.env.example` usa `3001`; isso e aceitavel por ambiente, mas precisa ficar explicito.
- Ainda nao ha CRUD real para cadastros, produtos, clientes, estoque, vendas ou relatorios.
- Permissoes por perfil ainda nao sao aplicadas nas funcionalidades.
- Nao ha endpoints de negocio transacionais para venda/estoque; esse sera o ponto de maior risco.
- Cloudinary esta apenas previsto em env/docs/schema; integracao de upload ainda nao existe.
- `packages/shared` e `packages/config` existem, mas parecem subutilizados.
- Nao foi validado se build/test passam nesta rodada; esta analise focou em levantamento e documentacao.

## Pendencias

- Formalizar a proxima feature `products-and-collections` antes da implementacao.
- Formalizar feature specs para `products-skus`, `stock-movements`, `customers`, `sales-payments` e `reports-mvp`.
- Modelar detalhes de transacoes de produto/venda/estoque a partir de `docs/context/DECISOES_OPERACIONAIS_EDREN.md` quando suas specs forem criadas.
- Implementar produtos/SKUs antes de venda.
- Projetar venda/estoque como transacao unica no backend para evitar saldo inconsistente.
- Criar matriz simples de permissoes antes das primeiras rotas administrativas.
- Adicionar documentacao e scripts de backup durante a fase de deploy no VPS.

## Ideias Adiadas

- Modulo completo de condicional com prazos, alertas e relatorios.
- Modulo completo de sacoleira/revendedora com acertos e relatorios.
- Despesas.
- Comissoes.
- Parcelamentos formais, juros, multas e cobranca automatica.
- Trocas e devolucoes parciais.
- Exportacoes, graficos, dashboard avancado e metas.
- Paginacao, busca textual, filtros por status e ordenacao configuravel nos cadastros configuraveis quando o volume de dados justificar.
- E-commerce, integracoes com WhatsApp/Instagram, gateway de pagamento, notas fiscais, codigo de barras, etiquetas, app mobile nativo, producao avancada, contabilidade, BI, IA e automacao de marketing.

## Preferencias

- Manter o MVP simples, confiavel e util para a rotina real da EDREN.
- Evitar arquitetura desnecessaria, microsservicos, pnpm, yarn e features que atrasem o nucleo operacional.
