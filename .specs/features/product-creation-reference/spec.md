# Spec de Referência em Criação e Caderno de Produtos

**Situação:** Planejada.
**Rastreabilidade:** `docs/context/CADERNO_PRODUTOS_EDREN.md`; apresentação do cadastro de produtos; spec `products-and-collections` já implementada.

## Propósito

Permitir que a EDREN registre o nascimento de uma peça no sistema de forma mais rápida e organizada do que no caderno físico, preservando croqui, materiais, custos e observações antes de a referência virar um produto comercial completo.

## Contexto Operacional

Hoje a EDREN usa um caderno físico para registrar o desenvolvimento das peças. A página do caderno reúne referência, croqui/desenho, tecido, metragem, forro, zíper, botões, alça, costura, mão de obra, plaquinha, tag, cálculo de custo e observações.

Esse registro não representa apenas um produto pronto para venda. Ele representa o raciocínio de criação da peça: desenho, materiais, serviços, acabamento e custo de produção.

A tela atual de produtos atende melhor o momento comercial, quando já existem nome final, preço, coleção, categoria, grade, SKUs, estoque e fotos prontas. Esta feature cobre a etapa anterior ou complementar: a referência ainda em criação.

## Escopo

Esta feature cobre:

- criação rápida de uma referência com dados mínimos;
- registro de croqui ou foto do desenho da peça;
- diferenciação entre croqui, foto do produto pronto, foto na modelo e foto de detalhe;
- registro simples de materiais, aviamentos, serviços, acabamentos e custos;
- cálculo automático do custo total a partir dos itens informados;
- salvamento de referência incompleta para preenchimento gradual;
- evolução da referência de criação para produto comercial quando estiver pronta;
- reaproveitamento ou sugestão de itens/custos comuns quando viável sem deixar o fluxo pesado.

## Requisitos

- REQ-PCR-001: O sistema deve permitir criar uma referência em criação com o mínimo de campos obrigatórios possível.
- REQ-PCR-002: A referência em criação deve poder ser salva mesmo sem foto do produto pronto, nome comercial final, grade completa, estoque ou material de venda.
- REQ-PCR-003: O sistema deve permitir anexar um croqui ou foto do desenho da peça durante a etapa de criação.
- REQ-PCR-004: O sistema deve diferenciar semanticamente croqui/desenho, foto do produto pronto, foto na modelo e foto de detalhe.
- REQ-PCR-005: O sistema não deve tratar todas as imagens apenas como uma única imagem principal quando isso apagar a diferença operacional entre criação e venda.
- REQ-PCR-006: A referência em criação deve aceitar observações livres sobre modelagem, acabamento, tecido, ajustes e decisões da peça.
- REQ-PCR-007: O sistema deve permitir registrar itens de custo da peça, incluindo materiais, aviamentos, serviços e acabamentos.
- REQ-PCR-008: Cada item de custo deve permitir descrever o item, informar quantidade ou metragem quando aplicável, valor unitário quando aplicável e valor total.
- REQ-PCR-009: O sistema deve calcular automaticamente o custo total da referência a partir dos itens informados.
- REQ-PCR-010: O sistema deve permitir editar ou completar custos depois da criação inicial.
- REQ-PCR-011: O sistema deve permitir que informações sejam preenchidas gradualmente, sem bloquear o fluxo por falta de dados comerciais ainda inexistentes.
- REQ-PCR-012: O sistema deve evitar transformar o caderno em uma tela pesada de muitos campos obrigatórios.
- REQ-PCR-013: O sistema deve permitir associar a referência em criação a um produto comercial quando a peça estiver aprovada e pronta para venda.
- REQ-PCR-014: A evolução para produto comercial deve preservar o histórico de criação, croqui, custos e observações relevantes.
- REQ-PCR-015: O sistema deve deixar claro o estado da referência, distinguindo criação/desenvolvimento de produto comercial pronto.
- REQ-PCR-016: O custo calculado na criação deve poder servir de base para o custo do produto comercial, sem exigir redigitação desnecessária.
- REQ-PCR-017: A UI deve priorizar rapidez de cadastro, baixa digitação e clareza visual.
- REQ-PCR-018: A UI deve funcionar de forma responsiva em desktop e mobile.
- REQ-PCR-019: Criação, edição de custos e imagens de criação devem ser restritas a usuários autenticados com perfil `ADMIN`.
- REQ-PCR-020: Erros de campos obrigatórios mínimos, upload de imagem, permissões e relações inválidas devem retornar mensagens claras para a UI.

## Regras de Negócio

- Na EDREN, a peça nasce na confecção antes de virar produto comercial.
- O croqui pertence ao momento de criação e desenvolvimento.
- A foto do produto pronto pertence a outro momento, quando a peça já está costurada, aprovada e pronta para venda, divulgação ou catálogo.
- A referência em criação pode existir incompleta.
- Produto comercial representa a referência pronta para venda e integração com coleção, SKUs, estoque, vendas e relatórios.
- O sistema deve acompanhar o nascimento da peça, não apenas cadastrar a peça depois de pronta.
- O processo digital deve ser mais rápido e organizado do que o caderno físico.
- O cálculo de custo deve reduzir contas manuais, não criar uma etapa burocrática maior.
- Itens comuns de custo podem ser reaproveitados ou sugeridos, desde que isso não atrase o cadastro simples.

## API Esperada

As rotas devem seguir o padrão modular da API. A definição final do namespace deve ser decidida no design, considerando se a referência em criação será extensão de produto ou recurso anterior ao produto comercial.

Rotas candidatas:

- `GET /api/product-references`
- `POST /api/product-references`
- `GET /api/product-references/:id`
- `PATCH /api/product-references/:id`
- `POST /api/product-references/:id/images`
- `DELETE /api/product-reference-images/:id`
- `GET /api/product-references/:id/cost-items`
- `POST /api/product-references/:id/cost-items`
- `PATCH /api/product-reference-cost-items/:id`
- `DELETE /api/product-reference-cost-items/:id`
- `POST /api/product-references/:id/promote-to-product`

## UI Esperada

- A UI deve permitir iniciar uma nova referência rapidamente, com poucos campos obrigatórios.
- A tela deve separar visualmente dados de criação, imagens de criação, custos e dados comerciais.
- A tela deve permitir anexar e visualizar croqui sem exigir foto do produto pronto.
- A UI deve exibir o custo total calculado conforme os itens de custo forem informados.
- A UI deve permitir salvar e voltar depois para completar informações.
- A UI deve deixar claro se a referência está em criação, aprovada ou promovida para produto comercial.
- A UI deve evitar uma lista longa de campos obrigatórios no primeiro contato.
- A UI deve reaproveitar padrões já existentes da tela de produtos quando isso ajudar a consistência, sem forçar o fluxo comercial em uma peça ainda em desenvolvimento.

## Fora de Escopo

- Implementar ficha técnica completa de produção.
- Definir modelagem, corte, ordem de produção ou pilotagem detalhada.
- Criar estoque inicial ou movimentações de estoque.
- Criar venda, baixa de estoque, pagamentos ou recebíveis.
- Automatizar preço de venda por margem.
- Criar importação por planilha.
- Criar galeria avançada com reordenação, edição de imagem ou tratamento visual.
- Definir sugestão automática obrigatória da próxima referência.

## Critérios de Aceite

- Uma usuária administradora consegue criar uma referência incompleta com poucos dados.
- Uma usuária administradora consegue anexar croqui sem foto do produto pronto.
- O sistema distingue tipos de imagem no modelo e na UI.
- Uma usuária administradora consegue informar itens de custo e ver custo total calculado.
- A referência pode ser salva, retomada e completada depois.
- A evolução para produto comercial não perde croqui, observações nem custo calculado.
- O fluxo permanece mais simples do que preencher todos os dados comerciais de produto no início.

## Validação

- Testes de API cobrindo criação, edição, listagem, detalhe e permissão de escrita.
- Testes de API cobrindo upload ou vínculo de imagem de croqui e diferenciação de tipo de imagem.
- Testes de API cobrindo criação, edição, remoção e cálculo total de itens de custo.
- Testes de API cobrindo promoção ou associação da referência com produto comercial, quando implementada.
- `npm run typecheck`
- `npm run test`
- `npm run build`
- Checagem manual do fluxo em desktop e mobile.
- Checagem manual de referência incompleta.
- Checagem manual de referência com croqui, custos e sem foto pronta.

## Observações

- Esta spec parte do contexto operacional registrado em `CONTEXTO_CADERNO_PRODUTOS_EDREN.md` e ainda precisa de design antes de implementação.
- O design deve decidir se a melhor solução é uma tela anterior de criação/referência, abas dentro do produto, ou uma combinação das duas.
- A spec `products-and-collections` continua válida para o momento comercial da referência.
- Esta feature deve evitar alterar o fluxo já implementado de produtos comerciais sem necessidade clara.
