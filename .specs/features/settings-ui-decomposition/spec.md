# Spec de Decomposição da UI de Configurações

**Situação:** Planejada.
**Rastreabilidade:** Revisão de tamanho de arquivos; concern técnico sobre `apps/web/src/components/settings/size-grids-card.tsx` e padrões de `settings.tsx`.

## Propósito

Reduzir o custo de manutenção da tela de configurações, especialmente a gestão de grades e tamanhos, antes de novos cadastros e permissões expandirem o módulo.

## Problema Atual

- `apps/web/src/components/settings/size-grids-card.tsx` possui 293 linhas.
- O componente mistura listagem de grades, criação/edição, gestão de tamanhos, estados de formulário, mutations, invalidação e renderização de itens.
- Padrões parecidos aparecem em outros cards de configuração e podem divergir com novas mudanças.

## Requisitos

- REQ-SETTINGS-UI-001: A tela `/configuracoes` deve manter o comportamento atual para categorias, cores, grades e tamanhos.
- REQ-SETTINGS-UI-002: `size-grids-card.tsx` deve ser decomposto por responsabilidades naturais: card principal, formulário de grade, lista de tamanhos e formulário/ações de tamanho.
- REQ-SETTINGS-UI-003: Estados de mutation, loading, erro e invalidação devem continuar claros e previsíveis.
- REQ-SETTINGS-UI-004: Componentes reutilizáveis só devem ser extraídos quando houver uso real em mais de um ponto ou redução clara de ruído.
- REQ-SETTINGS-UI-005: A decomposição não deve alterar textos visíveis, contrato de API, query keys ou permissões.

## Fora de Escopo

- Redesenhar visualmente a tela.
- Alterar endpoints de configuração.
- Criar novos cadastros.
- Implementar autorização modular no frontend.

## Critérios de Aceite

- `size-grids-card.tsx` fica menor e mais focado na composição de subcomponentes.
- Subcomponentes têm nomes claros e ficam em `apps/web/src/components/settings`.
- A gestão de grades e tamanhos continua funcionando em desktop e mobile.
- Não há duplicação desnecessária de mutations e query invalidation.

## Validação

- `npm run typecheck`
- `npm test`
- `npm run build`
- Checagem manual de `/configuracoes` em desktop e mobile.
- Checagem manual de criação/edição de grade e criação de tamanhos.
