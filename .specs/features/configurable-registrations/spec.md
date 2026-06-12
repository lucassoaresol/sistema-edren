# Spec de Cadastros Configuraveis

**Situacao:** Implementada.
**Rastreabilidade:** Roadmap `Configurable Registrations` em Operacoes do MVP; implementacao de API, banco, testes e tela `/configuracoes`.

## Proposito

Permitir que administradores mantenham os cadastros operacionais usados pelas proximas features do MVP, evitando valores fixos no codigo e preparando produtos, estoque, vendas e pagamentos para uso real pela EDREN.

## Escopo

Esta feature cobre os cadastros configuraveis que ja existem no schema e nos seeds iniciais:

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
- REQ-CONFIG-003: Tamanhos devem ter ordem de exibicao (`sortOrder`) para manter grades como `P`, `M`, `G`, `GG` na sequencia correta.
- REQ-CONFIG-004: O sistema deve impedir nomes duplicados de grade de tamanho.
- REQ-CONFIG-005: O sistema deve impedir tamanhos duplicados dentro da mesma grade.
- REQ-CONFIG-006: O sistema deve listar, criar, editar e ativar/inativar categorias de produto.
- REQ-CONFIG-007: O sistema deve impedir nomes duplicados de categoria.
- REQ-CONFIG-008: O sistema deve listar, criar, editar e ativar/inativar cores.
- REQ-CONFIG-009: O sistema deve impedir nomes duplicados de cor e preservar o `slug` unico quando informado ou derivado.
- REQ-CONFIG-010: O sistema deve listar, criar e editar locais de estoque.
- REQ-CONFIG-011: Locais de estoque devem ser ativados ou inativados conforme uso operacional real.
- REQ-CONFIG-012: O sistema deve impedir nomes duplicados de local de estoque.
- REQ-CONFIG-013: O sistema deve listar, criar e editar canais de venda.
- REQ-CONFIG-014: Canais de venda devem ser ativados ou inativados conforme uso operacional real.
- REQ-CONFIG-015: O sistema deve impedir nomes duplicados de canal de venda.
- REQ-CONFIG-016: O sistema deve listar, criar, editar e ativar/inativar formas de pagamento.
- REQ-CONFIG-017: O sistema deve impedir nomes duplicados de forma de pagamento.
- REQ-CONFIG-018: Cadastros com relacoes ou historico operacional nao devem ser excluidos fisicamente no MVP; devem ser inativados ou movidos para status apropriado.
- REQ-CONFIG-019: A API deve proteger as rotas de escrita desses cadastros para usuarios autenticados com perfil `ADMIN`.
- REQ-CONFIG-020: A leitura desses cadastros deve estar disponivel para usuarios autenticados, pois produtos, estoque e vendas dependerao dessas listas.
- REQ-CONFIG-021: A tela de configuracoes deve permitir gerenciar esses cadastros de forma responsiva em desktop e mobile.
- REQ-CONFIG-022: A UI deve usar textos em portugues e manter a identidade visual clara da EDREN.
- REQ-CONFIG-023: Erros de duplicidade, campos obrigatorios e permissao insuficiente devem retornar mensagens claras para a UI.

## Regras De Negocio

- Cadastros configuraveis sao dados operacionais, nao constantes de codigo.
- Seeds iniciais continuam existindo para iniciar o sistema com valores uteis.
- Registros usados por produtos, SKUs, estoque, vendas ou pagamentos nao devem ser apagados fisicamente.
- Locais de estoque e canais de venda nao devem representar itens futuros no MVP; se ainda nao existem operacionalmente, nao devem ser cadastrados.
- Quando um novo local ou canal passar a existir, ele deve ser criado como ativo.
- Categorias, cores, grades, tamanhos e formas de pagamento usam `isActive` porque precisam apenas sair ou voltar das listas de uso diario.
- Tamanhos pertencem a uma grade; nao existe tamanho solto.
- Um mesmo nome de tamanho pode existir em grades diferentes, mas nao duplicado dentro da mesma grade.
- Listas usadas em cadastros futuros devem priorizar registros ativos; telas administrativas devem mostrar tambem inativos/futuros para manutencao.

## API Esperada

As rotas devem ficar sob `/api/config` ou namespace equivalente de configuracoes, seguindo o padrao modular da API.

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
- A tela deve agrupar os cadastros por area: produtos, estoque e vendas/pagamentos.
- Cada cadastro deve permitir visualizar registros existentes, criar novo registro e editar nome, descricao e status/ativo conforme aplicavel.
- Tamanhos devem ser gerenciados dentro da grade selecionada.
- A interface deve deixar claro quando um registro esta inativo.
- Acoes administrativas devem ser bloqueadas para perfis sem permissao, mesmo que a UI esconda botoes.

## Fora De Escopo

- CRUD de colecoes, produtos, SKUs, clientes, vendas, estoque e relatorios.
- Upload de imagens.
- Exclusao fisica de cadastros.
- Auditoria detalhada de alteracoes.
- Permissoes customizadas por usuario.
- Importacao por planilha.
- Paginacao, busca e filtros avancados nos cadastros configuraveis; a UI atual usa abas e carregamento por aba, suficiente para o MVP inicial.
- Cadastro configuravel de motivos de movimentacao ou cancelamento; motivos de estoque podem ser tratados em uma fatia propria de estoque.

## Validacao

- Testes de API cobrindo listagem, criacao, edicao, duplicidade e permissao de escrita.
- `npm run typecheck`
- `npm run test`
- `npm run build`
- Checagem manual da tela `/configuracoes` em desktop e mobile.

## Observacoes

- Esta feature e pre-requisito pratico para produtos/SKUs, estoque, vendas e pagamentos.
- A implementacao removeu o conceito `FUTURE` dos cadastros configuraveis do MVP e simplificou locais de estoque/canais de venda para ativo/inativo.
- A UI inicial usa abas com carregamento sob demanda por cadastro, permite criar, editar e ativar/inativar registros e foi validada manualmente.
- Quando o volume de dados crescer, evoluir a API e UI de configuracoes com paginacao, busca textual, filtros por status e ordenacao configuravel.
