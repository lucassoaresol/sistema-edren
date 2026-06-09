# Perguntas Operacionais Para Refinar o Sistema EDREN

Use este documento para debater com uma LLM que tenha contexto sobre a rotina da EDREN.

O objetivo e esclarecer regras reais da empresa antes de avancar muito no banco, telas e fluxos do sistema.

Essas respostas devem orientar futuras especificacoes de features, principalmente produtos, estoque, vendas, clientes, contas a receber e permissoes.

## Perguntas Por Area

### 1. Produtos e colecoes

- Como nasce uma referencia?
- Uma referencia sempre pertence a uma unica colecao?
- A mesma peca/modelo pode voltar em outra colecao?
- Produto pode existir sem foto?
- Preco e por produto ou pode variar por tamanho/cor?
- Custo e por produto, por SKU ou por lote?

### 2. Estoque

- O estoque inicial sera digitado manualmente ou importado de planilha?
- A fabrica e estoque disponivel para venda ou apenas origem de entrada?
- A nova loja ja existe operacionalmente ou e futuro?
- Condicional/sacoleira devem sair de qual local de origem?
- Toda movimentacao precisa registrar motivo?
- Pode haver ajuste manual de estoque?

### 3. Vendas

- Venda pode ter desconto?
- Desconto e por item ou na venda inteira?
- Venda pode ter mais de uma forma de pagamento?
- Venda pode ser feita sem vendedora?
- Vendedora e usuaria do sistema ou cadastro separado?
- Existe venda por WhatsApp que alguem lanca depois?

### 4. Clientes

- Quais dados sao obrigatorios no cadastro?
- Telefone/WhatsApp deve ser unico?
- Cliente pode ser sacoleira e cliente final ao mesmo tempo?
- Precisa registrar cidade/bairro?
- Precisa registrar preferencias, tamanho usado ou observacoes?

### 5. Contas a receber

- Venda em aberto precisa de data combinada para pagamento?
- Pagamento parcial precisa de observacao?
- Quem pode marcar pagamento como recebido?
- Precisa ver historico de pagamentos por cliente?
- Existe limite de credito para cliente?

### 6. Cancelamentos e correcoes

- Quem pode cancelar venda?
- Cancelamento sempre volta para o mesmo local de estoque?
- Precisa registrar motivo obrigatorio?
- Pagamento estornado volta a deixar saldo em aberto?
- Pode cancelar venda de dias anteriores?

### 7. Usuarios e permissoes

- Quem serao os primeiros usuarios?
- Quais acoes so administrador pode fazer?
- Vendedor pode ver contas a receber?
- Vendedor pode ver custo?
- Vendedor pode alterar preco/desconto?

### 8. Relatorios

- Quais 3 relatorios sao indispensaveis no primeiro uso real?
- Relatorio precisa filtrar por vendedora?
- Relatorio precisa filtrar por colecao?
- Vendas por canal sao importantes desde o inicio?
- Precisa exportar para Excel no futuro?

### 9. Identidade visual e UX

- O sistema sera usado mais no computador ou celular?
- A loja usara tablet/celular para lancar venda?
- O uso principal sera rapido no balcao ou administrativo no fim do dia?
- Existe preferencia por menu lateral ou menu superior?
- A tela de venda precisa ser muito rapida?

### 10. Dados iniciais

- Quais colecoes ja devem nascer cadastradas?
- Quais locais de estoque estao ativos agora?
- Quais usuarios iniciais?
- Quais formas de pagamento realmente usadas hoje?
- Existe planilha atual para importar depois?

## Perguntas Prioritarias

Se for responder apenas o essencial, priorize estas perguntas:

1. Estoque inicial sera manual ou importado?
2. Preco varia por produto ou SKU?
3. Custo e por produto, SKU ou lote?
4. Venda pode ter desconto? Por item ou total?
5. Venda pode ter multiplas formas de pagamento?
6. Telefone do cliente deve ser obrigatorio e/ou unico?
7. Venda em aberto precisa de data combinada?
8. Quem pode cancelar venda?
9. Vendedor pode ver custo e financeiro?
10. O sistema sera usado mais no computador, celular ou ambos?

## Prompt Para Outra LLM

Copie e cole o texto abaixo no chat com a LLM que tem contexto sobre a EDREN:

```text
Estou refinando o sistema interno EDREN antes de avancar muito na modelagem do banco e nas telas.

Ja existe uma especificacao base: o MVP sera um sistema interno para produtos, colecoes, SKUs, estoque por local, clientes, vendas, pagamentos, contas a receber e relatorios simples.

Preciso que voce me ajude a responder as perguntas operacionais abaixo com foco na rotina real da EDREN. Nao precisa inventar complexidade. Se algo puder ficar para fase futura, diga isso claramente.

Responda em formato objetivo, separando:

- decisao recomendada para o MVP;
- justificativa curta;
- impacto no sistema;
- o que pode ficar para depois.

Perguntas:

1. Como nasce uma referencia? Uma referencia sempre pertence a uma unica colecao? A mesma peca/modelo pode voltar em outra colecao?

2. Produto pode existir sem foto? Preco e por produto ou pode variar por tamanho/cor? Custo e por produto, SKU ou lote?

3. O estoque inicial sera digitado manualmente ou importado de planilha? A fabrica e estoque disponivel para venda ou apenas origem de entrada? A nova loja ja existe operacionalmente ou e futuro?

4. Condicional/sacoleira devem sair de qual local de origem? Toda movimentacao precisa registrar motivo? Pode haver ajuste manual de estoque?

5. Venda pode ter desconto? Desconto e por item ou na venda inteira? Venda pode ter mais de uma forma de pagamento?

6. Venda pode ser feita sem vendedora? Vendedora e usuaria do sistema ou cadastro separado? Existe venda por WhatsApp que alguem lanca depois?

7. Quais dados do cliente sao obrigatorios? Telefone/WhatsApp deve ser unico? Cliente pode ser sacoleira e cliente final ao mesmo tempo?

8. Venda em aberto precisa de data combinada para pagamento? Pagamento parcial precisa de observacao? Quem pode marcar pagamento como recebido?

9. Quem pode cancelar venda? Cancelamento sempre volta para o mesmo local de estoque? Pagamento estornado volta a deixar saldo em aberto? Pode cancelar venda de dias anteriores?

10. Quais acoes so administrador pode fazer? Vendedor pode ver contas a receber? Vendedor pode ver custo? Vendedor pode alterar preco/desconto?

11. Quais 3 relatorios sao indispensaveis no primeiro uso real? Relatorios precisam filtrar por vendedora, colecao e canal? Exportacao para Excel fica para futuro?

12. O sistema sera usado mais no computador, celular ou ambos? O uso principal sera rapido no balcao ou administrativo no fim do dia? Melhor menu lateral ou superior?

13. Quais colecoes, locais de estoque, usuarios e formas de pagamento devem nascer cadastrados? Existe planilha atual para importar depois?

No final, gere uma secao chamada "Decisoes operacionais recomendadas para o MVP" com bullets curtos e diretos.
```
