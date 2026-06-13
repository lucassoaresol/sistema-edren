# Estado do Projeto

Atualizado em: 2026-06-13.

## Decisões

- Usar `main` como branch estável e `develop` como branch de integração.
- Seguir Conventional Commits para mensagens de commit.
- Uma spec ou tarefa só pode ser marcada como concluída depois de validação executada e commit atômico criado com Conventional Commit.
- Specs concluídas devem registrar o commit ou a lista de commits que entregam a mudança.
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
- Coleções têm data de início obrigatória e data de fim opcional; somente coleções vigentes podem ser escolhidas para novo vínculo em produto.
- Preço e custo pertencem ao produto/referência, não ao SKU.
- Imagem de produto é opcional.
- Imagem principal de produto deve usar upload direto para Cloudinary pelo backend; URL/publicId manual foi apenas etapa intermediária e não é o fluxo final esperado.
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
- A referência deve ser tratada como conceito transversal entre módulos: na Confecção representa criação/fabricação; na Loja/Catálogo representa produto vendável; em Estoque, Vendas e Relatórios aparece por meio do produto comercial e SKUs.
- O sistema deve separar modularmente Confecção/Criação e Loja/Catálogo para evitar que o cadastro de produto vire uma cópia pesada do caderno físico ou que a criação da peça seja reduzida a mercadoria pronta.
- Cada módulo deve ser tratado como contexto operacional com dados, linguagem, ações e permissões próprias; acesso continua simples por perfil no MVP, sem permissões customizadas por usuário.
- O contexto de Confecção/Criação deve ser restrito por padrão a `ADMIN`; perfis de venda não devem acessar custo detalhado, croqui e decisões internas de fabricação.
- O contexto de Loja/Catálogo deve permitir consulta operacional para perfis que vendem ou movimentam estoque, mas alteração de produto, preço, custo e SKUs permanece administrativa no MVP.
- Revisão arquitetural modular registrada em `.specs/codebase/MODULAR_ARCHITECTURE_REVIEW.md`: antes de Confecção/Criação, Estoque e Vendas, priorizar autorização modular, camada de serviço de catálogo, padrões de API frontend e decomposição da UI de produtos.

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
- UAT inicial da tela de produtos identificou ajustes de escrita em português e a regra de vigência de coleções; ambos foram incorporados à feature `products-and-collections`.
- Specs marcadas como concluídas sem commit geram perda de rastreabilidade; o fluxo passa a exigir commit antes de atualizar status para `Implementada`, `Concluída` ou equivalente.
- Entregas devem ser apresentadas para revisão do usuário antes de criar commit e antes de executar push; o commit e o push só acontecem após aprovação explícita.
- Antes de trocar de contexto, encerrar a sessão ou iniciar nova frente, não deixar implementação validada apenas no working tree: apresentar o diff/validação e pedir aprovação explícita para commit, ou registrar claramente que a entrega ficou sem commit.
- Antes de encerrar uma sessão, já deixar claro o próximo passo recomendado e decidir se a continuação cabe na mesma sessão ou se é melhor abrir outra com novo contexto.
- O contexto do caderno de produtos mostrou que a EDREN precisa registrar o nascimento da peça antes da venda; a feature `product-creation-reference` passa a detalhar esse módulo de Confecção/Criação e sua promoção para produto comercial.

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
- Cloudinary está previsto em env/docs/schema e o upload de imagem principal de produto foi implementado na feature `products-and-collections`; ainda falta validação manual com credenciais reais.
- `packages/shared` e `packages/config` existem, mas parecem subutilizados.
- Não foi validado se build/test passam nesta rodada; esta análise focou em levantamento e documentação.

## Pendências

- Feature `products-and-collections` concluída, validada e promovida a candidata da release `v0.2.0` em 2026-06-13.
- Antes de cortar `v0.2.0`, validar migration em ambiente alvo, confirmar upload Cloudinary com credenciais reais e concluir PR/merge para `main`.
- Formalizar feature specs para `products-skus`, `stock-movements`, `customers`, `sales-payments` e `reports-mvp`.
- Modelar detalhes de transações de produto/venda/estoque a partir de `docs/context/DECISOES_OPERACIONAIS_EDREN.md` quando suas specs forem criadas.
- Implementar produtos/SKUs antes de venda.
- Projetar venda/estoque como transação única no backend para evitar saldo inconsistente.
- Criar matriz simples de permissões antes das primeiras rotas administrativas.
- Criar spec técnica para autorização modular por contexto/ação usando os perfis existentes `ADMIN`, `MANAGER` e `SELLER_OPERATOR`.
- Atualizar specs técnicas planejadas para considerar a revisão `.specs/codebase/MODULAR_ARCHITECTURE_REVIEW.md`.
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
