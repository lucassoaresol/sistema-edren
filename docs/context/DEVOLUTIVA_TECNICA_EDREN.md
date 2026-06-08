# Devolutiva Técnica — Projeto EDREN

Este documento revisa o `PROJECT.md` inicial e consolida as decisões tomadas após a etapa de clarificação do projeto.

O objetivo é orientar a assistente de desenvolvimento de código antes de consolidar a especificação final em `.specs/project/PROJECT.md`.

O `PROJECT.md` inicial deve ser tratado como guia de contexto, não como escopo fechado. Após a revisão, a recomendação é reduzir a primeira versão para um MVP mais seguro, simples e funcional.

---

# 1. Direção geral do projeto

O sistema EDREN será um sistema interno de gestão para a marca/confecção EDREN.

A ideia central continua sendo:

> O sistema deve acompanhar a vida da peça: da coleção e entrada no estoque até venda, condicional, sacoleira, devolução, pagamento e resultado.

Porém, para a V1, essa ideia precisa ser implementada de forma simples.

Na primeira versão, o sistema não deve tentar resolver toda a operação da EDREN de uma vez. A prioridade é construir uma base confiável para:

- produtos;
- coleções;
- SKUs/variações;
- clientes;
- estoque;
- movimentações;
- vendas;
- pagamentos;
- contas a receber básicas;
- relatórios mínimos.

---

# 2. Decisão sobre o conceito de “peça”

Na V1, “peça” não significa uma unidade individual rastreada separadamente.

Na V1, o sistema deve controlar **produto/SKU com quantidade**.

Exemplo:

Se existe:

- Vestido Luar;
- azul;
- tamanho M;
- 5 unidades.

O sistema deve tratar isso como uma variação/SKU com quantidade 5, não como 5 peças individuais com identificadores próprios.

## Modelo recomendado

Separar conceitualmente:

- Produto: modelo comercial, exemplo: Vestido Luar;
- SKU/Variação: combinação de produto + cor + tamanho;
- Estoque: quantidade de cada SKU em cada local.

Exemplo:

```text
Produto: Vestido Luar
SKU: Vestido Luar / Azul / M
Local: Casa EDREN
Quantidade: 5
```

Rastreamento individual por unidade deve ficar fora da V1.

---

# 3. Escopo recomendado para MVP/V1

O escopo inicial do `PROJECT.md` estava grande demais para uma primeira entrega funcional.

A recomendação é dividir o projeto em:

- MVP/V1;
- fase 2;
- fases futuras.

## MVP/V1 recomendado

A V1 deve incluir:

- autenticação simples;
- usuários básicos;
- permissões simples por perfil;
- cadastros configuráveis;
- coleções;
- produtos;
- SKUs/variações;
- clientes;
- locais de estoque;
- entrada de estoque;
- movimentações de estoque;
- vendas;
- pagamentos;
- contas a receber básicas;
- painel inicial simples;
- relatórios mínimos.

## Fase 2 recomendada

Deixar para fase 2:

- condicional com tela completa;
- sacoleiras/revendedoras com tela completa;
- comissões;
- despesas;
- trocas e devoluções detalhadas;
- relatórios mais avançados;
- metas;
- dashboard visual;
- alertas de atraso;
- exportação de relatórios.

## Fases futuras

Deixar para fases futuras:

- e-commerce;
- integração com WhatsApp;
- integração com Instagram;
- emissão de nota fiscal;
- gateway de pagamento;
- aplicativo mobile;
- código de barras;
- impressora de etiquetas;
- permissões customizadas por usuário;
- produção avançada;
- automação de marketing.

---

# 4. Cadastros configuráveis

Uma decisão importante é evitar listas fixas no código.

Na V1, os seguintes itens devem ser cadastros configuráveis:

- grades de tamanho;
- categorias;
- cores;
- locais de estoque;
- canais de venda;
- formas de pagamento.

Isso permite que a EDREN ajuste o sistema sem precisar alterar código.

---

# 5. Grades de tamanho

O sistema deve usar o conceito de **grade**.

Não deve existir uma lista fixa de tamanhos no código.

Exemplo de grade:

```text
Grade Feminina P ao GG:
- P
- M
- G
- GG
```

Outro exemplo futuro:

```text
Grade Plus Size:
- G1
- G2
- G3
```

Ao cadastrar um produto, o usuário deve indicar qual grade aquele produto usa.

Exemplo:

```text
Produto: Vestido Luar
Grade: Feminina P ao GG
```

Os tamanhos devem ter ordem de exibição.

Campos sugeridos para grade:

- nome;
- descrição opcional;
- status ativo/inativo.

Campos sugeridos para tamanho da grade:

- nome;
- ordem;
- ativo/inativo.

---

# 6. Categorias

Categorias devem ser cadastráveis.

Não devem ficar fixas no código.

Exemplos de categorias iniciais podem ser criados via seed ou cadastro:

- Vestido;
- Blusa;
- Calça;
- Saia;
- Short;
- Macacão;
- Conjunto;
- Outros.

Campos sugeridos:

- nome;
- descrição opcional;
- ativo/inativo.

Ao cadastrar um produto, o usuário escolhe a categoria.

---

# 7. Cores

As cores também devem ser cadastráveis.

O SKU depende de cor e tamanho, então cor não deve ser apenas texto solto.

Exemplos:

- Azul;
- Verde;
- Off White;
- Preto;
- Estampado;
- Xadrez.

Campos sugeridos:

- nome;
- código/slug opcional;
- ativo/inativo.

---

# 8. Locais de estoque

Locais de estoque devem ser cadastráveis.

Exemplos iniciais:

- Casa EDREN;
- Fábrica;
- Nova Loja.

Campos sugeridos:

- nome;
- descrição opcional;
- ativo/inativo.

O sistema deve permitir criar novos locais no futuro.

Importante: condicional e sacoleira não devem ser apenas locais genéricos sem vínculo. Quando uma peça/SKU sair para condicional ou sacoleira, o sistema precisa registrar com quem ela está.

---

# 9. Canais de venda

Canais de venda devem ser cadastráveis.

Exemplos iniciais:

- Loja física;
- WhatsApp;
- Instagram;
- Evento;
- Indicação;
- Nova Loja;
- Sacoleira.

Campos sugeridos:

- nome;
- descrição opcional;
- ativo/inativo.

Ao registrar uma venda, o usuário escolhe o canal.

---

# 10. Formas de pagamento

Formas de pagamento devem ser cadastráveis.

Exemplos iniciais:

- Dinheiro;
- Pix;
- Cartão;
- Crediário;
- Transferência;
- Link de pagamento;
- Outro.

Campos sugeridos:

- nome;
- descrição opcional;
- ativo/inativo.

Uma venda pode ter mais de um pagamento.

Exemplo:

```text
Venda: R$ 600,00

Pagamentos:
- R$ 200,00 no Pix
- R$ 400,00 no Cartão
```

Ou:

```text
Venda: R$ 600,00

Pagamentos:
- R$ 200,00 no Pix

Saldo em aberto:
- R$ 400,00
```

---

# 11. Condicional e sacoleira na V1

Condicional e sacoleira são importantes para a EDREN, mas o módulo completo pode ficar para fase 2.

Na V1, a recomendação é tratar esses casos como **movimentações de estoque com vínculo de responsável**.

## Regra

Condicional não é venda.

Sacoleira/revendedora não é venda até acerto.

Mas ambos devem tirar a quantidade do estoque disponível.

## Exemplo de condicional

```text
Movimentação: envio para condicional
Cliente: Maria
SKU: Vestido Luar / Azul / M
Quantidade: 1
```

Esse SKU deixa de estar disponível para venda normal.

Se a cliente devolver, o sistema registra retorno de condicional.

Se a cliente ficar com a peça, o sistema registra venda.

## Exemplo de sacoleira

```text
Movimentação: envio para sacoleira
Responsável: Ana
SKU: Vestido Luar / Azul / M
Quantidade: 2
```

Esse estoque fica indisponível para venda normal até retorno ou acerto.

---

# 12. Venda em aberto

Venda em aberto deve baixar estoque imediatamente.

Se a cliente compra fiado, no crediário ou paga apenas parte do valor, a peça já saiu da loja e não pode continuar disponível.

## Regra

Ao confirmar uma venda:

- o estoque é baixado;
- o valor total da venda é registrado;
- os pagamentos são registrados;
- se houver saldo, entra em contas a receber.

Exemplo:

```text
Venda: R$ 600,00
Pagamento inicial: R$ 200,00
Saldo em aberto: R$ 400,00
Estoque: baixado no momento da venda
```

---

# 13. Contas a receber na V1

Na V1, não é necessário modelar parcelas formais.

A regra recomendada é registrar **pagamentos parciais vinculados a uma venda**.

A conta a receber pode ser calculada a partir da diferença entre:

- valor total da venda;
- valor total pago.

Exemplo:

```text
Venda: R$ 600,00

Pagamentos:
- R$ 200,00 em 10/06
- R$ 200,00 em 20/06
- R$ 200,00 em 30/06

Saldo: R$ 0,00
Status: pago
```

Fica fora da V1:

- parcelas formais;
- carnê;
- vencimento de cada parcela;
- juros;
- multa;
- cobrança automática.

---

# 14. Comissão

Comissão deve ficar fora do MVP inicial.

Quando entrar, a regra inicial recomendada é:

- percentual por vendedora;
- calculado proporcionalmente sobre valores pagos;
- não apenas sobre venda lançada.

Exemplo futuro:

```text
Vendedora: Ariana
Comissão: 4%

Venda: R$ 600,00
Pagamento recebido: R$ 200,00
Comissão calculada inicialmente sobre R$ 200,00
```

Evitar na fase inicial:

- comissão por produto;
- comissão por coleção;
- regras múltiplas;
- bônus complexos;
- metas automáticas.

---

# 15. Despesas

Despesas devem ficar fora do MVP inicial.

A prioridade da V1 é consolidar:

- produtos;
- estoque;
- vendas;
- pagamentos;
- contas a receber.

Despesas entram melhor na fase 2, depois que a operação principal estiver funcionando.

---

# 16. Autenticação

A autenticação da V1 deve usar:

- email;
- senha.

Usuário do sistema deve ter:

- nome;
- email;
- senha;
- perfil;
- status ativo/inativo.

Senhas devem ser armazenadas com hash seguro.

---

# 17. Permissões

Na V1, permissões simples por perfil são suficientes.

Não criar tela complexa de permissões customizadas por usuário.

Perfis recomendados:

- administrador;
- gerente;
- vendedor/operador.

## Administrador

Acesso total.

## Gerente

Acesso a:

- produtos;
- estoque;
- clientes;
- vendas;
- pagamentos;
- contas a receber;
- relatórios básicos.

## Vendedor/operador

Acesso a:

- consulta de produtos;
- consulta de estoque;
- clientes;
- vendas;
- pagamentos.

Sem acesso a:

- configurações críticas;
- gestão de usuários;
- exclusão de registros importantes;
- financeiro completo, se houver no futuro.

---

# 18. Decisões técnicas consolidadas

## Stack

- Frontend: Vite com TypeScript e Tailwind CSS.
- Backend: Fastify.
- Banco de dados: PostgreSQL.
- ORM: Prisma.
- Autenticação: email + senha.
- Upload de imagens: Cloudinary.
- Deploy: VPS com Nginx, PM2 e Cloudflared Tunnel.
- Gerenciador de pacotes: npm.
- Monorepo: npm workspaces.
- Versionamento: Git/GitHub.

---

# 19. Deploy e arquitetura

O projeto será hospedado em uma única VPS.

O frontend será buildado com Vite e servido pelo Nginx.

O backend Fastify será executado via PM2, escutando localmente na VPS, por exemplo:

```text
127.0.0.1:3001
```

A API não terá domínio público próprio.

O frontend consumirá a API por meio da rota:

```text
/api
```

O Nginx fará o proxy reverso para o Fastify.

Exemplo em produção:

```text
Frontend público: https://sistema.edren.com.br
API via frontend: https://sistema.edren.com.br/api
Fastify interno: 127.0.0.1:3001
Banco: edren_prod
```

Exemplo futuro para desenvolvimento publicado:

```text
Frontend dev: https://dev-sistema.edren.com.br
API dev via frontend: https://dev-sistema.edren.com.br/api
Fastify dev interno: 127.0.0.1:3002
Banco: edren_dev
```

---

# 20. Ambiente de desenvolvimento

O ambiente de desenvolvimento na VPS não é obrigatório desde o início.

O desenvolvimento pode começar localmente.

A aplicação deve ser construída de forma que suporte dev/prod por variáveis de ambiente, mas não é necessário publicar o ambiente dev na VPS no primeiro momento.

## Estratégia recomendada

Inicialmente:

- desenvolvimento local;
- banco local ou banco dev;
- Cloudinary com pasta/prefixo dev;
- Git/GitHub;
- documentação no repositório.

Quando for para produção:

- configurar VPS;
- configurar banco `edren_prod`;
- configurar Nginx;
- configurar PM2;
- servir frontend pelo Nginx;
- expor API apenas via `/api`.

Depois, se necessário:

- criar `dev-sistema.edren.com.br`;
- criar banco `edren_dev`;
- criar processo PM2 `edren-api-dev`.

---

# 21. Monorepo

O projeto deve usar npm workspaces.

Estrutura sugerida:

```text
edren/
├── apps/
│   ├── web/              # Frontend Vite + TypeScript + Tailwind
│   └── api/              # Backend Fastify
│
├── packages/
│   ├── database/         # Prisma schema, migrations e client
│   ├── shared/           # Tipos, validações e utilitários compartilhados
│   └── config/           # Configurações comuns do projeto
│
├── .specs/
│   └── project/
│       └── PROJECT.md
│
├── docs/
├── scripts/
├── package.json
├── package-lock.json
└── README.md
```

Exemplo conceitual do `package.json` raiz:

```json
{
  "name": "edren",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev:web": "npm run dev -w apps/web",
    "dev:api": "npm run dev -w apps/api",
    "build:web": "npm run build -w apps/web",
    "build:api": "npm run build -w apps/api",
    "dev": "npm run dev:web & npm run dev:api"
  }
}
```

---

# 22. Upload de imagens

As imagens dos produtos devem ser armazenadas no Cloudinary.

O banco deve armazenar:

- URL da imagem;
- public_id;
- vínculo com produto;
- indicação de imagem principal, se necessário;
- data de criação.

Recomendação:

Separar imagens por pasta/prefixo:

```text
edren/dev/produtos
edren/prod/produtos
```

---

# 23. Entidades principais recomendadas para o MVP

Entidades mínimas para modelagem inicial:

- User;
- Role/Profile;
- Collection;
- Product;
- ProductImage;
- SizeGrid;
- Size;
- Category;
- Color;
- SKU/ProductVariant;
- StockLocation;
- StockBalance;
- StockMovement;
- Customer;
- SalesChannel;
- PaymentMethod;
- Sale;
- SaleItem;
- Payment.

Contas a receber podem ser calculadas a partir de `Sale` e `Payment`, sem necessidade de uma entidade complexa no início.

---

# 24. Regras de negócio consolidadas

1. Na V1, peça significa SKU com quantidade.

2. O estoque deve ser controlado por SKU e local.

3. Tamanho deve vir de uma grade cadastrável.

4. Categoria deve ser cadastrável.

5. Cor deve ser cadastrável.

6. Local de estoque deve ser cadastrável.

7. Canal de venda deve ser cadastrável.

8. Forma de pagamento deve ser cadastrável.

9. Venda confirmada baixa estoque.

10. Venda em aberto baixa estoque e gera saldo a receber.

11. Pagamentos parciais devem ser permitidos.

12. Condicional não é venda.

13. Sacoleira não é venda até acerto.

14. Condicional e sacoleira devem reservar estoque.

15. Condicional e sacoleira devem guardar vínculo com responsável.

16. Comissão fica fora do MVP.

17. Despesas ficam fora do MVP.

18. Parcelas formais ficam fora do MVP.

19. API não será exposta publicamente.

20. Dev na VPS não é obrigatório no início.

---

# 25. Ordem de desenvolvimento recomendada

1. Criar monorepo com npm workspaces.
2. Configurar apps `web` e `api`.
3. Configurar PostgreSQL.
4. Configurar Prisma.
5. Criar autenticação básica.
6. Criar usuários e perfis simples.
7. Criar cadastros configuráveis:
   - grades;
   - tamanhos;
   - categorias;
   - cores;
   - locais;
   - canais;
   - formas de pagamento.
8. Criar coleções.
9. Criar produtos.
10. Criar SKUs/variações.
11. Integrar upload de imagem com Cloudinary.
12. Criar clientes.
13. Criar entrada de estoque.
14. Criar movimentações de estoque.
15. Criar saldos de estoque por SKU/local.
16. Criar vendas.
17. Criar itens de venda.
18. Criar pagamentos.
19. Criar contas a receber calculadas.
20. Criar painel inicial simples.
21. Criar relatórios mínimos.
22. Preparar build de produção.
23. Configurar deploy na VPS.
24. Configurar Nginx.
25. Configurar PM2.
26. Documentar instalação, deploy e backup.

---

# 26. Relatórios mínimos do MVP

Relatórios mínimos para a V1:

- vendas por período;
- vendas do dia;
- vendas do mês;
- estoque por produto/SKU;
- estoque por local;
- contas a receber;
- clientes com saldo em aberto;
- vendas por coleção;
- vendas por canal.

Não precisa de dashboard avançado na V1.

---

# 27. Pontos ainda pendentes para decisão humana

Mesmo com essa revisão, alguns pontos ainda podem ser decididos durante a configuração inicial do sistema:

1. Quais grades serão cadastradas inicialmente.
2. Quais categorias iniciais serão cadastradas.
3. Quais cores iniciais serão cadastradas.
4. Quais locais iniciais serão cadastrados.
5. Quais canais de venda iniciais serão cadastrados.
6. Quais formas de pagamento iniciais serão cadastradas.
7. Se a nova loja entra como local ativo imediatamente ou como local futuro.
8. Se condicional e sacoleira terão telas próprias simples já no MVP ou apenas movimentações.
9. Se custo do produto será obrigatório ou opcional.
10. Se registros importantes poderão ser excluídos ou apenas cancelados/inativados.

---

# 28. Recomendação final para a especificação oficial

O `PROJECT.md` oficial deve ser menor e mais objetivo que o brief inicial.

A especificação oficial deve deixar claro que o MVP não inclui tudo que foi imaginado para o sistema EDREN.

A prioridade do MVP é:

- cadastrar a estrutura básica da loja;
- cadastrar produtos e SKUs;
- controlar estoque por local;
- registrar vendas;
- registrar pagamentos;
- mostrar contas a receber;
- permitir consultas e relatórios simples.

Depois que essa base estiver estável, o projeto pode evoluir para:

- condicional completo;
- sacoleiras completo;
- despesas;
- comissões;
- metas;
- relatórios avançados;
- etiquetas;
- código de barras;
- integrações.

A orientação principal para o desenvolvimento é:

> Construir primeiro uma base simples, confiável e evolutiva. Evitar complexidade desnecessária na V1.
