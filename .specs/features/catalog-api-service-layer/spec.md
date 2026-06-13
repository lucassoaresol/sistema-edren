# Spec de Camada de Serviço para Catálogo

**Situação:** Implementada.
**Rastreabilidade:** Roadmap `Catalog API Service Layer`; concern técnico sobre `apps/api/src/modules/catalog/routes.ts`; base para futuras specs de estoque e vendas.
**Commits:** `8b7b055`, `78a5db5`, `7d62ba9`, `2d85ab0`, `224834d`, `5ca4bcd`.

## Propósito

Separar regras de negócio de catálogo das rotas Fastify para facilitar reuso por estoque, vendas e relatórios sem duplicar validações críticas.

## Problema Atual

- `apps/api/src/modules/catalog/routes.ts` possui 488 linhas.
- O arquivo concentra handlers HTTP, validações de existência, unicidade, coleção vigente, relação produto/SKU, serialização e integração de imagem.
- Regras como referência única, coleção vigente e tamanho pertencente à grade serão relevantes em fluxos futuros e tendem a ser copiadas se permanecerem presas ao arquivo de rotas.

## Requisitos

- REQ-CAT-SVC-001: Rotas de catálogo devem permanecer com o mesmo contrato HTTP atual.
- REQ-CAT-SVC-002: Regras de coleção devem ser extraídas para unidade reutilizável, incluindo existência, unicidade de nome e vigência.
- REQ-CAT-SVC-003: Regras de produto devem ser extraídas para unidade reutilizável, incluindo referência única, relações obrigatórias e restrição de troca de grade com SKUs existentes.
- REQ-CAT-SVC-004: Regras de SKU devem ser extraídas para unidade reutilizável, incluindo relação cor/tamanho, pertencimento à grade e unicidade da combinação.
- REQ-CAT-SVC-005: Serialização de produto deve ficar fora do arquivo de rotas, preservando ocultação de custo para não administradores.
- REQ-CAT-SVC-006: Fluxo de imagem principal deve ficar isolado em serviço próprio ou função de domínio, preservando upload, substituição, remoção e limpeza de asset anterior.
- REQ-CAT-SVC-007: Autorização administrativa deve usar helper reutilizável compartilhado entre módulos, sem duplicar `requireAdmin` por arquivo.
- REQ-CAT-SVC-008: A refatoração deve manter cobertura de testes existente e adicionar testes apenas quando um comportamento ficar descoberto.

## Fora de Escopo

- Alterar schema Prisma.
- Criar múltiplas imagens na UI.
- Implementar estoque ou venda.
- Reescrever todos os módulos da API de uma vez.

## Critérios de Aceite

- `catalog/routes.ts` fica focado em registrar rotas, validar entrada e delegar para funções de domínio.
- Funções de regra de negócio possuem nomes claros e podem ser importadas por módulos futuros quando necessário.
- `requireAdmin` ou política equivalente não fica duplicada entre `config` e `catalog`.
- Contratos de erro atuais continuam coerentes para a UI.

## Validação

- `npm run typecheck`
- `npm test`
- `npm run build`
- Testes de API de catálogo existentes continuam passando.
- Checagem manual de criação/edição de produto, SKU, coleção e imagem principal.

## Entrega

- REQ-CAT-SVC-001: Contrato HTTP preservado; testes de API existentes continuaram passando.
- REQ-CAT-SVC-002: Regras de coleção extraídas para `apps/api/src/modules/catalog/collections.ts`.
- REQ-CAT-SVC-003: Regras de produto extraídas para `apps/api/src/modules/catalog/products.ts`.
- REQ-CAT-SVC-004: Regras de SKU extraídas para `apps/api/src/modules/catalog/variants.ts`.
- REQ-CAT-SVC-005: Serialização de produto extraída para `apps/api/src/modules/catalog/serializers.ts`.
- REQ-CAT-SVC-006: Fluxo de imagem principal extraído para `apps/api/src/modules/catalog/product-images.ts`.
- REQ-CAT-SVC-007: Autorização administrativa centralizada em `apps/api/src/modules/auth/auth-context.ts`.
- REQ-CAT-SVC-008: Cobertura existente preservada; nenhuma regra ficou descoberta a ponto de exigir novo teste nesta refatoração.

Validação final executada nas fatias: `npm run typecheck`, `npm test`, `npm run build`.
