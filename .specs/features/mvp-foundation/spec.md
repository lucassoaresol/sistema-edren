# Spec da Fundação do MVP

**Situação:** Implementada retroativamente a partir dos commits existentes.
**Rastreabilidade:** release inicial `v0.1.0` e atualizações posteriores de deploy/bootstrap.

## Propósito

Criar a fundação técnica necessária para construir o MVP da EDREN com segurança: estrutura de monorepo, app shell do frontend, fundação da API, schema/seeds do banco, documentação operacional e orientação de deploy para produção.

## Requisitos

- REQ-MVPF-001: O projeto deve usar um monorepo com npm workspaces e apps/packages separados.
- REQ-MVPF-002: O frontend deve usar Vite, React, TypeScript, Tailwind CSS e a direção visual clara da EDREN.
- REQ-MVPF-003: A API deve usar Fastify com logging estruturado, request IDs, tratamento centralizado de erros e validação de ambiente.
- REQ-MVPF-004: A camada de banco deve usar Prisma com PostgreSQL e carregar corretamente a configuração de ambiente a partir da raiz do monorepo.
- REQ-MVPF-005: Os modelos e seeds iniciais do Prisma devem suportar usuários/perfis/sessões e dados operacionais configuráveis necessários para o MVP.
- REQ-MVPF-006: A API deve expor endpoints de health para checar aplicação e conectividade com banco/seeds.
- REQ-MVPF-007: O frontend deve consumir a saúde do backend pelo caminho `/api`.
- REQ-MVPF-008: A orientação de deploy de produção deve suportar VPS, Nginx, PM2, PostgreSQL, Cloudflared Tunnel e ausência de domínio público separado para API.

## Fora de Escopo

- Fluxos completos de produto, SKU, estoque, cliente, venda, pagamento e relatórios.
- Dashboards avançados, exportações, integrações, e-commerce, app nativo e automação.
- Ambiente de desenvolvimento publicado no VPS.

## Validação

- `npm run check`
- `npm audit --audit-level=moderate`
- `GET /api/health`
- `GET /api/health/db`

## Observações

- Esta spec foi adicionada depois da implementação para restaurar rastreabilidade. Próximas features grandes devem receber spec antes da execução.
