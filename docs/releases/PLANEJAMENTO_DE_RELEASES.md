# Planejamento de Releases EDREN

Este documento define os momentos ideais de release do Sistema EDREN a partir das specs existentes, das decisões operacionais e do estado atual do MVP.

O objetivo é manter entregas pequenas, testáveis e com valor operacional claro para a EDREN, evitando uma única entrega grande e arriscada.

## Princípios

- Release deve representar uma fatia utilizável ou uma base técnica necessária para a próxima fatia.
- Cada release deve ter spec atualizada antes do corte quando alterar comportamento de produto.
- Toda release publicada deve aparecer no `CHANGELOG.md` e como GitHub Release, não apenas como tag Git.
- O README deve apontar para a documentação operacional mais atual.
- Banco de dados e seeds devem ser tratados como parte do release, não como detalhe separado.
- Funcionalidades futuras podem estar modeladas, mas não devem aparecer como compromisso de uso se ainda não estiverem prontas.
- O guia de deploy de produção deve ser revisado a cada release para refletir versão, ordem de execução, migrações, seeds, variáveis e validações reais.

## Estratégia de Versão

Enquanto o sistema estiver em MVP, usar `0.x.y`:

- `0.1.x`: fundação técnica, autenticação, deploy e cadastros estruturantes.
- `0.2.x`: catálogo operacional, incluindo coleções, produtos e SKUs.
- `0.3.x`: estoque inicial e movimentações essenciais.
- `0.4.x`: clientes, vendas, pagamentos e contas a receber básicas.
- `0.5.x`: painel inicial, relatórios mínimos e refinamentos de operação diária.
- `1.0.0`: MVP validado em uso real, com fluxo principal completo e documentação operacional fechada.

Usar patch (`0.1.2`, `0.2.1`) para correções, ajustes pequenos, melhorias de deploy, mensagens, validações ou refinamentos sem novo marco funcional.

## Releases Recomendadas

### v0.1.x - Base Operacional do MVP

Estado atual: em andamento/implementada em partes.

Escopo ideal:

- Monorepo, API, frontend, banco, seeds e health checks.
- Autenticação por sessão.
- Bootstrap seguro de administrador.
- Login com usuário e senha, sem email no MVP.
- Cadastros configuráveis: grades, tamanhos, categorias, cores, locais de estoque, canais de venda e formas de pagamento.
- Deploy de produção documentado.
- README, changelog e planejamento de releases.

Critério de corte:

- `npm run check` passa.
- `npm test` passa.
- Login, logout e `/configuracoes` validados manualmente em desktop e mobile.
- `GET /api/health` e `GET /api/health/db` funcionam em produção.
- `CHANGELOG.md` atualizado.

### v0.2.0 - Catálogo e Produtos

Momento ideal de release: quando a EDREN conseguir cadastrar a estrutura comercial das peças antes do estoque.

Escopo sugerido:

- Coleções.
- Produtos/referências.
- Vínculo com categoria e grade de tamanho.
- SKUs por cor e tamanho.
- Preço e custo por produto.
- Produto sem foto permitido.
- Validação de referência única.

Fora do corte:

- Controle de saldo.
- Vendas.
- Importação por planilha.
- Ficha técnica completa.

Critério de corte:

- Spec de catálogo criada ou atualizada.
- Testes de API para duplicidade, criação e edição.
- Fluxo manual de criar coleção, produto e SKUs validado.
- Migrações aplicadas em ambiente de teste antes da produção.

### v0.3.0 - Estoque Essencial

Momento ideal de release: depois que produtos/SKUs estiverem estáveis e antes de iniciar vendas.

Escopo sugerido:

- Saldo por SKU e local.
- Entrada inicial manual.
- Movimentações básicas de estoque.
- Transferência entre locais reais.
- Histórico mínimo de movimentações.

Fora do corte:

- Condicional completo.
- Sacoleiras/revendedoras completo.
- Importação por planilha.
- Rastreamento unitário por peça.

Critério de corte:

- Spec de estoque criada ou atualizada.
- Testes para impedir saldo inválido quando aplicável.
- Conferência manual com cenários de fábrica e Casa EDREN.
- Relatório/listagem simples de saldo por local validado.

### v0.4.0 - Vendas, Pagamentos e Recebíveis Básicos

Momento ideal de release: quando catálogo e estoque já estiverem prontos para registrar saídas reais.

Escopo sugerido:

- Clientes.
- Vendas simples.
- Itens de venda vinculados a SKU.
- Baixa de estoque pela venda.
- Formas de pagamento configuráveis.
- Contas a receber básicas.
- Cancelamento ou estorno simples, se indispensável para operação segura.

Fora do corte:

- Comissões.
- Metas.
- Dashboard avançado.
- Trocas/devoluções detalhadas.
- Integração fiscal ou gateway de pagamento.

Critério de corte:

- Spec de vendas/pagamentos criada ou atualizada.
- Testes cobrindo venda, baixa de estoque e recebíveis.
- Validação manual de venda com pagamento à vista e a prazo.
- Plano de rollback ou correção definido para erro em saldo/recebível.

### v0.5.0 - Operação Diária e Relatórios Mínimos

Momento ideal de release: depois que os fluxos principais gerarem dados reais suficientes para consulta.

Escopo sugerido:

- Painel inicial simples.
- Relatórios mínimos de estoque, vendas e contas a receber.
- Filtros essenciais.
- Melhorias de usabilidade observadas na operação real.
- Ajustes de performance e paginação onde o volume exigir.

Fora do corte:

- BI avançado.
- Exportações complexas.
- Automações.

Critério de corte:

- Consultas validadas com dados reais ou massa representativa.
- Permissões revisadas por perfil.
- Feedback operacional da EDREN incorporado ou registrado como pendência.

### v1.0.0 - MVP Validado

Momento ideal de release: quando a EDREN puder operar o ciclo principal sem depender dos controles antigos para a mesma informação.

Escopo esperado:

- Fluxo de produto, SKU, estoque, cliente, venda, pagamento e recebível funcionando de ponta a ponta.
- Deploy de produção repetível.
- Rotina de backup definida.
- Documentação de operação mínima.
- Changelog consolidado.
- Pendências futuras separadas do escopo do MVP.

Critério de corte:

- UAT com usuários reais.
- Defeitos críticos zerados.
- Validação de backup/restauração ou procedimento operacional aprovado.
- Documentos de deploy, README e changelog atualizados.

## Checklist Para Cortar Uma Release

### Antes da tag

- Revisar specs afetadas em `.specs/features` ou registrar explicitamente quando não houver spec formal para a fatia.
- Confirmar se há migrações Prisma, seeds ou alterações de variáveis de ambiente e se a ordem de deploy está clara.
- Revisar se a release exige atualização de documentação operacional, principalmente `docs/deploy/PRODUCAO.md`, README, `.env.example` e guias de backup/restauração.
- Rodar `npm run typecheck`.
- Rodar `npm test`.
- Rodar `npm run build` ou `npm run check`.
- Validar telas principais em desktop e mobile quando houver UI.
- Atualizar `CHANGELOG.md` com data, escopo, validações e riscos conhecidos.
- Garantir que o guia de produção cite a versão correta que será publicada.

### Publicação da release

- Criar tag Git somente depois da validação final.
- Enviar a tag para o GitHub.
- Criar GitHub Release a partir da tag, usando o conteúdo do `CHANGELOG.md` como base.
- Conferir no GitHub se a release ficou publicada com versão, data, notas e riscos conhecidos.
- Publicar em produção seguindo `docs/deploy/PRODUCAO.md`.

### Depois do deploy

- Validar health checks e fluxo principal em produção.
- Conferir logs do PM2 e erros visíveis no navegador.
- Confirmar que a versão documentada, a tag publicada e o código em produção são a mesma release.
- Registrar no `CHANGELOG.md` ou em documento operacional qualquer pendência aceita, desvio do plano, correção manual ou aprendizado do deploy.

## Critérios para Adiar uma Release

Adiar o corte se algum destes pontos acontecer:

- Migração de banco sem validação em ambiente seguro.
- Fluxo principal da release quebrado.
- Falta de teste em comportamento crítico de dados.
- UI essencial inutilizável em mobile para rotina operacional.
- Falta de clareza sobre rollback/correção em caso de erro de dados.
- Spec divergente do comportamento implementado.
- Guia de deploy de produção desatualizado para a versão que seria publicada.
- Release ainda não criada no GitHub quando a intenção for publicar uma versão rastreável.

## Relação com Changelog

O `CHANGELOG.md` deve registrar o que mudou para cada versão publicada ou planejada imediatamente antes do corte.

Formato recomendado por release:

- `Adicionado`: novas capacidades.
- `Alterado`: mudanças de comportamento.
- `Corrigido`: bugs resolvidos.
- `Documentação`: specs, deploy, README e guias.
- `Validação`: comandos e checks executados.
- `Riscos conhecidos`: pendências aceitas para a próxima versão.

## Pontos de Melhoria do Projeto

- Criar specs antes das próximas fatias funcionais, em vez de recuperar retroativamente.
- Manter um índice de specs quando a quantidade de features crescer.
- Planejar a feature de gestão de usuários, sem spec criada ainda.
- Definir uma rotina de backup/restauração antes de operar vendas reais.
- Documentar variáveis de ambiente obrigatórias em um `.env.example` quando a configuração estabilizar.
- Registrar decisões técnicas novas em `docs/context` ou em docs específicas por área.
- Adicionar um checklist de UAT por release funcional a partir de `v0.2.0`.
- Considerar changelog por release mesmo sem deploy imediato, pois o sistema é interno e precisa de rastreabilidade operacional.
- Tratar tag Git e GitHub Release como passos diferentes: tag versiona o código, GitHub Release comunica a entrega.
- Revisar documentação de deploy antes de criar a tag, não apenas depois de tentar publicar.
- Registrar aprendizados de release logo após o processo, enquanto comandos executados, validações e pendências ainda estão claros.

## Features Previstas Sem Spec

### Gestão de Usuários

Objetivo: permitir que administradores gerenciem o acesso ao sistema sem depender de scripts manuais após o bootstrap inicial.

Escopo previsto:

- Listar usuários do sistema.
- Criar usuários com nome, usuário de login, senha inicial, perfil e status ativo.
- Editar nome, usuário de login e perfil.
- Ativar e inativar usuários.
- Redefinir senha de usuários.
- Impedir exclusão física de usuários, preservando rastreabilidade.
- Bloquear login de usuários inativos.

Fora do escopo inicial:

- Login por email.
- Recuperação automática de senha por email.
- Permissões customizadas por usuário.
- Auditoria visual detalhada de alterações.
