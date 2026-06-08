# Guia de Identidade Visual — Sistema EDREN

Este guia deve orientar a implementação visual do sistema interno EDREN no frontend.

O objetivo não é anexar imagens nem recriar materiais gráficos da marca. O objetivo é transformar a identidade visual da EDREN em decisões práticas de interface: cores, tipografia, espaçamento, tom visual, componentes e cuidados de uso.

Este documento deve ser usado junto com:

- `.specs/project/PROJECT.md`
- `.specs/project/ROADMAP.md`
- especificações técnicas do MVP

---

# 1. Essência visual da EDREN

A EDREN deve transmitir uma estética:

- feminina;
- elegante;
- serena;
- sofisticada;
- acolhedora;
- moderna;
- leve;
- sem excessos.

A interface do sistema deve parecer uma extensão da marca, mas sem perder a clareza operacional necessária para um sistema interno.

A EDREN não deve parecer:

- pesada;
- tecnológica demais;
- escura demais;
- fria;
- genérica;
- infantilizada;
- exageradamente colorida.

A direção visual correta é:

> elegância suave, presença moderna e simplicidade acolhedora.

---

# 2. Paleta principal

A identidade visual da EDREN define duas cores principais:

## Marfim Brilhante

```text
#FFD699
```

Uso recomendado:

- cor de apoio;
- detalhes;
- destaques suaves;
- fundos delicados;
- badges;
- áreas de atenção leve;
- hover sutil;
- elementos decorativos.

Evitar usar o Marfim Brilhante como texto sobre fundo claro, pois pode perder legibilidade.

---

## Turquesa Acinzentado

```text
#294F40
```

Uso recomendado:

- cor principal da marca;
- botões primários;
- títulos;
- sidebar;
- textos importantes;
- ícones principais;
- bordas de destaque;
- estado ativo de navegação.

O Turquesa Acinzentado deve ser a cor de presença e autoridade da interface.

---

# 3. Paleta complementar para o sistema

Além das cores oficiais, o sistema precisa de tons neutros para fundo, cartões, bordas e textos.

Usar os tons abaixo como derivados funcionais da identidade EDREN.

```css
:root {
  --edren-green: #294F40;
  --edren-ivory: #FFD699;

  --edren-background: #FFF8ED;
  --edren-surface: #FFFCF6;
  --edren-surface-muted: #F6EAD8;

  --edren-text: #213D33;
  --edren-text-muted: #6F6558;

  --edren-border: rgba(41, 79, 64, 0.18);
  --edren-border-strong: rgba(41, 79, 64, 0.32);

  --edren-focus: #294F40;
}
```

## Regra visual

A interface deve ser predominantemente clara.

Evitar usar fundo escuro como base principal do sistema.

O verde pode ser usado em áreas fortes, como sidebar ou botão principal, mas o fundo geral deve ser claro, suave e acolhedor.

---

# 4. Tailwind CSS — tokens recomendados

Como o projeto usa Tailwind CSS, recomenda-se mapear as cores da marca como tokens.

Se o projeto estiver usando Tailwind v4, pode-se usar algo como:

```css
@import "tailwindcss";

@theme {
  --color-edren-green: #294F40;
  --color-edren-ivory: #FFD699;
  --color-edren-background: #FFF8ED;
  --color-edren-surface: #FFFCF6;
  --color-edren-muted: #F6EAD8;
  --color-edren-text: #213D33;
  --color-edren-text-muted: #6F6558;
  --color-edren-border: rgba(41, 79, 64, 0.18);
}
```

## Exemplo de uso

```tsx
<main className="min-h-screen bg-edren-background text-edren-text">
  <section className="rounded-2xl border border-edren-border bg-edren-surface">
    <h1 className="text-edren-green">EDREN</h1>
  </section>
</main>
```

---

# 5. Tipografia

A identidade visual da EDREN aponta:

- **Kenao Sans Serif** para títulos;
- **Julius Sans One** para corpo de texto.

## Decisão prática para o sistema

Como este é um sistema interno com tabelas, formulários e muitos dados, a legibilidade deve ser prioridade.

Recomendação:

### Títulos e elementos de marca

Usar, quando disponível:

```css
font-family: "Kenao Sans Serif", "Julius Sans One", serif;
```

Aplicar em:

- nome EDREN;
- telas de login;
- títulos institucionais;
- cabeçalhos especiais;
- chamadas curtas.

### Textos de interface e operação

Usar:

```css
font-family: "Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

Aplicar em:

- tabelas;
- formulários;
- botões;
- menus;
- filtros;
- textos longos;
- números;
- relatórios.

### Julius Sans One

Pode ser usada em:

- subtítulos curtos;
- labels especiais;
- navegação secundária;
- textos de marca;
- frases curtas.

Evitar usar Julius Sans One em tabelas densas ou textos operacionais longos, se prejudicar a leitura.

## Observação importante

Não incluir arquivos de fonte no repositório sem autorização.

Se a fonte Kenao Sans Serif não estiver disponível legalmente para uso no sistema, usar fallback elegante e manter a identidade principalmente por cores, espaçamento e composição.

---

# 6. Logo e assinatura

A assinatura principal da marca é:

```text
EDREN
VESTUÁRIO FEMININO
```

## Uso no sistema

Usar a marca em locais como:

- tela de login;
- topo/sidebar;
- rodapé discreto;
- páginas institucionais internas;
- futuros relatórios ou impressões.

## Regra importante

Não recriar símbolo, monograma ou ícone da EDREN manualmente no código.

Se o arquivo oficial da logo não estiver disponível no repositório, usar apenas texto:

```text
EDREN
VESTUÁRIO FEMININO
```

com tipografia, espaçamento e cores da marca.

Nunca usar símbolo diferente, ícone genérico ou logo improvisada.

---

# 7. Tom visual da interface

A interface deve seguir estes princípios:

## Leveza

Usar bastante respiro entre os elementos.

Evitar telas apertadas ou visual carregado.

## Sofisticação

Preferir:

- bordas finas;
- sombras sutis;
- cantos arredondados moderados;
- poucos elementos decorativos;
- hierarquia clara.

## Acolhimento

Usar fundos suaves, cards claros e linguagem visual humana.

O sistema deve parecer profissional, mas não frio.

## Modernidade

A interface deve ser atual, limpa e organizada.

Evitar aparência antiga de sistema administrativo pesado.

---

# 8. Componentes

## Botão primário

Uso:

- salvar;
- confirmar;
- entrar;
- finalizar venda;
- registrar pagamento.

Estilo recomendado:

```text
Fundo: #294F40
Texto: #FFFCF6 ou branco suave
Hover: verde levemente mais claro ou com opacidade
Borda: nenhuma ou verde mais escuro
```

Exemplo Tailwind:

```tsx
<Button className="bg-edren-green text-edren-surface hover:bg-edren-green/90">
  Salvar
</Button>
```

---

## Botão secundário

Uso:

- cancelar;
- voltar;
- limpar filtros;
- ações secundárias.

Estilo recomendado:

```text
Fundo: transparente ou superfície clara
Texto: #294F40
Borda: rgba(41, 79, 64, 0.22)
```

---

## Botão de atenção

Para ações perigosas como cancelar venda ou estornar pagamento, usar cor de sistema, mas com sobriedade.

Não usar vermelho vibrante em excesso.

Sugestão:

```text
Fundo: vermelho suave
Texto: vermelho escuro
Borda: vermelho discreto
```

---

## Cards

Cards devem ser claros e elegantes.

```text
Fundo: #FFFCF6
Borda: rgba(41, 79, 64, 0.18)
Sombra: muito sutil
Raio: 16px a 24px
```

---

## Inputs

Inputs devem ser simples e legíveis.

```text
Fundo: branco ou #FFFCF6
Borda: verde com baixa opacidade
Foco: #294F40
Texto: #213D33
Placeholder: #6F6558
```

---

## Tabelas

Tabelas precisam priorizar leitura.

Recomendação:

- cabeçalhos com fundo suave;
- linhas com bom espaçamento vertical;
- hover leve;
- texto escuro;
- números alinhados corretamente;
- ações discretas.

Evitar tabela com fundo escuro.

---

## Badges e status

Usar status visuais discretos.

Exemplos:

- Ativo: verde discreto;
- Inativo: cinza/bege;
- Pago: verde;
- Parcial: marfim/dourado suave;
- Em aberto: bege/âmbar suave;
- Cancelado: vermelho suave.

O visual deve ser claro, mas não agressivo.

---

# 9. Layout geral

## Tela de login

A tela de login pode ter mais presença de marca.

Sugestão:

- fundo `#FFF8ED`;
- card central claro;
- EDREN em destaque;
- subtítulo `VESTUÁRIO FEMININO`;
- botão principal verde;
- detalhes em Marfim Brilhante.

Evitar fundo preto ou aparência excessivamente tecnológica.

---

## Área interna

A área interna deve ser mais operacional.

Sugestão:

- sidebar ou header em verde EDREN;
- fundo geral claro;
- cards claros;
- textos em verde escuro;
- uso moderado do marfim.

---

## Navegação

A navegação deve ser simples.

Itens esperados:

- Painel;
- Produtos;
- Coleções;
- Clientes;
- Estoque;
- Vendas;
- Pagamentos;
- Relatórios;
- Configurações.

Estado ativo:

```text
Fundo: #FFD699 ou verde com opacidade baixa
Texto: #294F40
```

---

# 10. Iconografia

O sistema pode usar ícones simples, como os de `lucide-react`, mas com cuidado.

Regras:

- usar ícones finos;
- evitar ícones muito lúdicos;
- manter consistência de tamanho;
- usar verde EDREN ou texto suavizado;
- não usar ícones decorativos demais.

Ícones devem ajudar a identificar ações, não competir com a interface.

---

# 11. Linguagem visual de sistema

O sistema deve ter uma linguagem clara e humana.

Preferir textos como:

```text
Salvar produto
Registrar venda
Adicionar pagamento
Ver estoque
Cliente com saldo em aberto
Movimentar estoque
```

Evitar termos frios ou técnicos demais quando houver alternativa mais clara.

Exemplo:

Preferir:

```text
Saldo em aberto
```

em vez de:

```text
Inadimplência
```

Preferir:

```text
Cliente Balcão
```

em vez de:

```text
Consumidor não identificado
```

---

# 12. O que evitar

Evitar:

- fundo preto como padrão;
- tema escuro como identidade principal;
- amarelo muito forte substituindo o Marfim Brilhante;
- verde diferente do `#294F40`;
- excesso de dourado;
- excesso de flores;
- ícones genéricos como logo;
- recriar símbolo da EDREN manualmente;
- usar rosa como cor principal;
- telas com pouca área de respiro;
- excesso de sombras;
- botões grandes demais;
- estética de sistema financeiro frio;
- aparência de e-commerce genérico.

---

# 13. Acessibilidade e legibilidade

Mesmo sendo uma marca elegante e suave, o sistema precisa ser legível.

Regras:

- usar verde escuro para textos importantes;
- evitar texto marfim sobre fundo branco;
- garantir contraste em botões;
- usar fonte legível em tabelas e formulários;
- não usar espaçamento exagerado entre letras em textos longos;
- manter estados de foco visíveis;
- botões e campos devem ser fáceis de usar no celular.

---

# 14. Sugestão inicial para `styles.css`

Ajuste sugerido para a base visual:

```css
@import "tailwindcss";

@theme {
  --color-edren-green: #294F40;
  --color-edren-ivory: #FFD699;
  --color-edren-background: #FFF8ED;
  --color-edren-surface: #FFFCF6;
  --color-edren-muted: #F6EAD8;
  --color-edren-text: #213D33;
  --color-edren-text-muted: #6F6558;
  --color-edren-border: rgba(41, 79, 64, 0.18);
}

html {
  color-scheme: light;
}

body {
  margin: 0;
  min-height: 100vh;
  background: #FFF8ED;
  color: #213D33;
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}
```

---

# 15. Direção para componentes atuais

Se o frontend já tiver componentes com base escura, como `stone-950`, `stone-800` e `amber-300`, revisar para aproximar da identidade EDREN.

Substituições conceituais:

```text
stone-950 -> edren-background ou edren-green, dependendo do contexto
stone-800 -> edren-surface / edren-muted
stone-50  -> edren-text ou edren-surface
amber-300 -> edren-ivory
```

Mas atenção:

`#FFD699` não deve ser tratado como amarelo forte. Ele deve funcionar como marfim luminoso e elegante.

---

# 16. Exemplo de clima visual esperado

A interface deve parecer:

```text
clara + elegante + organizada + feminina + moderna
```

E não:

```text
escura + pesada + fria + genérica + chamativa
```

O resultado visual deve lembrar uma marca de moda feminina sofisticada, mas adaptada para um sistema interno de gestão.

---

# 17. Frase guia da identidade no sistema

A identidade visual do sistema EDREN deve traduzir:

> A moda que abraça. A elegância que inspira.

Na prática, isso significa:

- acolhimento no visual;
- elegância nos detalhes;
- clareza no uso;
- suavidade nas cores;
- firmeza no verde;
- simplicidade sem perder sofisticação.
