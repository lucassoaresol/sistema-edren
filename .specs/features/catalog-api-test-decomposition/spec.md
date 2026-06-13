# Spec de Decomposição dos Testes de API de Catálogo

**Situação:** Planejada.
**Rastreabilidade:** Revisão de tamanho de arquivos; sequência da spec `catalog-api-service-layer`; concern técnico sobre `apps/api/src/modules/catalog/routes.test.ts`.

## Propósito

Reduzir o custo de manutenção dos testes de catálogo antes de estoque e vendas passarem a depender de produtos, SKUs, coleções e imagens.

## Problema Atual

- `apps/api/src/modules/catalog/routes.test.ts` possui 470 linhas.
- O arquivo concentra bootstrap de usuários, cleanup, fixtures, payload multipart e cenários de coleções, produtos, SKUs e imagem principal.
- Novos testes de catálogo tendem a aumentar o arquivo e dificultar localizar regressões por domínio.

## Requisitos

- REQ-CAT-TEST-001: Testes existentes de catálogo devem manter o mesmo comportamento e cobertura.
- REQ-CAT-TEST-002: Helpers de criação de usuário/login, fixtures de catálogo, cleanup e payload multipart devem sair do arquivo principal quando isso reduzir ruído.
- REQ-CAT-TEST-003: A separação deve preservar isolamento entre testes e limpeza dos dados criados.
- REQ-CAT-TEST-004: Suites devem ficar organizadas por fronteiras naturais: autenticação/autorização de catálogo, coleções, produtos, SKUs e imagens.
- REQ-CAT-TEST-005: A decomposição não deve introduzir abstrações genéricas para testes de outros módulos antes de uso real.

## Fora de Escopo

- Alterar contratos HTTP de catálogo.
- Adicionar novos comportamentos de catálogo.
- Trocar Vitest ou a estratégia de `app.inject`.
- Criar factories globais para todo o backend.

## Critérios de Aceite

- `routes.test.ts` fica menor e mais focado em cenários/asserts.
- Helpers extraídos possuem nomes explícitos e ficam próximos do módulo de catálogo ou em área de teste local.
- Testes de catálogo continuam passando integralmente.
- A leitura de um teste individual não exige navegar por uma cadeia longa de abstrações.

## Validação

- `npm run typecheck`
- `npm test`
- `npm run build`
- Testes de API de catálogo continuam passando.
