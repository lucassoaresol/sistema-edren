# Spec de Camada de Serviço para Configurações

**Situação:** Planejada.
**Rastreabilidade:** Revisão de tamanho de arquivos; concern técnico sobre `apps/api/src/modules/config/routes.ts`; evolução do padrão aplicado em `catalog-api-service-layer`.

## Propósito

Separar regras e helpers de cadastros configuráveis das rotas Fastify para manter o módulo de configurações sustentável antes de novos cadastros e permissões.

## Problema Atual

- `apps/api/src/modules/config/routes.ts` possui 275 linhas.
- O arquivo mistura registro de rotas, autorização, queries, criação/edição, slug de cor, unicidade de nomes e regras de tamanhos dentro de grades.
- O módulo tende a crescer com novos cadastros configuráveis, gestão de usuários e políticas por contexto.

## Requisitos

- REQ-CONFIG-SVC-001: Rotas de configuração devem preservar o contrato HTTP atual.
- REQ-CONFIG-SVC-002: Regras reutilizáveis de unicidade de nome devem sair da rota quando aplicável.
- REQ-CONFIG-SVC-003: Regras de grades e tamanhos devem ficar em unidade própria, incluindo existência de grade e unicidade de tamanho dentro da grade.
- REQ-CONFIG-SVC-004: Regras de cor devem ficar em unidade própria, incluindo geração de slug quando existir no código atual.
- REQ-CONFIG-SVC-005: Autorização administrativa deve continuar usando helper compartilhado, sem duplicar lógica por módulo.
- REQ-CONFIG-SVC-006: A refatoração deve manter cobertura existente e adicionar testes apenas se algum comportamento ficar descoberto.

## Fora de Escopo

- Alterar schema Prisma.
- Criar novos cadastros configuráveis.
- Alterar UI de configurações.
- Implementar autorização modular completa nesta spec.

## Critérios de Aceite

- `config/routes.ts` fica focado em registrar rotas, validar entrada e delegar regras.
- Funções extraídas possuem nomes claros e ficam em arquivos do módulo `config`.
- Mensagens de erro e status HTTP atuais continuam coerentes para a UI.
- Testes existentes de configuração continuam passando.

## Validação

- `npm run typecheck`
- `npm test`
- `npm run build`
- Testes de API de configuração continuam passando.
