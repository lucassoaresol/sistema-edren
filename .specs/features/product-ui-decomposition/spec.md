# Spec de Decomposição da UI de Produtos

**Situação:** Implementada em 2026-06-13.
**Rastreabilidade:** Roadmap `Product UI Decomposition`; concern técnico sobre `apps/web/src/routes/products.tsx`; feature `products-and-collections` já implementada.

## Propósito

Reduzir o risco de manutenção da tela de produtos antes de estoque e vendas dependerem intensamente de produtos, SKUs e imagens.

## Problema Atual

- `apps/web/src/routes/products.tsx` possui 774 linhas.
- O arquivo mistura rota principal, detalhe de produto, painel de coleções, formulário de produto, lista de produtos, gestão de SKUs, upload de imagem, componentes genéricos e utilitários de data.
- Mudanças pequenas em catálogo exigem navegar por muitas responsabilidades no mesmo arquivo.

## Requisitos

- REQ-PUI-001: A rota `/products` deve manter o comportamento atual de listagem, filtro, cadastro/edição de produto e painel de coleções.
- REQ-PUI-002: A rota `/products/:productId` deve manter detalhe, imagem principal e gestão de SKUs.
- REQ-PUI-003: Componentes de coleção devem sair do arquivo de rota para um arquivo de domínio próprio.
- REQ-PUI-004: Componentes de formulário/lista de produto devem sair do arquivo de rota para arquivos próprios.
- REQ-PUI-005: Componentes de detalhe, imagem e SKUs devem sair do arquivo de rota para arquivos próprios.
- REQ-PUI-006: Utilitários de data e regra visual de coleção vigente devem ficar isolados em helper pequeno, com nome explícito.
- REQ-PUI-007: A decomposição não deve alterar contrato de API, query keys, permissões ou textos visíveis sem necessidade funcional.
- REQ-PUI-008: O arquivo de rota deve ficar focado em orquestração de queries, filtros, navegação e composição de componentes.

## Fora de Escopo

- Redesenhar visualmente a tela.
- Alterar endpoints de catálogo.
- Criar novos fluxos de estoque, venda ou relatório.
- Trocar biblioteca de formulário ou de estado.

## Critérios de Aceite

- `products.tsx` fica substancialmente menor e sem componentes internos extensos de formulário/lista/detalhe.
- Nenhum comportamento existente de catálogo é removido.
- Imports e nomes deixam claro onde ficam coleções, produtos, SKUs e imagem.
- Validações manuais existentes da spec `products-and-collections` continuam válidas.

## Validação

- `npm run typecheck`
- `npm test`
- `npm run build`
- Checagem manual de `/products` em desktop e mobile.
- Checagem manual de `/products/:productId` em desktop e mobile.

Validação executada em 2026-06-13:

- `npm run typecheck`: passou.
- `npm test`: passou, 4 arquivos e 26 testes.
- `npm run build`: passou.
