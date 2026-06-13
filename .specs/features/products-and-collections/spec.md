# Spec de Produtos, Coleções e SKUs

**Situação:** Implementada e validada.
**Rastreabilidade:** Roadmap `Products And Collections` em Operações do MVP; `.specs/project/PROJECT.md`; `docs/context/DECISOES_OPERACIONAIS_EDREN.md` seções 2, 9 e 11; `docs/context/DECISOES_FINAIS_ESPECIFICACAO_EDREN.md` decisões 3, 9 e 10; achados de UAT da tela de produtos em 2026-06-13.

## Propósito

Permitir que administradores mantenham o catálogo operacional da EDREN com coleções, produtos/referências comerciais e SKUs por cor e tamanho, preparando o sistema para estoque, vendas, relatórios por referência e filtros por coleção.

## Escopo

Esta feature cobre:

- coleções;
- produtos com referência comercial única;
- vínculo do produto com coleção, categoria e grade de tamanho;
- preço de venda no nível do produto;
- custo opcional no nível do produto;
- status ativo/inativo do produto;
- SKUs/variações por produto, cor e tamanho;
- status ativo/inativo do SKU;
- imagem principal opcional do produto com upload direto para Cloudinary, mantendo o modelo preparado para múltiplas imagens.

## Requisitos

- REQ-PROD-001: O sistema deve listar, criar, editar nome, descrição, datas e status, além de arquivar/reativar coleções.
- REQ-PROD-002: O sistema deve impedir nomes duplicados de coleção.
- REQ-PROD-003: Coleções devem suportar os status `ACTIVE` e `ARCHIVED`.
- REQ-PROD-004: Coleções devem ter data de início obrigatória no cadastro.
- REQ-PROD-005: Coleções devem aceitar data de fim opcional.
- REQ-PROD-006: O sistema deve impedir data de fim anterior à data de início da coleção.
- REQ-PROD-007: O cadastro/edição de produto deve disponibilizar apenas coleções vigentes para novo vínculo.
- REQ-PROD-008: Uma coleção vigente é uma coleção `ACTIVE` cuja data de início já chegou e cuja data de fim está vazia ou ainda não passou.
- REQ-PROD-009: A API deve impedir produto vinculado a coleção não vigente em criação ou troca de coleção.
- REQ-PROD-010: Produtos devem ter referência comercial obrigatória, única e preenchida manualmente.
- REQ-PROD-011: A referência comercial deve pertencer ao produto, não ao SKU.
- REQ-PROD-012: O sistema deve impedir duplicidade de referência comercial.
- REQ-PROD-013: Produtos devem ter nome obrigatório.
- REQ-PROD-014: Produtos devem pertencer obrigatoriamente a uma coleção.
- REQ-PROD-015: Produtos devem pertencer obrigatoriamente a uma categoria.
- REQ-PROD-016: Produtos devem pertencer obrigatoriamente a uma grade de tamanho.
- REQ-PROD-017: Produtos devem ter preço de venda obrigatório, armazenado no nível do produto/referência.
- REQ-PROD-018: Produtos devem aceitar custo opcional, armazenado no nível do produto/referência.
- REQ-PROD-019: O sistema deve permitir cadastrar produto sem imagem.
- REQ-PROD-020: O sistema deve permitir cadastrar ou alterar uma imagem principal opcional para o produto.
- REQ-PROD-021: A estrutura de imagem deve preservar suporte a múltiplas imagens no banco, mesmo que a interface inicial trabalhe com apenas uma imagem principal.
- REQ-PROD-021A: A imagem principal deve ser enviada pela interface como arquivo e a API deve fazer upload direto para o Cloudinary, gravando `url` e `publicId` retornados pelo provedor.
- REQ-PROD-021B: A API deve rejeitar upload de imagem quando a integração Cloudinary não estiver configurada, retornando mensagem clara para a UI.
- REQ-PROD-021C: O upload deve aceitar apenas formatos de imagem suportados e limitar tamanho do arquivo para proteger a API.
- REQ-PROD-021D: Ao substituir ou remover a imagem principal, a API deve remover o asset anterior do Cloudinary para evitar acúmulo de imagens órfãs.
- REQ-PROD-022: Produtos devem poder ser ativados e inativados.
- REQ-PROD-023: Produtos com histórico futuro de estoque, movimentação ou venda não devem ser excluídos fisicamente; no MVP, a remoção física de produtos fica fora do escopo.
- REQ-PROD-024: O sistema deve listar os SKUs de um produto como combinações de produto, cor e tamanho.
- REQ-PROD-025: O sistema deve impedir SKUs duplicados para a mesma combinação de produto, cor e tamanho.
- REQ-PROD-026: O tamanho selecionado para um SKU deve pertencer à grade de tamanho do produto.
- REQ-PROD-027: O sistema deve permitir criar SKUs a partir das cores e tamanhos ativos cadastrados em configurações.
- REQ-PROD-028: SKUs devem poder ser ativados e inativados.
- REQ-PROD-029: SKUs com histórico futuro de estoque, movimentação ou venda não devem ser excluídos fisicamente; no MVP, a remoção física de SKUs fica fora do escopo.
- REQ-PROD-030: A leitura de coleções, produtos e SKUs deve estar disponível para usuários autenticados, pois estoque, vendas e relatórios dependerão dessas listas.
- REQ-PROD-031: Criação e edição de coleções, produtos, preços, custos, imagens e SKUs devem ser restritas a usuários autenticados com perfil `ADMIN`.
- REQ-PROD-032: O custo do produto deve ser visível apenas para usuários com perfil `ADMIN` no MVP.
- REQ-PROD-033: Erros de duplicidade, campos obrigatórios, relações inválidas, coleção não vigente e permissão insuficiente devem retornar mensagens claras para a UI.
- REQ-PROD-034: A tela de produtos deve funcionar de forma responsiva em desktop e mobile.
- REQ-PROD-035: A UI deve usar textos em português com acentuação correta e manter a identidade visual clara da EDREN.

## Regras de Negócio

- Uma referência nasce oficialmente quando a peça piloto é aprovada e vai para corte.
- Referências seguem uma sequência crescente contínua da EDREN, mas a sugestão automática da próxima referência fica fora do MVP.
- Referências não se repetem entre coleções.
- Coleção precisa de data de início obrigatória e data de fim opcional.
- Coleções fora de vigência não devem aparecer como opção para novo vínculo no cadastro de produto.
- A edição de produto pode manter a coleção atual mesmo que ela deixe de estar vigente, para preservar histórico e evitar bloquear alteração de outros campos.
- Modelos refeitos, repaginados ou com proposta/acabamento/tecido diferente devem receber uma nova referência.
- Produto representa a referência comercial; SKU representa a variação por cor e tamanho.
- Preço de venda e custo pertencem ao produto, não ao SKU.
- Custo é opcional para não travar cadastro quando o custo ainda não estiver fechado.
- Imagem de produto é opcional para não bloquear cadastro antes da foto estar pronta.
- Quando houver imagem, a fonte oficial do arquivo é o Cloudinary; a UI não deve depender de digitação manual de URL/publicId para o fluxo principal.
- Produto deve usar apenas uma grade de tamanho; os SKUs do produto devem usar tamanhos dessa grade.
- Listas operacionais de categoria, cor e grade/tamanho devem priorizar registros ativos.
- Telas administrativas podem mostrar produtos, SKUs e coleções inativos/arquivados para manutenção.
- Produtos e SKUs serão base para estoque, vendas, recebíveis e relatórios; por isso, histórico futuro deve ser preservado por inativação, não por exclusão física.

## API Esperada

As rotas devem ficar sob `/api/products` e `/api/collections` ou namespace equivalente de catálogo, seguindo o padrão modular da API.

- `GET /api/collections`
- `POST /api/collections`
- `PATCH /api/collections/:id`
- `GET /api/products`
- `POST /api/products`
- `GET /api/products/:id`
- `PATCH /api/products/:id`
- `GET /api/products/:id/variants`
- `POST /api/products/:id/variants`
- `PATCH /api/product-variants/:id`
- `POST /api/products/:id/images/main`
- `DELETE /api/products/:id/images/main`

## UI Esperada

- A rota `/produtos` deve deixar de ser placeholder para esta fatia.
- A UI deve permitir listar produtos com referência, nome, coleção, categoria, preço, status e indicação de imagem.
- A tela de produtos deve priorizar o formulário de novo produto/edição antes da listagem, ambos ocupando a largura útil da tela.
- A listagem de produtos deve permanecer focada em consulta e ações primárias, sem exibir detalhe completo e SKUs na mesma tela e sem cards laterais explicativos desnecessários.
- O detalhe de produto deve existir em página dedicada para imagem, dados completos e gestão de SKUs.
- Administradores devem conseguir criar e editar produtos em formulário com referência, nome, descrição, coleção vigente, categoria, grade, preço, custo opcional, status e imagem principal opcional por upload de arquivo.
- Administradores devem conseguir criar e editar coleção com nome, descrição opcional, data de início obrigatória e data de fim opcional.
- Usuários sem perfil `ADMIN` podem consultar produtos, mas não devem ver custo nem acessar ações de criação/edição.
- A tela de detalhe ou edição do produto deve permitir gerenciar SKUs por cor e tamanho.
- A UI deve deixar claro quando produto ou SKU estiver inativo.
- A UI deve aceitar produto sem imagem e exibir um estado visual padrão nesse caso.
- A UI deve exibir preview/estado de envio da imagem principal e mensagens claras quando o upload Cloudinary falhar ou estiver indisponível.
- A criação de SKU deve orientar o usuário a escolher apenas tamanhos da grade vinculada ao produto.
- A tela deve ser utilizável em desktop e mobile, preservando legibilidade de tabelas, cards e formulários.

## Fora de Escopo

- Estoque inicial, saldos por local, entradas e movimentações de estoque.
- Venda, baixa de estoque, pagamentos, recebíveis e cancelamentos.
- CRUD de clientes.
- Relatórios de estoque, vendas ou coleção.
- Sugestão automática da próxima referência.
- Campo de modelagem base ou produto relacionado.
- Ficha técnica completa, margem, composição de custo e cálculo automático de preço.
- Preço por SKU.
- Código de barras, etiquetas ou rastreamento individual por unidade.
- Galeria completa de imagens, reordenação de imagens, imagem por cor/SKU e múltiplos uploads na interface.
- Importação por planilha.
- Exclusão física de produtos, SKUs ou coleções no MVP.
- Permissões customizadas por usuário.

## Validacao

- Testes de API cobrindo listagem, criação, edição, duplicidade, relações inválidas e permissão de escrita.
- Testes de API cobrindo obrigatoriedade de data de início da coleção, validação de período e bloqueio de produto em coleção não vigente.
- Testes de API cobrindo regra de tamanho pertencente a grade do produto ao criar/editar SKU.
- Testes de API cobrindo ocultação ou bloqueio de custo para perfis sem `ADMIN`, quando aplicável ao contrato da rota.
- Testes de API cobrindo upload de imagem principal, substituição/remocao do asset anterior, permissão de admin, arquivo inválido e Cloudinary sem configuração.
- `npm run typecheck`
- `npm run test`
- `npm run build`
- Checagem manual da tela `/products` em desktop e mobile.
- Checagem manual da rota de detalhe `/products/:productId` em desktop e mobile.
- Checagem manual de produto com imagem e produto sem imagem.
- Checagem manual do upload Cloudinary em `/products/:productId`, validando preview, persistência de `url/publicId` e recarregamento da página.
- Checagem manual de coleção vigente/não vigente no formulário de produto.

Validação automática executada em 2026-06-13:

- `npm run typecheck`: passou.
- `npm run test`: passou, 26 testes.
- `npm run build`: passou; Vite emitiu apenas aviso de chunk JS acima de 500 kB.

Validação manual registrada em 2026-06-13:

- `/products`: checada manualmente.
- `/products/:productId`: checada manualmente.
- Fluxo com imagem Cloudinary: checado manualmente.
- Fluxo sem imagem: checado manualmente.

## Observações

- Esta feature depende dos cadastros configuráveis de categorias, cores, grades de tamanho e tamanhos, além dos seeds iniciais de coleções.
- O enum `CollectionStatus` pode manter `FUTURE` como folga técnica, mas a feature não depende nem expõe esse status no MVP.
- O schema Prisma atual já possui `Collection`, `Product`, `ProductImage` e `ProductVariant`, mas a implementação deve validar se alguma migration adicional é necessária antes de codar.
- Decisão em 2026-06-13: a primeira entrega deve incluir upload real para Cloudinary. A etapa intermediária de URL/publicId manual deixa de ser o fluxo esperado e deve ser substituída por upload de arquivo.
- Como a feature envolve múltiplas telas, permissões, API e possível upload de imagem, o próximo passo recomendado é criar `design.md` e `tasks.md` antes de implementar.
