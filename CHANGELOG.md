# Changelog

Todas as mudanças relevantes do Sistema EDREN devem ser registradas neste arquivo.

O formato segue a ideia de Keep a Changelog, adaptado para um sistema interno em MVP, e o versionamento segue SemVer enquanto o projeto estiver em `0.x`.

## [Não Lançado]

### Documentação

- Adicionado planejamento de releases em `docs/releases/PLANEJAMENTO_DE_RELEASES.md`.
- Expandido o README principal com visão do projeto, stack, comandos e links de documentação.
- Criado este changelog para rastreabilidade de entregas.

### Próximas Releases Planejadas

- `v0.2.0`: catálogo, coleções, produtos e SKUs.
- `v0.3.0`: estoque essencial.
- `v0.4.0`: vendas, pagamentos e recebíveis básicos.
- `v0.5.0`: painel inicial e relatórios mínimos.
- `v1.0.0`: MVP validado em uso real.

## [0.1.1] - Planejada/Documentada

### Adicionado

- Guia de deploy de produção para `sistema.edren.com.br`, Nginx, PM2, PostgreSQL e Cloudflared Tunnel.
- Orientação operacional para publicar frontend estático e API Fastify no mesmo domínio via `/api`.

### Validação Esperada

- `npm ci`
- `npm run db:generate`
- `npm run db:migrate`
- `npm run db:seed`
- `npm run build`
- `GET /api/health`
- `GET /api/health/db`

### Riscos Conhecidos

- A release depende de credenciais e configuração real de produção fora do repositório.
- Rotina formal de backup/restauração ainda deve ser documentada antes de operar dados críticos.

## [0.1.0] - Fundação do MVP

### Adicionado

- Monorepo com npm workspaces para apps e packages.
- Frontend com Vite, React, TypeScript e Tailwind CSS.
- API com Fastify, validação de ambiente, logging estruturado, request IDs e tratamento centralizado de erros.
- Prisma com PostgreSQL para camada de banco.
- Seeds iniciais para dados operacionais configuráveis.
- Health checks da API e do banco.
- Autenticação por sessão server-side com cookie HTTP-only assinado.
- Bootstrap seguro de usuário administrador por script terminal-only.
- Rotas e testes de autenticação.
- Cadastros configuráveis para grades de tamanho, tamanhos, categorias, cores, locais de estoque, canais de venda e formas de pagamento.
- Tela `/configuracoes` para administração dos cadastros configuráveis.

### Documentação

- Specs retroativas para fundação do MVP e autenticação por sessão.
- Spec de cadastros configuráveis.
- Documentos de contexto operacional e técnico da EDREN.

### Validação Registrada Nas Specs

- `npm run typecheck`
- `npm run test`
- `npm run build`
- `npm run check`
- `npm audit --audit-level=moderate`
- Checagens manuais de login, logout, health checks e tela `/configuracoes`.

### Riscos Conhecidos

- Algumas specs iniciais foram adicionadas retroativamente; as próximas fatias funcionais devem ser especificadas antes da implementação.
- Permissões customizadas por usuário seguem fora do MVP.
- Fluxos completos de catálogo, estoque, vendas, pagamentos e relatórios ainda não fazem parte desta release.
