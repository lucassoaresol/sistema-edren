# Spec de Referência em Criação e Caderno de Produtos

**Situação:** Planejada.
**Rastreabilidade:** `docs/context/CADERNO_PRODUTOS_EDREN.md`; apresentação do cadastro de produtos; spec `products-and-collections` já implementada; decisão de modularização por ecossistema em 2026-06-13.

## Propósito

Permitir que a EDREN registre o nascimento de uma peça no sistema de forma mais rápida e organizada do que no caderno físico, preservando croqui, materiais, custos e observações antes de a referência virar um produto comercial completo.

Esta feature também estabelece que o sistema deve tratar **referência** como um conceito transversal: a mesma referência atravessa o ecossistema da confecção e o ecossistema da loja, mas com comportamentos diferentes em cada módulo.

## Contexto Operacional

Hoje a EDREN usa um caderno físico para registrar o desenvolvimento das peças. A página do caderno reúne referência, croqui/desenho, tecido, metragem, forro, zíper, botões, alça, costura, mão de obra, plaquinha, tag, cálculo de custo e observações.

Esse registro não representa apenas um produto pronto para venda. Ele representa o raciocínio de criação da peça: desenho, materiais, serviços, acabamento e custo de produção.

A tela atual de produtos atende melhor o momento comercial, quando já existem nome final, preço, coleção, categoria, grade, SKUs, estoque e fotos prontas. Esta feature cobre a etapa anterior ou complementar: a referência ainda em criação.

## Conceito Modular

O sistema deve ser organizado por módulos de negócio, não por uma tela única tentando resolver toda a vida da peça. A referência funciona como o elo entre esses módulos.

- No módulo de **Confecção**, a referência representa criação, desenvolvimento, materiais, custo, croqui, piloto, aprovação e preparação para fabricação.
- No módulo de **Loja/Catálogo**, a referência representa produto comercial vendável, com nome, coleção, categoria, preço, SKUs, fotos prontas, estoque e venda.
- No módulo de **Estoque**, a referência aparece por meio dos SKUs e saldos por local.
- No módulo de **Vendas**, a referência serve como busca e identificação comercial do produto vendido.
- No módulo de **Relatórios**, a referência consolida leitura de estoque, venda, coleção, custo e desempenho.

Portanto, referência não deve ser entendida apenas como um campo de texto do produto. Ela é a identidade operacional da peça dentro da EDREN.

Cada módulo também define um **contexto de uso**: quais informações aparecem, quais ações são permitidas, qual linguagem a interface usa e quais tipos de usuário devem acessar aquele contexto. A separação modular deve existir na navegação, nas permissões, nas validações e na API.

## Comportamento da Referência por Ecossistema

### Confecção

Na confecção, a referência está associada ao nascimento e à fabricação da peça. Ela pode existir incompleta e evoluir aos poucos.

Comportamentos esperados:

- pode nascer com poucos dados;
- pode ter croqui antes de foto pronta;
- pode ter custo em construção;
- pode ter materiais e serviços ainda aproximados;
- pode passar por estados como rascunho, em desenvolvimento, aprovada e promovida para produto;
- não precisa ter preço, grade, estoque ou SKUs no primeiro momento;
- preserva o histórico criativo e produtivo mesmo depois de virar produto comercial.

Usuários esperados:

- administradora/dona da EDREN;
- pessoa responsável por criação, custo ou produção, quando existir no fluxo operacional.

Acesso esperado no MVP:

- `ADMIN`: pode criar, editar, anexar croqui, alterar custos, aprovar e promover referência;
- `MANAGER` ou perfil equivalente futuro: pode consultar referências e custos apenas se a EDREN decidir expor esse contexto para gestão operacional;
- `SELLER_OPERATOR`: não deve acessar o contexto de Confecção por padrão, porque ele contém custo, criação e informação interna de fabricação.

### Loja/Catálogo

Na loja, a referência está associada à venda. Ela precisa estar comercialmente completa antes de entrar nos fluxos de estoque e venda.

Comportamentos esperados:

- deve ter referência comercial única;
- deve ter nome comercial, coleção, categoria, grade e preço de venda;
- deve possuir SKUs por cor e tamanho para controle de estoque;
- pode usar custo vindo da confecção, mas o custo continua opcional no MVP;
- pode ter imagem de produto comercial pronta para catálogo;
- é usada para busca rápida em vendas e relatórios.

Usuários esperados:

- administradora/dona da EDREN;
- gerente;
- vendedora/operadora para consulta operacional.

Acesso esperado no MVP:

- `ADMIN`: pode criar e editar produtos, preço, custo, imagens e SKUs;
- `MANAGER` ou perfil equivalente: pode consultar catálogo e usar produtos em estoque/vendas, sem alterar preço/custo no MVP;
- `SELLER_OPERATOR`: pode consultar produtos ativos e usar referência/SKU na venda, sem ver custo e sem editar cadastro.

### Relação Entre Os Dois Ecossistemas

A referência de confecção e o produto comercial não devem competir entre si. O fluxo esperado é:

1. A confecção cria ou registra uma referência em desenvolvimento.
2. A referência recebe croqui, observações, materiais e custos conforme a peça evolui.
3. Quando a peça é aprovada para venda, a referência é promovida ou associada a um produto comercial.
4. O produto comercial assume os dados necessários para loja, estoque e venda.
5. O histórico de criação continua acessível a partir da referência/produto.

## Escopo

Esta feature cobre:

- criação rápida de uma referência com dados mínimos;
- registro de croqui ou foto do desenho da peça;
- diferenciação inicial entre croqui/imagem de criação e imagem de produto comercial;
- registro simples de materiais, aviamentos, serviços, acabamentos e custos;
- cálculo automático do custo total a partir dos itens informados;
- salvamento de referência incompleta para preenchimento gradual;
- evolução da referência de criação para produto comercial quando estiver pronta;
- reaproveitamento ou sugestão de itens/custos comuns quando viável sem deixar o fluxo pesado.

## Requisitos

- REQ-PCR-001: O sistema deve permitir criar uma referência em criação com o mínimo de campos obrigatórios possível.
- REQ-PCR-002: A referência em criação deve poder ser salva mesmo sem foto do produto pronto, nome comercial final, grade completa, estoque ou material de venda.
- REQ-PCR-003: O sistema deve permitir anexar um croqui ou foto do desenho da peça durante a etapa de criação.
- REQ-PCR-004: O sistema deve diferenciar semanticamente croqui/imagem de criação e imagem de produto comercial.
- REQ-PCR-005: O sistema não deve tratar croqui e imagem de produto comercial como uma mesma imagem principal quando isso apagar a diferença operacional entre criação e venda.
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
- REQ-PCR-021: O sistema deve explicitar a separação modular entre Confecção e Loja/Catálogo, evitando que o cadastro comercial de produto concentre todos os dados de criação e fabricação.
- REQ-PCR-022: A referência deve funcionar como elo entre módulos, permitindo rastrear uma peça desde criação/fabricação até produto comercial, estoque, venda e relatório.
- REQ-PCR-023: A referência em contexto de Confecção deve aceitar estados de desenvolvimento, como rascunho, em desenvolvimento, aprovada e promovida para produto comercial, ou equivalentes definidos no design.
- REQ-PCR-024: A referência em contexto de Loja/Catálogo deve continuar respeitando as regras já implementadas em `products-and-collections` para produto comercial, SKU, preço, coleção e venda.
- REQ-PCR-025: A promoção para produto comercial deve ser uma transição explícita, não uma obrigação no cadastro inicial da confecção.
- REQ-PCR-026: A UI deve deixar claro para a usuária se ela está trabalhando no contexto de criação/fabricação ou no contexto de venda/catálogo.
- REQ-PCR-027: Cada módulo deve declarar o contexto operacional que representa, incluindo dados visíveis, ações permitidas e linguagem da interface.
- REQ-PCR-028: O acesso aos módulos deve respeitar perfis de usuário, mantendo permissões simples por perfil no MVP e deixando permissões customizadas por usuário fora do escopo.
- REQ-PCR-029: O contexto de Confecção deve proteger custo detalhado, croqui e informações internas de fabricação contra acesso de perfis de venda por padrão.
- REQ-PCR-030: O contexto de Loja/Catálogo deve permitir consulta operacional por perfis que precisam vender ou movimentar estoque, mas deve restringir alteração de cadastro, preço e custo a `ADMIN` no MVP.
- REQ-PCR-031: A UI não deve apenas esconder botões; a API deve validar permissão conforme o contexto e a ação solicitada.

## Regras de Negócio

- Na EDREN, a peça nasce na confecção antes de virar produto comercial.
- O croqui pertence ao momento de criação e desenvolvimento.
- A foto do produto pronto pertence a outro momento, quando a peça já está costurada, aprovada e pronta para venda, divulgação ou catálogo.
- A referência em criação pode existir incompleta.
- Produto comercial representa a referência pronta para venda e integração com coleção, SKUs, estoque, vendas e relatórios.
- Confecção e Loja são ecossistemas diferentes dentro da mesma operação: a confecção fabrica/desenvolve; a loja vende/controla estoque comercial.
- A mesma referência pode ter comportamentos diferentes conforme o módulo, sem perder identidade.
- Dados de criação/fabricação não devem ser exigidos para vender se não forem necessários ao fluxo comercial do MVP.
- Dados comerciais de venda não devem ser exigidos para registrar uma peça ainda em desenvolvimento.
- Acesso ao contexto de Confecção é mais restrito que acesso ao catálogo comercial, porque envolve custo, desenvolvimento e decisões internas da EDREN.
- Acesso ao contexto de Loja/Catálogo pode ser mais amplo para consulta, porque estoque e venda dependem da identificação do produto por referência/SKU.
- Permissões no MVP são por perfil, não por usuário individual.
- O sistema deve acompanhar o nascimento da peça, não apenas cadastrar a peça depois de pronta.
- O processo digital deve ser mais rápido e organizado do que o caderno físico.
- O cálculo de custo deve reduzir contas manuais, não criar uma etapa burocrática maior.
- Itens comuns de custo podem ser reaproveitados ou sugeridos, desde que isso não atrase o cadastro simples.

## API Esperada

As rotas devem seguir o padrão modular da API. A referência em criação deve ficar em módulo próprio de Confecção/Criação ou equivalente, enquanto produtos comerciais continuam no módulo de Catálogo.

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

Namespaces candidatos:

- `/api/production/references`, se o módulo for nomeado como produção/confecção;
- `/api/creation/references`, se o módulo enfatizar criação/desenvolvimento;
- `/api/product-references`, se a equipe preferir manter o termo mais próximo da entidade transversal.

A decisão final deve preservar a separação de responsabilidades: rotas de criação/fabricação não devem ficar misturadas às rotas comerciais de catálogo apenas por compartilharem a palavra produto.

## UI Esperada

- A UI deve permitir iniciar uma nova referência rapidamente, com poucos campos obrigatórios.
- A tela deve separar visualmente dados de criação, imagens de criação, custos e dados comerciais.
- A UI deve deixar clara a navegação modular: Confecção/Criação para nascimento da referência; Produtos/Catálogo para produto vendável.
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
- Diferenciar, na implementação inicial, foto na modelo, foto de detalhe e outras variações além de croqui/criação e produto/comercial.

## Critérios de Aceite

- Uma usuária administradora consegue criar uma referência incompleta com poucos dados.
- Uma usuária administradora consegue anexar croqui sem foto do produto pronto.
- O sistema distingue tipos de imagem no modelo e na UI.
- Uma usuária administradora consegue informar itens de custo e ver custo total calculado.
- A referência pode ser salva, retomada e completada depois.
- A evolução para produto comercial não perde croqui, observações nem custo calculado.
- O fluxo permanece mais simples do que preencher todos os dados comerciais de produto no início.
- A usuária consegue distinguir quando está preparando a peça para fabricação e quando está cadastrando o produto para venda.
- O produto comercial continua apto a alimentar estoque e venda sem carregar obrigatoriedade de campos produtivos.

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

- Esta spec parte do contexto operacional registrado em `docs/context/CADERNO_PRODUTOS_EDREN.md` e ainda precisa de design antes de implementação.
- O design deve partir da separação entre módulos: Confecção/Criação e Loja/Catálogo. A decisão pendente é como navegar entre eles e como promover/associar a referência ao produto comercial.
- A spec `products-and-collections` continua válida para o momento comercial da referência.
- Esta feature deve evitar alterar o fluxo já implementado de produtos comerciais sem necessidade clara.
