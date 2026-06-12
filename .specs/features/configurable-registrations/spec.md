# Spec de Cadastros Configuráveis

**Situação:** Implementada.
**Rastreabilidade:** Roadmap `Configurable Registrations` em Operações do MVP; implementação de API, banco, testes e tela `/configuracoes`.

## Propósito

Permitir que administradores mantenham os cadastros operacionais usados pelas próximas features do MVP, evitando valores fixos no código e preparando produtos, estoque, vendas e pagamentos para uso real pela EDREN.

## Escopo

Esta feature cobre os cadastros configuráveis que já existem no schema e nos seeds iniciais:

- grades de tamanho;
- tamanhos dentro de uma grade;
- categorias de produto;
- cores;
- locais de estoque;
- canais de venda;
- formas de pagamento.

## Requisitos

- REQ-CONFIG-001: O sistema deve listar, criar, editar e ativar/inativar grades de tamanho.
- REQ-CONFIG-002: O sistema deve listar, criar, editar e ativar/inativar tamanhos vinculados a uma grade de tamanho.
- REQ-CONFIG-003: Tamanhos devem ter ordem de exibição (`sortOrder`) para manter grades como `P`, `M`, `G`, `GG` na sequência correta.
- REQ-CONFIG-004: O sistema deve impedir nomes duplicados de grade de tamanho.
- REQ-CONFIG-005: O sistema deve impedir tamanhos duplicados dentro da mesma grade.
- REQ-CONFIG-006: O sistema deve listar, criar, editar e ativar/inativar categorias de produto.
- REQ-CONFIG-007: O sistema deve impedir nomes duplicados de categoria.
- REQ-CONFIG-008: O sistema deve listar, criar, editar e ativar/inativar cores.
- REQ-CONFIG-009: O sistema deve impedir nomes duplicados de cor e preservar o `slug` único quando informado ou derivado.
- REQ-CONFIG-010: O sistema deve listar, criar e editar locais de estoque.
- REQ-CONFIG-011: Locais de estoque devem ser ativados ou inativados conforme uso operacional real.
- REQ-CONFIG-012: O sistema deve impedir nomes duplicados de local de estoque.
- REQ-CONFIG-013: O sistema deve listar, criar e editar canais de venda.
- REQ-CONFIG-014: Canais de venda devem ser ativados ou inativados conforme uso operacional real.
- REQ-CONFIG-015: O sistema deve impedir nomes duplicados de canal de venda.
- REQ-CONFIG-016: O sistema deve listar, criar, editar e ativar/inativar formas de pagamento.
- REQ-CONFIG-017: O sistema deve impedir nomes duplicados de forma de pagamento.
- REQ-CONFIG-018: Cadastros com relações ou histórico operacional não devem ser excluídos fisicamente no MVP; devem ser inativados ou movidos para status apropriado.
- REQ-CONFIG-019: A API deve proteger as rotas de escrita desses cadastros para usuários autenticados com perfil `ADMIN`.
- REQ-CONFIG-020: A leitura desses cadastros deve estar disponível para usuários autenticados, pois produtos, estoque e vendas dependerão dessas listas.
- REQ-CONFIG-021: A tela de configurações deve permitir gerenciar esses cadastros de forma responsiva em desktop e mobile.
- REQ-CONFIG-022: A UI deve usar textos em português e manter a identidade visual clara da EDREN.
- REQ-CONFIG-023: Erros de duplicidade, campos obrigatórios e permissão insuficiente devem retornar mensagens claras para a UI.

## Regras de Negócio

- Cadastros configuráveis são dados operacionais, não constantes de código.
- Seeds iniciais continuam existindo para iniciar o sistema com valores úteis.
- Registros usados por produtos, SKUs, estoque, vendas ou pagamentos não devem ser apagados fisicamente.
- Locais de estoque e canais de venda não devem representar itens futuros no MVP; se ainda não existem operacionalmente, não devem ser cadastrados.
- Quando um novo local ou canal passar a existir, ele deve ser criado como ativo.
- Categorias, cores, grades, tamanhos e formas de pagamento usam `isActive` porque precisam apenas sair ou voltar das listas de uso diário.
- Tamanhos pertencem a uma grade; não existe tamanho solto.
- Um mesmo nome de tamanho pode existir em grades diferentes, mas não duplicado dentro da mesma grade.
- Listas usadas em cadastros futuros devem priorizar registros ativos; telas administrativas devem mostrar também inativos/futuros para manutenção.

## API Esperada

As rotas devem ficar sob `/api/config` ou namespace equivalente de configurações, seguindo o padrão modular da API.

- `GET /api/config/size-grids`
- `POST /api/config/size-grids`
- `PATCH /api/config/size-grids/:id`
- `GET /api/config/size-grids/:id/sizes`
- `POST /api/config/size-grids/:id/sizes`
- `PATCH /api/config/sizes/:id`
- `GET /api/config/categories`
- `POST /api/config/categories`
- `PATCH /api/config/categories/:id`
- `GET /api/config/colors`
- `POST /api/config/colors`
- `PATCH /api/config/colors/:id`
- `GET /api/config/stock-locations`
- `POST /api/config/stock-locations`
- `PATCH /api/config/stock-locations/:id`
- `GET /api/config/sales-channels`
- `POST /api/config/sales-channels`
- `PATCH /api/config/sales-channels/:id`
- `GET /api/config/payment-methods`
- `POST /api/config/payment-methods`
- `PATCH /api/config/payment-methods/:id`

## UI Esperada

- A rota `/configuracoes` deve deixar de ser placeholder para esta fatia.
- A tela deve agrupar os cadastros por área: produtos, estoque e vendas/pagamentos.
- Cada cadastro deve permitir visualizar registros existentes, criar novo registro e editar nome, descrição e status/ativo conforme aplicável.
- Tamanhos devem ser gerenciados dentro da grade selecionada.
- A interface deve deixar claro quando um registro está inativo.
- Ações administrativas devem ser bloqueadas para perfis sem permissão, mesmo que a UI esconda botões.

## Fora de Escopo

- CRUD de coleções, produtos, SKUs, clientes, vendas, estoque e relatórios.
- Upload de imagens.
- Exclusão física de cadastros.
- Auditoria detalhada de alterações.
- Permissões customizadas por usuário.
- Importação por planilha.
- Paginação, busca e filtros avançados nos cadastros configuráveis; a UI atual usa abas e carregamento por aba, suficiente para o MVP inicial.
- Cadastro configurável de motivos de movimentação ou cancelamento; motivos de estoque podem ser tratados em uma fatia própria de estoque.

## Validação

- Testes de API cobrindo listagem, criação, edição, duplicidade e permissão de escrita.
- `npm run typecheck`
- `npm run test`
- `npm run build`
- Checagem manual da tela `/configuracoes` em desktop e mobile.

## Observações

- Esta feature é pré-requisito prático para produtos/SKUs, estoque, vendas e pagamentos.
- A implementação removeu o conceito `FUTURE` dos cadastros configuráveis do MVP e simplificou locais de estoque/canais de venda para ativo/inativo.
- A UI inicial usa abas com carregamento sob demanda por cadastro, permite criar, editar e ativar/inativar registros e foi validada manualmente.
- Quando o volume de dados crescer, evoluir a API e UI de configurações com paginação, busca textual, filtros por status e ordenação configurável.
