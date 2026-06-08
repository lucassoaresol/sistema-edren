# Brief do Projeto EDREN

Use este documento como base para orientar o desenvolvimento inicial do sistema interno da EDREN.

Este arquivo pode ser colocado na raiz do projeto como `PROJECT.md` e também pode servir de base para `.specs/project/PROJECT.md`.

---

# 1. O que é o `edren`?

O `edren` é um sistema interno de gestão para a EDREN, uma marca/confecção de moda feminina com produção própria, loja física, vendas por WhatsApp, controle de coleções, estoque, clientes, condicional, sacoleiras/revendedoras, contas a receber, vendas e financeiro básico.

O sistema deve substituir controles manuais feitos em cadernos e planilhas por uma ferramenta simples, organizada, segura e adaptada à rotina real da EDREN.

O objetivo principal é acompanhar a vida da peça: da coleção e entrada no estoque até venda, condicional, sacoleira, devolução, pagamento e resultado.

---

# 2. Para quem é o projeto?

O projeto é para uso interno da EDREN.

Usuários principais:

- Gracinha, proprietária da EDREN;
- equipe administrativa;
- vendedoras/consultoras;
- operadores da Casa EDREN;
- futuramente, equipe da nova loja física;
- pessoas responsáveis por estoque, vendas, clientes e financeiro.

O sistema não será, na primeira versão, uma loja virtual pública. Ele é uma ferramenta interna de gestão.

---

# 3. Qual problema ele resolve?

O sistema resolve a dificuldade de controlar manualmente a operação da EDREN.

Hoje a EDREN precisa controlar:

- peças por referência, coleção, cor, tamanho e local;
- estoque na Casa EDREN, fábrica, nova loja, sacoleiras e clientes em condicional;
- vendas feitas na loja, WhatsApp, eventos e por vendedoras;
- clientes que compram, devem, levam peças para ver em casa ou ficam inativas;
- contas a receber;
- comissões de vendedoras;
- controle de coleções;
- relatórios básicos de vendas, estoque e financeiro.

O principal problema que o sistema resolve é dar clareza sobre:

- onde cada peça está;
- o que foi vendido;
- o que ainda está em aberto;
- quem deve;
- quanto entrou;
- quanto falta receber;
- quais coleções vendem melhor;
- quais peças estão paradas;
- como está o desempenho da loja e das vendedoras.

---

# 4. Objetivo da primeira versão

A primeira versão deve ser simples, funcional e usável no dia a dia.

A prioridade é substituir os controles manuais mais importantes da EDREN, principalmente:

- cadastro de produtos;
- estoque;
- vendas;
- clientes;
- condicional;
- sacoleiras;
- contas a receber;
- despesas básicas;
- comissões;
- relatórios simples.

A V1 não deve tentar ser um sistema grande ou completo demais. Ela deve resolver bem o básico e permitir evolução futura.

---

# 5. O que deve entrar na primeira versão?

## V1 inclui:

### Produtos e peças

- Cadastro de produtos/peças.
- Referência/código da peça.
- Nome da peça.
- Coleção.
- Categoria.
- Cor.
- Tamanho.
- Preço de venda.
- Custo da peça.
- Foto da peça.
- Status da peça.

Cada produto deve estar vinculado a uma coleção.

---

### Coleções

O sistema deve permitir cadastrar e organizar coleções da EDREN, por exemplo:

- Signature;
- Luar;
- Apaixonadas pelo Brasil;
- Solar;
- futuras coleções.

Cada peça/produto deve estar associado a uma coleção para permitir relatórios de desempenho por coleção.

---

### Estoque

O estoque deve ser controlado por:

- referência;
- cor;
- tamanho;
- local;
- quantidade.

Locais de estoque previstos:

- Casa EDREN;
- fábrica;
- nova loja;
- sacoleira/revendedora;
- cliente em condicional.

O sistema deve permitir saber onde está cada peça.

---

### Entrada de estoque

Deve existir uma tela para entrada de peças no estoque.

A entrada deve permitir informar:

- coleção;
- referência;
- cor;
- tamanho;
- quantidade;
- local de destino;
- data da entrada;
- observações.

Ao lançar uma entrada, o estoque deve ser atualizado automaticamente.

---

### Clientes

Cadastro de clientes com:

- nome;
- telefone/WhatsApp;
- cidade, se necessário;
- tipo de cliente;
- histórico de compras;
- saldo em aberto;
- observações.

Tipos possíveis de cliente:

- cliente final;
- sacoleira/revendedora;
- atacado;
- cliente VIP;
- nova cliente.

Observações importantes podem incluir preferências, tamanho usado, comportamento de compra e informações úteis para atendimento.

---

### Vendas

Registro de vendas com:

- data;
- cliente;
- produto/peça;
- referência;
- cor;
- tamanho;
- quantidade;
- valor;
- desconto, se houver;
- forma de pagamento;
- canal de venda;
- vendedora responsável;
- status do pagamento;
- observações.

Canais de venda possíveis:

- loja física;
- WhatsApp;
- Instagram;
- evento;
- indicação;
- sacoleira;
- nova loja.

Formas de pagamento possíveis:

- dinheiro;
- Pix;
- cartão;
- crediário;
- transferência;
- link de pagamento;
- outro.

Status do pagamento:

- pago;
- parcial;
- em aberto.

Venda confirmada deve baixar estoque automaticamente.

Venda em aberto também deve baixar estoque, mas deve entrar em contas a receber.

---

### Condicional

O sistema deve ter controle de peças enviadas para cliente ver em casa.

O módulo de condicional deve registrar:

- cliente;
- data de retirada;
- peças enviadas;
- quantidade;
- valor total;
- prazo combinado para devolução/acerto;
- peças vendidas;
- peças devolvidas;
- saldo em aberto;
- status;
- observações.

Status possíveis:

- em aberto;
- vendido parcial;
- devolvido;
- atrasado;
- finalizado.

Regra importante:

Peça em condicional não é venda. Só vira venda quando a cliente confirma que ficou com a peça.

---

### Sacoleiras / revendedoras

O sistema deve controlar peças enviadas para sacoleiras ou revendedoras.

O módulo deve registrar:

- sacoleira/revendedora;
- data de retirada;
- peças retiradas;
- valor total das peças;
- peças vendidas;
- peças devolvidas;
- valor recebido;
- saldo em aberto;
- prazo de acerto;
- histórico de acertos;
- observações.

Regra importante:

Peça com sacoleira/revendedora não é venda até o acerto.

---

### Contas a receber

O sistema deve mostrar quem deve à EDREN.

Deve permitir visualizar:

- cliente;
- valor total da compra;
- valor já pago;
- saldo restante;
- data da compra;
- última data de pagamento;
- status;
- observações.

Status possíveis:

- em aberto;
- parcial;
- pago;
- atrasado.

O sistema deve permitir consultar rapidamente quem está devendo e quanto falta receber.

---

### Despesas básicas

O sistema deve permitir registrar despesas básicas.

Campos sugeridos:

- data;
- descrição;
- categoria;
- valor;
- forma de pagamento;
- observações.

Categorias iniciais:

- aluguel;
- energia;
- salários;
- comissão;
- tecidos;
- aviamentos;
- embalagem;
- marketing;
- fotos;
- eventos;
- sistema;
- outros.

---

### Comissão de vendedora

O sistema deve permitir controle simples de comissão.

Deve registrar:

- vendedora;
- vendas vinculadas;
- valor vendido;
- valor pago;
- comissão;
- período;
- status.

Regra preferencial:

Comissão deve ser calculada sobre venda paga, não apenas sobre venda lançada.

---

### Relatórios simples

A V1 deve incluir relatórios simples e úteis.

Relatórios obrigatórios:

- vendas do dia;
- vendas do mês;
- contas a receber;
- estoque disponível;
- estoque por local;
- vendas por coleção;
- vendas por vendedora;
- vendas por canal;
- despesas do período.

O foco é clareza, não gráficos avançados.

---

### Usuários e permissões

O sistema deve ter login e controle básico de permissões.

Perfis iniciais sugeridos:

- administrador;
- gerente;
- vendedora;
- operador.

Permissões importantes:

- nem todo usuário pode ver financeiro completo;
- nem todo usuário pode alterar preços;
- nem todo usuário pode apagar vendas;
- nem todo usuário pode alterar estoque;
- ações importantes devem ser rastreáveis quando possível.

---

# 6. O que fica explicitamente fora da primeira versão?

Fora do escopo da V1:

- loja virtual pública/e-commerce;
- integração automática com WhatsApp;
- emissão de nota fiscal;
- integração com meios de pagamento;
- aplicativo mobile nativo;
- controle de produção muito detalhado por etapa industrial;
- inteligência artificial dentro do sistema;
- dashboard avançado com muitos gráficos;
- integração com Instagram ou redes sociais;
- módulo complexo de contabilidade;
- controle fiscal completo;
- automação de marketing;
- sistema de pedidos online para clientes finais;
- integração com código de barras na primeira entrega;
- integração com impressora de etiquetas na primeira entrega.

Esses itens podem ser considerados em fases futuras, depois que o sistema básico estiver funcionando bem.

---

# 7. Stack definida

A stack definida para o projeto é:

- Frontend: Vite com TypeScript e Tailwind CSS.
- Backend: Fastify.
- Banco de dados: PostgreSQL.
- ORM: Prisma.
- Autenticação: autenticação própria simples com login e senha.
- Upload de imagens: Cloudinary.
- Deploy: VPS própria com Nginx, Fastify via PM2 e Cloudflared Tunnel já configurado.
- Exposição da API: a API não terá domínio público próprio; será acessada pelo frontend via rota `/api` configurada no Nginx.
- Estrutura do projeto: monorepo contendo frontend, backend, banco, documentação, especificações e contexto do projeto.
- Gerenciador de pacotes: npm.
- Workspaces: npm workspaces.
- Versionamento: Git/GitHub.
- Gerenciamento de processos: PM2.
- Servidor web/reverse proxy: Nginx.
- Backups: backups automáticos do banco de dados.
- Layout: responsivo para funcionar bem no computador e no celular.

---

# 8. Arquitetura de deploy

O projeto será hospedado em uma única VPS.

O frontend será buildado com Vite e servido diretamente pelo Nginx.

O backend Fastify será executado via PM2, escutando apenas localmente na VPS, por exemplo em `127.0.0.1`, sem exposição pública direta.

A API não terá uma URL pública separada. Ela será consumida pelo frontend por meio do próprio Nginx, usando proxy reverso em uma rota como `/api`.

Exemplo conceitual em produção:

- Frontend público: `https://sistema.edren.com.br`
- API consumida pelo frontend: `https://sistema.edren.com.br/api`
- Fastify interno: `127.0.0.1:3001`
- Banco de produção: `edren_prod`

Exemplo conceitual em desenvolvimento:

- Frontend dev: `https://dev-sistema.edren.com.br`
- API dev consumida pelo frontend: `https://dev-sistema.edren.com.br/api`
- Fastify dev interno: `127.0.0.1:3002`
- Banco de desenvolvimento: `edren_dev`

O Nginx será responsável por:

- servir os arquivos estáticos do frontend;
- encaminhar chamadas iniciadas por `/api` para o backend Fastify correspondente;
- separar produção e desenvolvimento por domínio/subdomínio;
- aplicar HTTPS por meio da configuração existente com Cloudflared Tunnel.

A API não deve ser acessível diretamente por domínio público próprio, como `api.edren.com.br`.

Essa decisão reduz exposição externa, simplifica o deploy e mantém o backend protegido dentro da VPS.

---

# 9. Separação entre desenvolvimento e produção

A separação entre desenvolvimento e produção será lógica, não física.

Na primeira versão, tudo ficará na mesma VPS, mas com isolamento por:

- URL;
- banco de dados;
- variáveis de ambiente;
- processos PM2;
- configuração de Nginx;
- credenciais;
- pastas ou presets separados no Cloudinary, se necessário.

A separação deve permitir testar alterações no ambiente de desenvolvimento antes de publicar em produção.

Exemplo conceitual:

Produção:

- URL: `https://sistema.edren.com.br`
- Banco: `edren_prod`
- Processo PM2: `edren-api-prod`
- Porta interna: `3001`

Desenvolvimento:

- URL: `https://dev-sistema.edren.com.br`
- Banco: `edren_dev`
- Processo PM2: `edren-api-dev`
- Porta interna: `3002`

Essa abordagem reduz custo, aproveita a infraestrutura já existente e mantém uma separação suficiente para a primeira fase do projeto.

---

# 10. Estrutura do monorepo

O projeto deve ser organizado em monorepo para manter todo o código e contexto do sistema no mesmo repositório.

Gerenciador de pacotes definido:

- npm

O projeto deve usar npm workspaces para organizar frontend, backend e pacotes compartilhados.

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
│       └── PROJECT.md    # Brief e especificações do projeto
│
├── docs/                 # Documentação técnica e decisões do projeto
├── scripts/              # Scripts de deploy, backup e manutenção
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

# 11. Estratégia de frontend

O frontend deve ser construído com:

- Vite;
- TypeScript;
- Tailwind CSS.

Diretrizes:

- interface simples;
- telas objetivas;
- poucos cliques;
- responsivo para computador e celular;
- foco em uso real na rotina da loja;
- componentes reutilizáveis;
- formulários claros;
- tabelas fáceis de filtrar;
- busca por referência, cliente, coleção e produto.

Telas principais da V1:

- login;
- painel inicial;
- produtos;
- coleções;
- estoque;
- entrada de estoque;
- vendas;
- clientes;
- condicional;
- sacoleiras;
- contas a receber;
- despesas;
- comissões;
- relatórios;
- usuários/configurações.

---

# 12. Estratégia de backend

O backend deve ser construído com Fastify.

Responsabilidades do backend:

- autenticação;
- controle de sessões/tokens;
- regras de negócio;
- CRUD de produtos;
- CRUD de clientes;
- controle de estoque;
- registro de vendas;
- controle de condicional;
- controle de sacoleiras;
- contas a receber;
- despesas;
- comissões;
- relatórios;
- integração com Cloudinary;
- integração com PostgreSQL via Prisma.

A API deve ser interna, acessada pelo frontend através do Nginx na rota `/api`.

O Fastify deve rodar localmente na VPS via PM2.

---

# 13. Banco de dados

Banco definido:

- PostgreSQL.

ORM definido:

- Prisma.

O banco deve ser modelado considerando as entidades principais:

- usuários;
- clientes;
- produtos;
- coleções;
- categorias;
- cores;
- tamanhos;
- locais de estoque;
- movimentações de estoque;
- vendas;
- itens de venda;
- pagamentos;
- contas a receber;
- condicionais;
- itens de condicional;
- sacoleiras/revendedoras;
- acertos de sacoleiras;
- despesas;
- comissões;
- imagens de produtos.

É importante que o histórico de movimentações de estoque seja preservado.

O sistema deve evitar simplesmente alterar quantidades sem registrar o motivo da movimentação.

---

# 14. Upload de imagens

Na primeira versão, as imagens dos produtos/peças serão enviadas para o Cloudinary.

O banco de dados deve armazenar informações como:

- URL da imagem;
- public_id do Cloudinary;
- data de envio;
- vínculo com produto/peça correspondente;
- indicação de imagem principal, se necessário.

O sistema não deve depender de armazenamento local na VPS para imagens de produtos.

Se possível, separar imagens de desenvolvimento e produção por pastas/prefixos no Cloudinary.

Exemplo:

- `edren/prod/produtos/...`
- `edren/dev/produtos/...`

---

# 15. Regras de negócio essenciais

O sistema precisa respeitar estas regras:

- Peça em condicional não é venda.
- Peça com sacoleira/revendedora não é venda até o acerto.
- Venda confirmada deve baixar estoque.
- Venda em aberto deve baixar estoque, mas entrar em contas a receber.
- Devolução deve devolver a peça ao estoque.
- Troca deve registrar a peça devolvida e a nova peça entregue.
- Comissão de vendedora deve considerar, preferencialmente, vendas pagas.
- Estoque precisa ser controlado por referência, cor, tamanho e local.
- Cada venda deve estar vinculada a uma cliente, uma forma de pagamento, um canal e, quando houver, uma vendedora.
- Cada produto deve estar vinculado a uma coleção.
- O sistema deve permitir saber onde está cada peça.
- O sistema deve permitir saber quanto cada cliente deve.
- O sistema deve permitir saber quanto foi vendido por dia, mês, coleção, canal e vendedora.
- O sistema deve permitir separar Casa EDREN e nova loja.
- O sistema deve preservar histórico de movimentações importantes.
- A exclusão de dados importantes deve ser evitada ou restrita.

---

# 16. Painel inicial

O painel inicial da V1 deve mostrar informações simples e úteis.

Sugestões:

- vendas do dia;
- vendas do mês;
- valor a receber;
- condicionais em aberto;
- condicionais atrasados;
- estoque disponível;
- peças com sacoleiras;
- despesas do mês;
- comissão estimada;
- alertas importantes.

O painel deve ser prático, não excessivamente visual.

---

# 17. Relatórios da V1

Relatórios necessários:

## Vendas

- vendas por dia;
- vendas por mês;
- vendas por período;
- vendas por coleção;
- vendas por canal;
- vendas por vendedora;
- vendas por forma de pagamento.

## Estoque

- estoque disponível;
- estoque por local;
- estoque por coleção;
- estoque por referência;
- peças com sacoleiras;
- peças em condicional;
- peças paradas, se possível.

## Financeiro básico

- total vendido;
- total recebido;
- total em aberto;
- despesas por período;
- contas a receber;
- saldo estimado.

## Clientes

- clientes com saldo em aberto;
- clientes com condicional em aberto;
- clientes por tipo;
- histórico de compras por cliente.

---

# 18. Segurança e permissões

O sistema deve ter autenticação com login e senha.

Requisitos básicos:

- senhas armazenadas com hash seguro;
- controle de sessão/token;
- permissões por tipo de usuário;
- rotas protegidas;
- API não exposta publicamente;
- validação de dados no backend;
- logs básicos de erros.

Perfis sugeridos:

- administrador;
- gerente;
- vendedora;
- operador.

Permissões devem considerar:

- acesso ao financeiro;
- alteração de estoque;
- cadastro de produtos;
- registro de vendas;
- exclusão/cancelamento de vendas;
- gestão de usuários;
- visualização de relatórios.

---

# 19. Backups e manutenção

O sistema deve prever backups automáticos do PostgreSQL.

Requisitos:

- backup automático do banco de produção;
- armazenamento seguro do backup;
- documentação de como restaurar backup;
- cuidado para não sobrescrever produção com dados de desenvolvimento;
- variáveis de ambiente separadas;
- logs básicos para diagnóstico.

Na primeira versão, não é necessário ter uma tela de backup no sistema. Pode ser feito por script na VPS.

---

# 20. Decisões importantes

Decisões já definidas:

- O sistema será interno, não público.
- O frontend será em Vite com TypeScript e Tailwind CSS.
- O backend será em Fastify.
- O banco será PostgreSQL.
- O ORM será Prisma.
- As imagens serão armazenadas no Cloudinary.
- O deploy será em uma única VPS.
- O frontend será servido pelo Nginx.
- O Fastify rodará via PM2.
- A API não terá domínio público próprio.
- O frontend consumirá a API via `/api` pelo Nginx.
- Desenvolvimento e produção ficarão na mesma VPS, mas com separação lógica.
- O projeto será organizado em monorepo.
- O projeto usará npm e npm workspaces.
- A V1 deve ser simples, funcional e evolutiva.

---

# 21. Tecnologias e abordagens a evitar

Evitar na primeira versão:

- pnpm;
- yarn;
- microsserviços;
- arquitetura exagerada;
- dependência de muitas APIs pagas;
- excesso de gráficos;
- telas complexas;
- e-commerce;
- integração com WhatsApp;
- integração com Instagram;
- nota fiscal;
- gateway de pagamento;
- aplicativo mobile nativo;
- sistema fiscal/contábil completo;
- funcionalidades que atrasem a entrega do básico.

---

# 22. Prioridade de desenvolvimento

Ordem sugerida para desenvolver a V1:

1. Estrutura do monorepo.
2. Configuração do npm workspaces.
3. Configuração do banco PostgreSQL.
4. Configuração do Prisma.
5. Configuração do Fastify.
6. Configuração do Vite + Tailwind.
7. Autenticação básica.
8. Cadastro de usuários.
9. Cadastro de coleções.
10. Cadastro de produtos.
11. Upload de imagem para Cloudinary.
12. Cadastro de clientes.
13. Locais de estoque.
14. Entrada de estoque.
15. Movimentação de estoque.
16. Registro de vendas.
17. Baixa automática de estoque.
18. Contas a receber.
19. Condicional.
20. Sacoleiras/revendedoras.
21. Despesas.
22. Comissão simples.
23. Relatórios básicos.
24. Deploy dev.
25. Deploy prod.
26. Documentação inicial.

---

# 23. Frase guia do projeto

O sistema EDREN deve acompanhar a vida da peça: da coleção e entrada no estoque até venda, condicional, sacoleira, devolução, pagamento e resultado.

A prioridade não é criar um sistema grande.

A prioridade é criar um sistema simples, confiável e realmente útil para a rotina da EDREN.
