# Estado do Projeto

Atualizado em: 2026-06-12.

## Decisões

- Usar `main` como branch estável e `develop` como branch de integração.
- Seguir Conventional Commits para mensagens de commit.
- Tratar o `PROJECT.md` da raiz como contexto amplo, não como escopo fechado do MVP.
- Usar `.specs/project/PROJECT.md` como especificação oficial e concisa do projeto.
- Documentação deve ser escrita em português; nomes de código, comandos, rotas, paths, APIs, schemas, commits e identificadores técnicos permanecem em inglês.
- Código deve permanecer em inglês; somente textos visíveis para o usuário final ficam em português.
- O MVP foca nas operações centrais: usuários, cadastros configuráveis, coleções, produtos, SKUs, estoque, clientes, vendas, pagamentos, recebíveis e relatórios simples.
- No MVP, uma "peça" significa SKU/variação de produto com quantidade, não uma unidade individualmente rastreada.
- O estoque é controlado por SKU e local.
- Condicional e sacoleira entram no MVP apenas como movimentações de estoque com cliente/pessoa responsável; módulos completos ficam para a Fase 2.
- A referência comercial pertence ao produto; o SKU é identificado por produto + cor + tamanho.
- O custo do produto é opcional no MVP.
- Vendas com saldo em aberto exigem cliente real; vendas rápidas totalmente pagas podem usar o seed `Cliente Balcão`.
- Vendas, pagamentos e movimentações de estoque devem preservar histórico e evitar exclusão física.
- Cancelamento completo de venda faz parte do MVP e deve retornar estoque, cancelar/estornar pagamentos e exigir motivo.
- Pagamentos errados são cancelados/estornados com motivo obrigatório em vez de excluídos.
- Modelar imagens de produto para múltiplas imagens, mas a primeira interface pode suportar apenas uma imagem principal.
- Começar o desenvolvimento localmente; ambiente de desenvolvimento publicado no VPS não é necessário inicialmente.
- O alvo de produção é um VPS com Nginx, PM2, PostgreSQL, Cloudflared Tunnel e acesso a API apenas por `/api`.
- Usar React com Vite no frontend porque o sistema terá muitas telas internas de gestão e componentes reutilizáveis.
- Usar TanStack Router, TanStack Query, TanStack Table, React Hook Form, Zod, Sonner e Lucide React para roteamento, server state, tabelas, formulários, validação, notificações e ícones.
- Usar username + senha para autenticação em vez de email + senha.
- Usar cookies de sessão server-side HTTP-only para autenticação; não usar JWT no MVP.
- Não habilitar CORS por padrão porque frontend e API devem rodar na mesma origem via `/api` em desenvolvimento e produção.
- Seguir a identidade visual da EDREN: clara, elegante, acolhedora, feminina, moderna e operacionalmente legível.
- Usar o verde EDREN `#294F40` como cor primária e o marfim vivo `#FFD699` como destaque de apoio.
- Evitar tema escuro como identidade padrão do frontend.
- Começar o Prisma com entidades de fundação não controversas: usuários, perfis, sessões, grades de tamanho, tamanhos, categorias, cores, locais de estoque, canais de venda e formas de pagamento.
- A descoberta operacional já respondeu as principais regras de produto, SKU, cliente, movimentação de estoque, venda, pagamento, relatório e permissões para o MVP.
- Referências de produto são obrigatórias, únicas, manuais e nunca reutilizadas entre coleções.
- Preço e custo pertencem ao produto/referência, não ao SKU.
- Imagem de produto é opcional.
- Estoque inicial é lançado manualmente.
- Fábrica e Casa EDREN são locais de estoque ativos; locais ou canais que ainda não existem operacionalmente não devem ser cadastrados como futuros no MVP.
- Remover o conceito `FUTURE` dos cadastros configuráveis do MVP; usar apenas ativo/inativo para locais de estoque e canais de venda.
- Toda movimentação de estoque exige motivo.
- Ajuste manual de estoque é restrito a administradores.
- Vendas suportam desconto no nível da venda, múltiplos pagamentos, usuário responsável, canal obrigatório e lançamento posterior com data real da venda.
- Clientes reais exigem WhatsApp único; vendas com saldo em aberto exigem cliente real.
- Recebimento de pagamento, cancelamento de venda, ajuste de estoque, alteração de preço, criação/edição de produto, visibilidade de custo e acesso a recebíveis são ações de administrador no MVP.
- Vendas só podem ser canceladas no mesmo dia no MVP e devem retornar estoque ao local original.
- Relatórios prioritários são vendas do dia, recebíveis e estoque por referência.

## Bloqueios

- Nenhum atualmente.

## Aprendizados

- A próxima fatia de operações foi iniciada como spec em `.specs/features/configurable-registrations/spec.md`, antes de implementar os CRUDs de cadastros configuráveis.
- O primeiro briefing amplo foi reduzido intencionalmente para um MVP menor e mais viável, evitando overbuilding.
- Dados de configuração devem ser editáveis em vez de hardcoded: grades de tamanho, categorias, cores, locais de estoque, canais de venda e formas de pagamento.
- Recebíveis podem ser calculados a partir do total da venda menos pagamentos ativos; parcelamentos formais não são necessários no MVP.
- A primeira tela escura do frontend conflitava com a identidade visual da EDREN e deve seguir a paleta clara da marca.
- A config do Prisma deve carregar explicitamente o `.env` da raiz do monorepo porque `prisma.config.ts` desativa o carregamento padrão do Prisma.
- A migration inicial e o seed foram aplicados com sucesso no PostgreSQL de desenvolvimento depois da correção das credenciais do banco.
- A API carrega o `.env` da raiz por meio de `@edren/database` e expõe `/api/health/db` para validar conectividade com banco e contagens de seed.
- Variáveis de ambiente da API são validadas com Zod antes da inicialização do servidor.
- O logging da API usa Fastify/Pino com pretty logs em desenvolvimento, JSON logs em produção e redaction para cookies, authorization, password e password hashes.
- Erros da API usam subclasses de `AppError` e um error handler centralizado com payloads consistentes e request IDs.
- Requisições da API aceitam `x-request-id` ou geram um UUID.
- O código da API deve crescer por módulos em `apps/api/src/modules`, mantendo routes, schemas, services e repositories separados conforme as features forem adicionadas.
- O frontend agora tem um app shell interno com navegação EDREN e dashboard consumindo `/api/health/db` via TanStack Query.
- O proxy do Vite para `/api` foi validado contra a API Fastify e o endpoint de health do PostgreSQL.
- A release `v0.1.0` foi concluída como fundação fullstack inicial e publicada a partir de `main`.
- Usuários administradores iniciais não são criados por seed ou senha padrão; usar o script terminal-only `npm run users:create-admin` para criar o primeiro administrador com hash argon2id.
- Autenticação por sessão foi implementada com username/senha, verificação argon2, cookies HTTP-only assinados, sessões no banco, `/api/auth/login`, `/api/auth/logout` e `/api/auth/me`.
- O app shell do frontend é protegido por `/api/auth/me`; usuários não autenticados são redirecionados para `/login`.
- Cobertura de rotas da API agora usa Vitest e cobre health routes e comportamento de auth login/me/logout.
- Specs foram inicialmente usadas mais como memória do projeto; specs retroativas agora existem para Fundação do MVP e Autenticação por Sessão. Próximas features grandes devem ser especificadas antes da implementação.
- Cadastros configuráveis foram implementados com migration para ativo/inativo, seed sem `Nova Loja`, rotas `/api/config`, escrita restrita a administradores, leitura autenticada, testes de API e tela `/configuracoes`.

## Levantamento Brownfield 2026-06-12

- O schema do banco já antecipou muitas entidades além da primeira fatia funcional. Isso deve ser tratado como base planejada, não como produto pronto.
- O frontend já criou a estrutura de menus e placeholders para todos os módulos centrais. Esses placeholders devem virar épicos/tarefas formais no roadmap.
- O dashboard atual mede `profiles` e `collections` via health check; isso é uma prova fullstack, não um relatório de negócio.
- A autenticação usa `username`, enquanto parte da especificação falava em email. A decisão registrada favorece `username`, mas futuras telas de usuário devem manter consistência.
- Os seeds foram corrigidos para dados visiveis com acentos, incluindo `Fábrica`, `Cliente Balcão`, `Calça`, `Macacão`, formas de pagamento e `Grade P ao GG`.
- O documento de produção usa porta `43101`, enquanto `.env.example` usa `3001`; isso é aceitável por ambiente, mas precisa ficar explícito.
- Ainda não há CRUD real para cadastros, produtos, clientes, estoque, vendas ou relatórios.
- Permissões por perfil ainda não são aplicadas nas funcionalidades.
- Não há endpoints de negócio transacionais para venda/estoque; esse será o ponto de maior risco.
- Cloudinary está apenas previsto em env/docs/schema; integração de upload ainda não existe.
- `packages/shared` e `packages/config` existem, mas parecem subutilizados.
- Não foi validado se build/test passam nesta rodada; esta análise focou em levantamento e documentação.

## Pendências

- Formalizar a próxima feature `products-and-collections` antes da implementação.
- Formalizar feature specs para `products-skus`, `stock-movements`, `customers`, `sales-payments` e `reports-mvp`.
- Modelar detalhes de transações de produto/venda/estoque a partir de `docs/context/DECISOES_OPERACIONAIS_EDREN.md` quando suas specs forem criadas.
- Implementar produtos/SKUs antes de venda.
- Projetar venda/estoque como transação única no backend para evitar saldo inconsistente.
- Criar matriz simples de permissões antes das primeiras rotas administrativas.
- Adicionar documentação e scripts de backup durante a fase de deploy no VPS.

## Ideias Adiadas

- Módulo completo de condicional com prazos, alertas e relatórios.
- Módulo completo de sacoleira/revendedora com acertos e relatórios.
- Despesas.
- Comissões.
- Parcelamentos formais, juros, multas e cobrança automática.
- Trocas e devoluções parciais.
- Exportações, gráficos, dashboard avançado e metas.
- Paginação, busca textual, filtros por status e ordenação configurável nos cadastros configuráveis quando o volume de dados justificar.
- E-commerce, integrações com WhatsApp/Instagram, gateway de pagamento, notas fiscais, código de barras, etiquetas, app mobile nativo, produção avançada, contabilidade, BI, IA e automação de marketing.

## Preferências

- Manter o MVP simples, confiável e útil para a rotina real da EDREN.
- Evitar arquitetura desnecessária, microsserviços, pnpm, yarn e features que atrasem o núcleo operacional.
