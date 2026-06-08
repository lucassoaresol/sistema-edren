# Decisões Finais — Especificação Oficial EDREN

Este documento fecha as últimas decisões práticas antes da consolidação da especificação oficial do projeto EDREN.

O objetivo é transformar a revisão final em decisões objetivas para orientar a criação de:

- `.specs/project/PROJECT.md`
- `.specs/project/ROADMAP.md`
- monorepo inicial do projeto

---

# 1. Condicional e sacoleira no MVP

## Decisão recomendada para o MVP

Condicional e sacoleira entram no MVP apenas como **movimentações de estoque com responsável**.

Não entram ainda como módulos completos.

## Justificativa curta

A EDREN precisa saber quando uma peça saiu do estoque disponível e está com uma cliente ou sacoleira, mesmo que ainda não tenha virado venda.

Se isso ficar totalmente para fase 2, o estoque do MVP já nasce incompleto para a realidade da empresa.

## Regra para MVP

O sistema deve permitir movimentações como:

- envio para condicional;
- retorno de condicional;
- envio para sacoleira;
- retorno de sacoleira.

Essas movimentações devem ter vínculo com:

- cliente, no caso de condicional;
- cliente/sacoleira, no caso de sacoleira.

## Fica para fase futura

- tela completa de condicional;
- controle de prazo de devolução;
- alertas de atraso;
- acerto detalhado de sacoleira;
- histórico completo por sacoleira;
- relatórios específicos de condicional e sacoleira.

---

# 2. Seeds iniciais

## Decisão recomendada para o MVP

O sistema deve nascer com seeds básicas para facilitar o primeiro uso, mas tudo deve continuar editável/cadastrável.

## Seeds recomendadas

### Perfis de usuário

- Administrador
- Gerente
- Vendedor/Operador

### Grade de tamanho inicial

Criar uma grade padrão:

**Grade Feminina P ao GG**

Tamanhos:

- P
- M
- G
- GG

A estrutura deve permitir criar outras grades depois.

### Categorias iniciais

- Vestido
- Blusa
- Calça
- Saia
- Short
- Macacão
- Conjunto
- Outros

### Cores iniciais

- Preto
- Branco
- Off White
- Azul
- Verde
- Vermelho
- Rosa
- Amarelo
- Bege
- Marrom
- Estampado
- Xadrez
- Outros

### Locais de estoque iniciais

- Casa EDREN
- Fábrica
- Nova Loja

Observação: a nova loja pode nascer cadastrada, mas com status ativo/inativo conforme decisão operacional.

### Canais de venda iniciais

- Loja física
- WhatsApp
- Instagram
- Evento
- Indicação
- Nova Loja
- Sacoleira
- Outros

### Formas de pagamento iniciais

- Dinheiro
- Pix
- Cartão
- Crediário
- Transferência
- Link de pagamento
- Outro

## Justificativa curta

Seeds evitam que o sistema comece vazio demais, mas como tudo será cadastrável, a EDREN poderá ajustar depois sem alterar código.

## Fica para fase futura

- importação em massa de cadastros;
- telas avançadas de configuração;
- regras específicas por forma de pagamento.

---

# 3. Custo do produto

## Decisão recomendada para o MVP

O custo do produto deve ser **opcional** na V1.

## Justificativa curta

Obrigar custo pode travar o cadastro de produtos quando a EDREN ainda não tiver o custo fechado. Como o foco do MVP é operação, estoque e venda, o custo não deve impedir uso do sistema.

## Regra para MVP

O produto pode ser cadastrado sem custo.

Se o custo for informado, o sistema armazena.

## Fica para fase futura

- margem de lucro;
- resultado por coleção;
- relatório de lucratividade;
- custo detalhado por produção;
- composição de custo com tecido, aviamentos, mão de obra etc.

---

# 4. Exclusão, cancelamento e inativação

## Decisão recomendada para o MVP

O sistema deve evitar exclusão física de registros importantes.

## Regras por entidade

### Vendas

Não devem ser excluídas fisicamente.

Devem poder ser:

- ativas;
- canceladas.

### Pagamentos

Não devem ser excluídos fisicamente depois de registrados em uma venda.

Devem poder ser:

- ativos;
- estornados/cancelados.

### Movimentações de estoque

Não devem ser excluídas fisicamente.

Devem ser corrigidas por movimentação inversa ou cancelamento controlado.

### Produtos/SKUs

Se tiverem histórico, devem ser apenas inativados.

Se não tiverem nenhum histórico, podem ser excluídos.

### Clientes

Se tiverem histórico de venda, pagamento, condicional ou movimentação, devem ser inativados.

Se não tiverem histórico, podem ser excluídos.

### Usuários

Usuários devem ser inativados.

Não devem ser apagados se tiverem criado vendas, pagamentos ou movimentações.

## Justificativa curta

Vendas, pagamentos e estoque precisam de rastreabilidade. Apagar registros pode quebrar histórico, relatórios e contas a receber.

## Fica para fase futura

- auditoria completa;
- log detalhado de alterações;
- permissões avançadas para cancelamento;
- histórico visual de alterações.

---

# 5. Cancelamento de venda no MVP

## Decisão recomendada para o MVP

Sim, o MVP deve incluir cancelamento simples de venda inteira com retorno automático ao estoque.

## Justificativa curta

Se uma venda baixa estoque, o sistema precisa ter uma forma segura de desfazer erro sem apagar histórico.

## Regra para MVP

Ao cancelar uma venda:

- a venda muda para status cancelada;
- os itens voltam ao estoque de origem ou ao local definido;
- os pagamentos vinculados devem ser estornados/cancelados;
- a conta a receber deixa de considerar aquela venda;
- deve ser obrigatório informar motivo do cancelamento.

## Fica para fase futura

- cancelamento parcial de itens;
- troca;
- devolução parcial;
- crédito para cliente;
- diferença de valor entre peças.

---

# 6. Pagamento registrado errado

## Decisão recomendada para o MVP

Pagamento registrado errado deve ser **estornado/cancelado**, não excluído.

## Justificativa curta

Como contas a receber dependem dos pagamentos registrados, apagar pagamento pode confundir o histórico financeiro.

## Regra para MVP

Pagamento deve ter status:

- ativo;
- estornado/cancelado.

Ao estornar um pagamento:

- o valor deixa de contar como recebido;
- o saldo da venda é recalculado;
- deve ser obrigatório informar motivo;
- o registro original permanece no histórico.

## Fica para fase futura

- estorno parcial;
- conciliação financeira;
- integração com meios de pagamento;
- controle de caixa mais completo.

---

# 7. Cliente obrigatório na venda

## Decisão recomendada para o MVP

Permitir venda com cliente genérico chamado **Cliente Balcão**.

## Justificativa curta

Na rotina de loja, pode haver venda rápida sem necessidade de cadastro detalhado. Obrigar cliente real em toda venda pode deixar o atendimento lento.

## Regra para MVP

O sistema deve criar via seed um cliente padrão:

**Cliente Balcão**

Esse cliente pode ser usado apenas em vendas totalmente pagas, sem saldo em aberto.

## Fica para fase futura

- cadastro rápido de cliente na tela de venda;
- identificação por telefone;
- histórico avançado de cliente;
- régua de relacionamento.

---

# 8. Venda com saldo em aberto

## Decisão recomendada para o MVP

Toda venda com saldo em aberto deve exigir cliente real cadastrado.

## Justificativa curta

Se existe valor a receber, a EDREN precisa saber exatamente quem deve.

## Regra para MVP

Se a venda tiver saldo em aberto:

- não pode usar Cliente Balcão;
- deve exigir cliente real;
- deve salvar esse saldo em contas a receber calculadas.

## Fica para fase futura

- vencimento combinado;
- cobrança;
- parcelas formais;
- alertas de atraso;
- histórico de mensagens.

---

# 9. Referência/código comercial

## Decisão recomendada para o MVP

A referência/código comercial deve pertencer ao **Produto**, não ao SKU.

## Justificativa curta

Na realidade da EDREN, a referência identifica o modelo. As variações são cor e tamanho.

## Exemplo

Produto:

- Vestido Luar
- Referência: VL001

SKUs:

- VL001 / Azul / P
- VL001 / Azul / M
- VL001 / Verde / P
- VL001 / Verde / M

## Regra para MVP

SKU deve ser identificado por:

- produto;
- referência do produto;
- cor;
- tamanho.

## Fica para fase futura

- código de barras por SKU;
- código interno por variação;
- etiqueta por SKU;
- rastreamento individual por unidade.

---

# 10. Imagens do produto

## Decisão recomendada para o MVP

O modelo deve permitir várias imagens por produto, mas a interface inicial pode começar com apenas uma imagem principal.

## Justificativa curta

Modelar várias imagens desde o início evita retrabalho no banco. Mas a tela pode ser simples para não aumentar o escopo.

## Regra para MVP

Criar entidade `ProductImage`.

Campos sugeridos:

- productId;
- url;
- publicId;
- isMain;
- order;
- createdAt.

Na interface inicial:

- permitir upload de uma imagem principal;
- preparar estrutura para múltiplas imagens no futuro.

## Fica para fase futura

- galeria completa;
- reordenação de imagens;
- múltiplos uploads;
- imagem por cor/SKU;
- remoção avançada de imagem no Cloudinary.

---

# 11. Relatórios mínimos

## Decisão recomendada para o MVP

Sim, relatórios mínimos podem ser telas simples com filtros e totais.

Não precisa de gráficos, dashboard avançado ou exportação na V1.

## Justificativa curta

O objetivo inicial é consulta e clareza operacional, não visualização avançada.

## Relatórios mínimos da V1

- vendas por período;
- vendas do dia;
- vendas do mês;
- estoque por produto/SKU;
- estoque por local;
- contas a receber;
- clientes com saldo em aberto;
- vendas por coleção;
- vendas por canal.

## Fica para fase futura

- gráficos;
- exportação CSV/PDF;
- dashboard visual;
- comparativos mensais;
- metas;
- relatórios de margem;
- relatórios de comissão.

---

# 12. Backup

## Decisão recomendada para o MVP

Backup não deve bloquear o desenvolvimento inicial.

No MVP, deve ser documentado e preparado para a etapa de deploy.

Quando chegar na etapa da VPS, criar scripts básicos no repositório.

## Justificativa curta

Antes do deploy real, o foco deve ser construir a aplicação. O backup se torna crítico quando houver banco de produção.

## Regra para MVP

Durante desenvolvimento local:

- documentar estratégia;
- não bloquear desenvolvimento.

Na etapa de deploy:

- criar script básico de backup do PostgreSQL;
- documentar como executar;
- documentar como restaurar;
- garantir que o backup seja do banco de produção correto.

## Fica para fase futura

- backup automático agendado;
- envio para armazenamento externo;
- tela administrativa de backup;
- alerta de falha de backup.

---

# Decisões finais para especificação oficial

- O MVP deve ser menor e focado no núcleo operacional.
- Peça na V1 significa SKU/variação com quantidade, não unidade individual.
- Estoque será controlado por SKU e local.
- Condicional e sacoleira entram no MVP apenas como movimentações de estoque com responsável.
- Módulos completos de condicional e sacoleira ficam para fase 2.
- O sistema terá cadastros configuráveis para grades, categorias, cores, locais, canais e formas de pagamento.
- Seeds iniciais devem criar perfis, grade padrão, categorias, cores, locais, canais, formas de pagamento e Cliente Balcão.
- Custo do produto será opcional na V1.
- Vendas não devem ser apagadas; devem ser canceladas.
- Pagamentos não devem ser apagados; devem ser estornados/cancelados.
- Movimentações de estoque não devem ser apagadas; devem ser corrigidas por movimentação inversa ou cancelamento controlado.
- Produtos/SKUs com histórico devem ser inativados, não excluídos.
- Clientes com histórico devem ser inativados, não excluídos.
- Usuários devem ser inativados, não excluídos.
- O MVP deve incluir cancelamento simples de venda inteira com retorno automático ao estoque.
- Pagamento errado deve ser estornado/cancelado com motivo.
- Venda rápida pode usar Cliente Balcão.
- Venda com saldo em aberto exige cliente real cadastrado.
- Referência/código comercial pertence ao Produto.
- SKU é identificado por produto + cor + tamanho.
- O modelo deve permitir várias imagens por produto.
- A interface inicial pode começar com uma imagem principal.
- Relatórios da V1 serão telas simples com filtros e totais.
- Não haverá gráficos nem exportação no MVP.
- Backup deve ser documentado inicialmente e virar script básico na etapa de deploy.
- Desenvolvimento pode começar localmente.
- Dev publicado na VPS não é obrigatório no início.
- Stack permanece: Vite, TypeScript, Tailwind, Fastify, PostgreSQL, Prisma, npm workspaces, Cloudinary.
- API não será exposta publicamente; será consumida pelo frontend via `/api` pelo Nginx.
- Deploy será em VPS com Nginx, PM2 e Cloudflared Tunnel.
