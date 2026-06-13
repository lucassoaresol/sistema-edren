# Changelog

Todas as mudanças relevantes do Sistema EDREN devem ser registradas neste arquivo.

O formato segue a ideia de Keep a Changelog, adaptado para um sistema interno em MVP, e o versionamento segue SemVer enquanto o projeto estiver em `0.x`.

## [Não Lançado]

### Documentação

- Adicionado planejamento de releases em `docs/releases/PLANEJAMENTO_DE_RELEASES.md`.
- Expandido o README principal com visão do projeto, stack, comandos e links de documentação.
- Criado este changelog para rastreabilidade de entregas.
- Adicionadas specs técnicas de melhoria para decomposição da UI de produtos, camada de serviço do catálogo e padrões de API client.

### Próximas Releases Planejadas

- `v0.2.0`: catálogo, coleções, produtos e SKUs.
- `v0.3.0`: estoque essencial.
- `v0.4.0`: vendas, pagamentos e recebíveis básicos.
- `v0.5.0`: painel inicial e relatórios mínimos.
- `v1.0.0`: MVP validado em uso real.

## [0.2.0] - 2026-06-13

### Adicionado

- Módulo de catálogo com coleções, produtos/referências e SKUs.
- Cadastro e edição de coleções com data de início obrigatória, data de fim opcional e status ativo/arquivado.
- Cadastro e edição de produtos com referência única, nome, descrição, coleção, categoria, grade, preço de venda, custo opcional e status ativo/inativo.
- Gestão de SKUs por produto, cor e tamanho, com validação de tamanho pertencente à grade do produto.
- Upload, substituição e remoção de imagem principal de produto via Cloudinary.
- Listagem e detalhe de produto em `/products` e `/products/:productId`.
- Testes de API para autenticação, permissões, duplicidade, relações inválidas, coleção vigente, SKUs e imagem principal.
- Migration `20260613120000_add_collection_dates` para adicionar datas em coleções.

### Documentação

- Spec, design e tasks de `products-and-collections`.
- Registro de integração Cloudinary em `.specs/codebase/INTEGRATIONS.md`.

### Validação

- `npm run typecheck`: passou em 2026-06-13.
- `npm test`: passou em 2026-06-13, 4 arquivos e 26 testes.
- `npm run build`: passou em 2026-06-13.
- Build web emitiu aviso conhecido de chunk JS acima de 500 kB após minificação.

### Riscos Conhecidos

- Validar upload Cloudinary com credenciais reais do ambiente alvo.
- A UI de produtos está funcional, mas o arquivo `apps/web/src/routes/products.tsx` ficou grande; decomposição já foi registrada como melhoria técnica planejada.
- Estoque, vendas, pagamentos, recebíveis e relatórios continuam fora desta release.

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
