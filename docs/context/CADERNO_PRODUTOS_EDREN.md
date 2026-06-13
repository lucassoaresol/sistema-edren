# Contexto — Caderno de Produtos e Cadastro de Referência EDREN

Este documento registra o entendimento operacional sobre o caderno de produtos da EDREN e o que a proprietária espera ao levar esse fluxo para o sistema.

O objetivo deste arquivo não é definir a spec técnica final.

O objetivo é dar contexto ao desenvolvedor para que ele entenda a rotina real da EDREN antes de propor a melhor solução de tela, banco, fluxo e implementação.

---

# 1. Situação atual

Hoje a EDREN usa um caderno físico para registrar o desenvolvimento das peças.

Esse caderno não é apenas uma lista de produtos prontos. Ele reúne, na mesma página, informações que fazem parte do nascimento da peça.

Em uma página típica aparecem:

- referência da peça;
- croqui/desenho feito à mão;
- tecido usado;
- metragem;
- forro;
- zíper;
- botões;
- alça ou outros detalhes;
- costura;
- mão de obra;
- plaquinha;
- tag;
- cálculo de custo;
- observações da peça.

Esse registro é feito de forma manual, com escrita e cálculo no próprio caderno.

---

# 2. Ponto importante: croqui não é foto do produto

A foto enviada como exemplo representa o croqui da peça, não a foto do produto pronto.

Na rotina da EDREN, o croqui pertence ao momento de criação e desenvolvimento.

A foto do produto pronto pertence a outro momento, quando a peça já está costurada, aprovada e pronta para venda, divulgação ou catálogo.

Portanto, o sistema precisa considerar que existem imagens com funções diferentes:

- croqui ou desenho da peça;
- foto do produto pronto;
- foto na modelo;
- foto de detalhe, quando existir.

Não é ideal tratar tudo apenas como uma única “imagem principal”, porque isso não representa bem a forma como a EDREN cria e vende seus produtos.

---

# 3. O que a Gracinha quer resolver

A intenção não é transformar o caderno em uma tela cheia de campos para preencher.

A intenção é que o sistema seja mais fácil, mais rápido e mais organizado do que escrever no caderno.

Se o sistema exigir muitos campos obrigatórios no início, ele pode ficar mais lento do que o processo manual.

O desejo principal é:

> criar e organizar uma referência no sistema com menos esforço do que no caderno físico.

O sistema deve ajudar a reduzir digitação, evitar contas manuais e permitir que as informações sejam completadas aos poucos.

---

# 4. Diferença entre criação da peça e produto comercial

O fluxo real da EDREN pode ser entendido em dois momentos diferentes.

## 4.1. Momento de criação/desenvolvimento

Neste momento a peça ainda está nascendo.

Podem existir:

- croqui;
- ideia de modelo;
- escolha de tecido;
- metragem aproximada;
- aviamentos;
- custo em construção;
- observações de modelagem e acabamento.

Nem sempre já existe:

- foto do produto pronto;
- nome comercial definitivo;
- grade completa;
- estoque lançado;
- material de venda.

## 4.2. Momento de produto pronto/comercial

Neste momento a peça já pode ser tratada como produto para venda.

Aqui entram informações como:

- nome final da peça;
- preço de venda;
- preço de atacado ou regra comercial;
- coleção;
- categoria;
- cor;
- tamanho;
- SKUs;
- estoque;
- foto pronta;
- foto na modelo.

A tela atual de produto parece atender melhor esse segundo momento, mas ainda não substitui completamente o caderno de criação.

---

# 5. Expectativa para o sistema

A expectativa é que o sistema permita registrar a referência de forma simples e evolutiva.

O cadastro inicial não deve obrigar que tudo esteja pronto.

Seria importante permitir:

- criar uma referência com dados mínimos;
- anexar o croqui ou foto do desenho;
- salvar a peça mesmo incompleta;
- completar informações depois;
- diferenciar croqui de foto do produto pronto;
- registrar materiais e custos de forma simples;
- calcular automaticamente o custo total quando os itens forem informados;
- reaproveitar custos ou itens comuns quando possível;
- não exigir que a usuária repita informações que poderiam ser automáticas.

A ideia central é preservar a forma criativa da EDREN, mas tirar do caderno aquilo que pode ser organizado, calculado e reaproveitado pelo sistema.

---

# 6. Exemplo prático vindo do caderno

No exemplo analisado, a página mostra uma referência com croqui e uma lista de itens de custo.

A página não representa apenas um produto cadastrado para venda.

Ela representa o raciocínio da criação da peça:

- qual é a referência;
- qual é o desenho/modelo;
- quais materiais entram na peça;
- quais serviços e acabamentos entram no custo;
- quanto a peça custa para produzir.

Hoje essa conta é feita manualmente.

No sistema, a expectativa é que a usuária informe os itens principais e o sistema ajude no cálculo, sem transformar isso em uma tela pesada.

---

# 7. Cuidado importante para o desenvolvimento

A solução não deve partir da ideia de que “produto” é apenas uma mercadoria pronta.

Na EDREN, o produto nasce dentro da confecção.

Antes de virar item comercial, ele passa por criação, desenho, escolha de tecido, custo, piloto, corte e produção.

Por isso, a tela de produto precisa respeitar essa realidade ou ser acompanhada por uma etapa anterior de criação/referência.

O desenvolvedor deve avaliar a melhor forma de resolver isso tecnicamente, mas o contexto operacional é este:

> o sistema precisa acompanhar o nascimento da peça, e não apenas cadastrar a peça depois de pronta.

---

# 8. Pontos para o desenvolvedor considerar

Este documento não fecha a solução técnica, mas levanta pontos que devem ser considerados na futura spec:

- Como permitir o cadastro rápido de uma nova referência?
- Quais campos devem ser obrigatórios no primeiro momento?
- Onde deve entrar a foto do croqui?
- Como separar croqui, foto pronta e foto na modelo?
- A tela atual de produto deve receber abas ou deve existir uma tela anterior de criação?
- Como registrar custos sem deixar o preenchimento pesado?
- Quais custos podem ser reaproveitados ou sugeridos automaticamente?
- Como permitir que a referência seja salva incompleta e completada depois?
- Como evitar que o sistema vire apenas uma cópia digital do caderno?

---

# 9. Direção desejada

A direção desejada é simples:

> o sistema deve ser mais rápido do que o caderno, sem tirar da EDREN sua forma natural de criar.

O caderno mostra a lógica da Gracinha como criadora e gestora da confecção.

A tela do sistema precisa respeitar essa lógica, mas organizar melhor as informações para que elas possam ser usadas depois em estoque, venda, custo, coleção e relatórios.

A spec técnica deve partir desse contexto.
