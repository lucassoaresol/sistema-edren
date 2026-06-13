# Spec de Padrões Compartilhados de Frontend e API Client

**Situação:** Planejada.
**Rastreabilidade:** Roadmap `Shared Frontend API Patterns`; concerns sobre `apps/web/src/lib/api.ts`, `products.tsx` e `settings.tsx`.

## Propósito

Preparar o frontend para crescer com estoque, vendas, pagamentos e relatórios sem transformar o cliente de API e as páginas em arquivos centrais difíceis de manter.

## Problema Atual

- `apps/web/src/lib/api.ts` possui 418 linhas e reúne tipos, request base, endpoints de autenticação, configurações, catálogo, filtros e upload.
- `products.tsx` e `settings.tsx` repetem padrões de `useMutation`, `toast`, query state, selects e invalidação.
- Erros da API são convertidos em `Error` genérico por status HTTP, o que limita mensagens específicas na UI.

## Requisitos

- REQ-FE-API-001: Tipos e funções de API devem ser separados por domínio quando houver crescimento: auth, config, catalog e futuros módulos.
- REQ-FE-API-002: O request base deve continuar centralizado para credenciais, headers e tratamento de erro.
- REQ-FE-API-003: Query keys reutilizadas devem ser nomeadas em um local claro por domínio.
- REQ-FE-API-004: Componentes simples de formulário, select e estado de carregamento/erro devem ser reaproveitados quando aparecerem em mais de uma tela.
- REQ-FE-API-005: A UI deve conseguir exibir mensagem de erro retornada pela API quando houver payload estruturado.
- REQ-FE-API-006: A separação não deve criar uma abstração genérica pesada antes de haver uso real.
- REQ-FE-API-007: O padrão definido deve ser aplicado primeiro em config/produtos antes de estoque e vendas serem implementados.

## Fora de Escopo

- Introduzir geração automática de cliente OpenAPI.
- Trocar TanStack Query, TanStack Router ou biblioteca de toast.
- Refatorar visual completo das páginas.
- Criar design system extenso.

## Critérios de Aceite

- `apps/web/src/lib/api.ts` deixa de ser o único arquivo para todos os domínios.
- Novos módulos têm um caminho óbvio para adicionar tipos, endpoints e query keys.
- Padrões reaproveitados reduzem duplicação sem esconder lógica de negócio importante.
- Mensagens de erro da API podem aparecer de forma mais específica nas telas principais.

## Validação

- `npm run typecheck`
- `npm test`
- `npm run build`
- Checagem manual de login, configurações e produtos.
