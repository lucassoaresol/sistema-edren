# DECISOES_OPERACIONAIS_EDREN.md

# Decisões Operacionais do Sistema EDREN

Documento gerado a partir da entrevista operacional com Gracinha Mesquita para orientar o MVP do sistema interno da EDREN.

O objetivo do sistema é acompanhar a vida da peça: da coleção e entrada no estoque até venda, condicional, sacoleira, devolução, pagamento e resultado.

---

## 1. Visão geral do MVP

O sistema EDREN será um sistema interno, não um e-commerce.

A primeira versão deve ser simples, confiável e adaptada à rotina real da empresa, substituindo gradualmente os controles em cadernos.

### Foco do MVP

- Usuários e login;
- Coleções;
- Produtos;
- SKUs/variações;
- Estoque por local;
- Clientes;
- Vendas;
- Pagamentos;
- Contas a receber;
- Relatórios simples;
- Cadastros configuráveis.

### Direção principal

O MVP deve evitar excesso de complexidade. Sempre que uma regra puder ser simples agora e mais completa depois, a recomendação é:

- resolver de forma prática no MVP;
- deixar automações e módulos sofisticados para fase futura.

---

## 2. Produtos e coleções

### 2.1. Nascimento da referência

**Decisão operacional:**  
Na EDREN, uma referência nasce oficialmente depois que a peça piloto é aprovada e vai para o corte.

**Justificativa:**  
Antes disso, a peça ainda é uma ideia ou piloto. Quando a peça é aprovada para produção, ela passa a existir comercialmente.

**Impacto no banco de dados:**  
A tabela de produtos deve ter um campo `reference` obrigatório e único.

**Impacto nas telas:**  
A tela de cadastro de produto deve permitir criar uma nova referência quando a peça for aprovada para corte.

**MVP:**  
Referência cadastrada manualmente, seguindo a sequência usada pela EDREN.

**Fase futura:**  
Sistema sugerir automaticamente a próxima referência disponível.

---

### 2.2. Referência única e crescente

**Decisão operacional:**  
As referências seguem uma sequência crescente contínua e não se repetem entre coleções.

**Justificativa:**  
Cada novo produto comercial precisa ter sua própria identificação, evitando mistura de estoque, vendas e histórico.

**Impacto no banco de dados:**  
O campo `reference` deve ter restrição de unicidade.

**Impacto nas telas:**  
Ao tentar cadastrar uma referência já existente, o sistema deve avisar e impedir a duplicidade.

**MVP:**  
Campo manual com validação contra repetição.

**Fase futura:**  
Geração automática da próxima referência.

---

### 2.3. Modelos repaginados

**Decisão operacional:**  
Quando uma modelagem padrão é reaproveitada, mas muda detalhes, tecido, proposta ou acabamento, ela vira um novo modelo com nova referência.

**Justificativa:**  
Mesmo que a base da modelagem seja parecida, a peça comercial é outra.

**Impacto no banco de dados:**  
Cada produto deve ser tratado como um registro independente.

**Impacto nas telas:**  
O cadastro do produto deve vincular o produto à coleção correta e não reaproveitar referência antiga.

**MVP:**  
Cada novo modelo cadastrado com nova referência.

**Fase futura:**  
Criar campo opcional de “modelagem base” ou “produto relacionado”.

---

### 2.4. Produto sem foto

**Decisão operacional:**  
Produto pode ser cadastrado sem foto.

**Justificativa:**  
A rotina da EDREN não deve esperar fotos prontas para cadastrar uma peça que já foi aprovada para corte.

**Impacto no banco de dados:**  
O campo de imagem do produto deve ser opcional.

**Impacto nas telas:**  
A tela de produto deve aceitar cadastro sem imagem e exibir um espaço padrão quando não houver foto.

**MVP:**  
Imagem opcional.

**Fase futura:**  
Criar alerta de “produto sem foto”.

---

### 2.5. Preço por produto

**Decisão operacional:**  
O preço de venda será por produto/referência, não por cor nem por tamanho.

**Justificativa:**  
Na EDREN, o preço permanece o mesmo independentemente da cor ou tamanho.

**Impacto no banco de dados:**  
O preço deve ficar na tabela de produtos, não na tabela de SKUs.

**Impacto nas telas:**  
A tela de produto terá campo de preço de venda. A tela de SKU controlará apenas cor, tamanho e estoque.

**MVP:**  
Preço único por produto.

**Fase futura:**  
Preço por SKU apenas se a rotina da EDREN mudar.

---

### 2.6. Custo por produto

**Decisão operacional:**  
O custo da peça deve ser registrado por produto/referência.

**Justificativa:**  
A EDREN já faz ficha técnica e calcula o custo para formar o preço de venda.

**Impacto no banco de dados:**  
A tabela de produtos deve ter campo de custo.

**Impacto nas telas:**  
A tela de produto deve permitir informar custo e preço de venda.

**MVP:**  
Campo simples de custo no cadastro do produto.

**Fase futura:**  
Módulo completo de ficha técnica, com tecido, aviamentos, mão de obra, embalagem, margem e cálculo automático.

---

## 3. Estoque

### 3.1. Lançamento inicial manual

**Decisão operacional:**  
O estoque inicial será lançado manualmente, peça por peça, referência por referência.

**Justificativa:**  
Hoje não existe planilha pronta para importação.

**Impacto no banco de dados:**  
O sistema precisa registrar saldo inicial por SKU e por local.

**Impacto nas telas:**  
Criar tela simples de entrada inicial de estoque.

**MVP:**  
Entrada manual de estoque inicial.

**Fase futura:**  
Importação por planilha.

---

### 3.2. Fábrica como local de estoque

**Decisão operacional:**  
A fábrica será um local real de estoque.

**Justificativa:**  
A EDREN precisa consultar a quantidade existente na fábrica, não apenas na loja.

**Impacto no banco de dados:**  
A tabela de locais de estoque deve incluir “Fábrica” como local ativo.

**Impacto nas telas:**  
Consultas de estoque devem permitir filtrar por local.

**MVP:**  
Fábrica e Casa EDREN como locais ativos.

**Fase futura:**  
Relatórios mais completos de transferência entre fábrica, loja, condicional e sacoleiras.

---

### 3.3. Nova loja cadastrada desde o início

**Decisão operacional:**  
A nova loja deve nascer cadastrada no sistema desde o início, mas como local futuro/inativo.

**Justificativa:**  
Isso prepara o sistema para a expansão sem misturar o estoque atual.

**Impacto no banco de dados:**  
Locais de estoque devem ter status, como ativo, inativo ou futuro.

**Impacto nas telas:**  
Locais inativos/futuros devem aparecer em configurações, mas não precisam ser usados nas vendas do dia.

**MVP:**  
Nova loja cadastrada como futuro/inativo.

**Fase futura:**  
Ativar a nova loja quando iniciar a operação.

---

### 3.4. Condicional e sacoleira podem sair de mais de um local

**Decisão operacional:**  
Peças para condicional ou sacoleira podem sair tanto da Casa EDREN quanto da fábrica.

**Justificativa:**  
A rotina da EDREN permite retirada de ambos os locais.

**Impacto no banco de dados:**  
Movimentações de estoque precisam registrar local de origem.

**Impacto nas telas:**  
Na saída para condicional ou sacoleira, o sistema deve perguntar de qual local a peça está saindo.

**MVP:**  
Registrar condicional/sacoleira como movimentação de estoque com responsável.

**Fase futura:**  
Módulo completo de condicional e sacoleiras.

---

### 3.5. Motivo obrigatório nas movimentações

**Decisão operacional:**  
Toda movimentação de estoque deve ter motivo obrigatório.

**Justificativa:**  
Isso evita perda de controle e ajuda a entender por que o estoque mudou.

**Impacto no banco de dados:**  
Movimentações de estoque devem ter campo `reason` obrigatório.

**Impacto nas telas:**  
Toda entrada, saída, ajuste, transferência, venda ou devolução deve exigir motivo ou gerar motivo automático.

**MVP:**  
Motivos principais já cadastrados.

**Fase futura:**  
Cadastro personalizável de motivos.

---

### 3.6. Ajuste manual de estoque

**Decisão operacional:**  
Deve existir ajuste manual de estoque, mas somente para administrador.

**Justificativa:**  
Diferenças entre estoque físico e sistema podem acontecer, mas precisam de controle.

**Impacto no banco de dados:**  
Registrar ajuste com usuário, data, local, SKU, quantidade anterior, quantidade nova e motivo.

**Impacto nas telas:**  
Tela de ajuste visível apenas para administrador.

**MVP:**  
Ajuste manual restrito ao administrador.

**Fase futura:**  
Relatório de auditoria de ajustes.

---

## 4. Vendas

### 4.1. Venda com desconto

**Decisão operacional:**  
Vendas podem ter desconto.

**Justificativa:**  
A EDREN concede desconto em compras à vista e compras acima de 8 peças.

**Impacto no banco de dados:**  
A venda deve guardar valor bruto, desconto, motivo do desconto e valor final.

**Impacto nas telas:**  
A tela de venda deve permitir aplicar desconto.

**MVP:**  
Desconto simples na venda inteira.

**Fase futura:**  
Limite de desconto por perfil e autorização para descontos maiores.

---

### 4.2. Desconto na venda inteira

**Decisão operacional:**  
No MVP, o desconto será aplicado na venda inteira.

**Justificativa:**  
A regra atual é comercial, ligada à condição de pagamento ou quantidade, não a uma peça específica.

**Impacto no banco de dados:**  
Campo de desconto na venda.

**Impacto nas telas:**  
Tela de venda deve permitir informar desconto em valor ou percentual.

**MVP:**  
Desconto total da venda.

**Fase futura:**  
Desconto por item.

---

### 4.3. Múltiplas formas de pagamento

**Decisão operacional:**  
Uma venda pode ter mais de uma forma de pagamento.

**Justificativa:**  
Na EDREN, pode haver pagamento combinado, como Pix + cartão, ou parte paga e parte em aberto.

**Impacto no banco de dados:**  
Criar tabela de pagamentos vinculada à venda.

**Impacto nas telas:**  
A tela de venda deve permitir adicionar mais de um pagamento.

**MVP:**  
Múltiplos pagamentos e saldo em aberto.

**Fase futura:**  
Taxas de cartão, parcelas formais e conciliação financeira.

---

### 4.4. Responsável obrigatório pela venda

**Decisão operacional:**  
Toda venda precisa ter alguém responsável vinculado.

**Justificativa:**  
Nenhuma venda deve ficar sem dono.

**Impacto no banco de dados:**  
Venda deve ter campo obrigatório `responsible_user_id`.

**Impacto nas telas:**  
Ao lançar venda, o sistema vincula automaticamente o usuário logado ou permite escolher responsável autorizado.

**MVP:**  
Venda sempre vinculada a usuário.

**Fase futura:**  
Metas, comissões e desempenho por vendedora.

---

### 4.5. Vendedora com login e senha

**Decisão operacional:**  
A vendedora/responsável deve ser usuária do sistema.

**Justificativa:**  
Isso permite saber quem fez venda, desconto, movimentação ou lançamento.

**Impacto no banco de dados:**  
Usuários precisam ter perfil e permissões.

**Impacto nas telas:**  
Sistema com login individual.

**MVP:**  
Usuários com senha e perfil.

**Fase futura:**  
Permissões mais detalhadas por pessoa.

---

### 4.6. Venda pelo WhatsApp lançada depois

**Decisão operacional:**  
O sistema deve permitir lançar vendas depois de realizadas, informando a data real da venda.

**Justificativa:**  
Hoje há vendas pelo WhatsApp que acontecem em um momento e são registradas depois.

**Impacto no banco de dados:**  
A venda deve ter data da venda e data de lançamento.

**Impacto nas telas:**  
Campo de data da venda editável por usuário autorizado.

**MVP:**  
Permitir lançamento posterior.

**Fase futura:**  
Fluxo completo de pedidos do WhatsApp.

---

## 5. Clientes

### 5.1. Dados obrigatórios

**Decisão operacional:**  
Cliente real deve ter nome e WhatsApp obrigatórios.

**Justificativa:**  
Esses dados são suficientes para identificação rápida e contato.

**Impacto no banco de dados:**  
Campos obrigatórios: nome e telefone/WhatsApp.

**Impacto nas telas:**  
Cadastro rápido de cliente.

**MVP:**  
Nome e WhatsApp obrigatórios.

**Fase futura:**  
Cadastro mais completo e relacionamento comercial.

---

### 5.2. WhatsApp único

**Decisão operacional:**  
O WhatsApp deve ser único no sistema.

**Justificativa:**  
Evita cliente duplicada e mantém histórico organizado.

**Impacto no banco de dados:**  
Restrição de unicidade no campo de WhatsApp.

**Impacto nas telas:**  
Sistema deve avisar se o número já estiver cadastrado.

**MVP:**  
Bloquear duplicidade pelo WhatsApp.

**Fase futura:**  
Tratar mudança de número ou número compartilhado.

---

### 5.3. Separação entre varejo e atacado

**Decisão operacional:**  
As vendas devem ser classificadas como varejo ou atacado.

**Justificativa:**  
Cliente final e revendedora/sacoleira seguem lógicas comerciais diferentes.

**Impacto no banco de dados:**  
Cliente deve ter tipo principal, e venda deve ter tipo/canal.

**Impacto nas telas:**  
Cadastro de cliente deve identificar cliente final ou revendedora/sacoleira.

**MVP:**  
Separar cliente final de revendedora/sacoleira.

**Fase futura:**  
Tabela de atacado, regras por quantidade, preço especial e histórico de revendedoras.

---

### 5.4. Dados complementares da cliente final

**Decisão operacional:**  
O cadastro da cliente final deve permitir cidade, bairro, tamanho usado, preferências e observações.

**Justificativa:**  
Essas informações melhoram atendimento e relacionamento, mas não devem travar o cadastro.

**Impacto no banco de dados:**  
Campos opcionais no cadastro de cliente.

**Impacto nas telas:**  
Cadastro com seção básica e seção complementar.

**MVP:**  
Campos opcionais.

**Fase futura:**  
Filtros comerciais e campanhas por perfil.

---

## 6. Contas a receber

### 6.1. Venda em aberto sem vencimento obrigatório

**Decisão operacional:**  
Venda em aberto pode ficar sem data combinada de pagamento.

**Justificativa:**  
Hoje, muitas vendas ficam apenas em aberto, sem vencimento definido.

**Impacto no banco de dados:**  
Data prevista de pagamento deve ser opcional.

**Impacto nas telas:**  
Contas a receber deve mostrar saldos mesmo sem vencimento.

**MVP:**  
Saldo em aberto sem data obrigatória.

**Fase futura:**  
Vencimentos, lembretes e alertas de cobrança.

---

### 6.2. Pagamento parcial com observação

**Decisão operacional:**  
Pagamento parcial deve permitir observação.

**Justificativa:**  
Ajuda a registrar acordos, detalhes do recebimento e contexto do pagamento.

**Impacto no banco de dados:**  
Tabela de pagamentos deve ter campo de observação opcional.

**Impacto nas telas:**  
Ao receber pagamento parcial, permitir adicionar observação.

**MVP:**  
Observação opcional por pagamento.

**Fase futura:**  
Histórico de acordos e lembretes de cobrança.

---

### 6.3. Recebimento restrito ao administrador

**Decisão operacional:**  
Somente administrador pode marcar pagamento como recebido.

**Justificativa:**  
Protege o caixa e o controle financeiro.

**Impacto no banco de dados:**  
Permissão de recebimento restrita ao perfil administrador.

**Impacto nas telas:**  
Botão de receber pagamento visível apenas para administrador.

**MVP:**  
Recebimento apenas por administrador.

**Fase futura:**  
Permissões específicas para pessoas de confiança.

---

### 6.4. Histórico de pagamentos por cliente

**Decisão operacional:**  
O sistema precisa mostrar histórico de pagamentos por cliente desde o MVP.

**Justificativa:**  
A EDREN precisa ver compras, pagamentos e saldos em aberto de cada cliente.

**Impacto no banco de dados:**  
Vendas e pagamentos devem ser consultáveis por cliente.

**Impacto nas telas:**  
Cadastro da cliente deve ter aba ou seção de histórico financeiro.

**MVP:**  
Histórico simples por cliente.

**Fase futura:**  
Alertas de atraso e resumo de relacionamento financeiro.

---

### 6.5. Sem limite de crédito

**Decisão operacional:**  
A EDREN não trabalha com limite de crédito por cliente.

**Justificativa:**  
A decisão de vender em aberto é administrativa/comercial, não automática.

**Impacto no banco de dados:**  
Não é necessário campo obrigatório de limite de crédito.

**Impacto nas telas:**  
Não haverá bloqueio automático de venda por limite.

**MVP:**  
Sem limite de crédito.

**Fase futura:**  
Alerta de saldo alto em aberto, sem bloqueio automático.

---

## 7. Cancelamentos e correções

### 7.1. Cancelamento somente por administrador

**Decisão operacional:**  
Somente administrador pode cancelar venda.

**Justificativa:**  
Cancelamento impacta estoque, financeiro e histórico.

**Impacto no banco de dados:**  
Permissão de cancelamento restrita.

**Impacto nas telas:**  
Botão de cancelar venda apenas para administrador.

**MVP:**  
Cancelamento por administrador.

**Fase futura:**  
Solicitação de cancelamento pela vendedora, com aprovação.

---

### 7.2. Retorno automático ao local de origem

**Decisão operacional:**  
Ao cancelar uma venda, a peça volta para o mesmo local de onde saiu.

**Justificativa:**  
Evita confusão no estoque.

**Impacto no banco de dados:**  
Cada item vendido deve guardar local de origem.

**Impacto nas telas:**  
Cancelamento deve informar automaticamente o retorno ao estoque.

**MVP:**  
Retorno automático ao local de origem.

**Fase futura:**  
Escolha manual do local de retorno apenas se necessário.

---

### 7.3. Motivo obrigatório no cancelamento

**Decisão operacional:**  
Todo cancelamento de venda exige motivo obrigatório.

**Justificativa:**  
Garante rastreabilidade.

**Impacto no banco de dados:**  
Venda cancelada deve armazenar motivo do cancelamento.

**Impacto nas telas:**  
Campo obrigatório de motivo ao cancelar.

**MVP:**  
Motivo obrigatório.

**Fase futura:**  
Lista configurável de motivos.

---

### 7.4. Estorno reabre saldo

**Decisão operacional:**  
Quando um pagamento é estornado/cancelado, o saldo volta a ficar em aberto.

**Justificativa:**  
O sistema deve refletir que aquele valor não foi mais recebido.

**Impacto no banco de dados:**  
Pagamentos não devem ser apagados, mas marcados como estornados/cancelados.

**Impacto nas telas:**  
Contas a receber deve recalcular saldo após estorno.

**MVP:**  
Estorno reabre saldo automaticamente.

**Fase futura:**  
Relatório de estornos.

---

### 7.5. Cancelamento apenas no dia da venda

**Decisão operacional:**  
Venda só pode ser cancelada no mesmo dia em que foi feita.

**Justificativa:**  
Protege o histórico financeiro e evita alterações antigas.

**Impacto no banco de dados:**  
Regra de validação pela data da venda.

**Impacto nas telas:**  
Após o dia da venda, botão de cancelamento normal não deve aparecer.

**MVP:**  
Cancelar apenas no mesmo dia.

**Fase futura:**  
Correção especial de vendas antigas, com permissão máxima e motivo obrigatório.

---

## 8. Usuários e permissões

### 8.1. Usuários iniciais

**Decisão operacional:**  
Os primeiros usuários serão Gracinha, seu filho e a gerente.

**Justificativa:**  
São as pessoas principais da operação inicial.

**Impacto no banco de dados:**  
Criar usuários com perfis e permissões.

**Impacto nas telas:**  
Tela de login e cadastro de usuários.

**MVP:**  
Usuários iniciais:
- Gracinha — Administradora;
- Filho — Administrador;
- Gerente — Gerente operacional.

**Fase futura:**  
Novos perfis para vendedora, fábrica e financeiro.

---

### 8.2. Ações restritas ao administrador

**Decisão operacional:**  
Somente administrador pode:

- cancelar venda;
- ajustar estoque;
- marcar pagamento como recebido;
- alterar preço;
- cadastrar ou alterar produto;
- ver custo da peça;
- acessar contas a receber.

**Justificativa:**  
Essas ações são sensíveis e impactam diretamente estoque, preço, custo e financeiro.

**Impacto no banco de dados:**  
Sistema de permissões por perfil.

**Impacto nas telas:**  
Menus e botões devem aparecer conforme perfil do usuário.

**MVP:**  
Perfis simples: administrador e gerente.

**Fase futura:**  
Permissões detalhadas por ação e por usuário.

---

### 8.3. Contas a receber restrito

**Decisão operacional:**  
Contas a receber fica visível somente para administrador.

**Justificativa:**  
É uma informação financeira sensível.

**Impacto no banco de dados:**  
Permissão específica para acesso financeiro.

**Impacto nas telas:**  
Menu de contas a receber oculto para gerente/vendedora.

**MVP:**  
Apenas administrador acessa.

**Fase futura:**  
Permissão de visualização sem edição, se necessário.

---

### 8.4. Desconto permitido para gerente/vendedora

**Decisão operacional:**  
Gerente/vendedora pode conceder desconto na venda.

**Justificativa:**  
O desconto faz parte da rotina comercial do atendimento.

**Impacto no banco de dados:**  
Venda deve registrar usuário que aplicou desconto.

**Impacto nas telas:**  
Campo de desconto disponível na tela de venda para perfis operacionais.

**MVP:**  
Pode aplicar desconto, mas não alterar preço cadastrado.

**Fase futura:**  
Limite de desconto por perfil.

---

## 9. Relatórios

### 9.1. Relatórios indispensáveis do MVP

**Decisão operacional:**  
Os 3 relatórios indispensáveis são:

1. Vendas do dia;
2. Contas a receber;
3. Estoque por referência.

**Justificativa:**  
São os controles essenciais para a rotina diária da EDREN.

**Impacto no banco de dados:**  
Vendas, pagamentos, estoque, produtos, coleções e clientes precisam estar bem relacionados.

**Impacto nas telas:**  
Criar telas simples de relatório, com filtros e totais.

**MVP:**  
Esses três relatórios entram como prioridade.

**Fase futura:**  
Peças mais vendidas, vendas por vendedora, margem, giro de estoque e comparativos.

---

### 9.2. Filtro por vendedora

**Decisão operacional:**  
Filtro por vendedora pode ficar para segunda fase.

**Justificativa:**  
No início, o foco é controle geral.

**Impacto no banco de dados:**  
Mesmo assim, venda deve guardar responsável para permitir relatório futuro.

**Impacto nas telas:**  
Relatórios do MVP não precisam ter filtro avançado por vendedora.

**MVP:**  
Registrar responsável.

**Fase futura:**  
Relatórios por vendedora, metas e comissões.

---

### 9.3. Filtro por coleção

**Decisão operacional:**  
Relatórios precisam filtrar por coleção desde o MVP.

**Justificativa:**  
A EDREN trabalha fortemente por coleções.

**Impacto no banco de dados:**  
Produto deve estar vinculado à coleção.

**Impacto nas telas:**  
Filtros de coleção nos relatórios principais.

**MVP:**  
Filtro por coleção em vendas e estoque.

**Fase futura:**  
Análise completa de desempenho por coleção.

---

### 9.4. Vendas por canal

**Decisão operacional:**  
Toda venda deve registrar canal desde o MVP.

**Justificativa:**  
A EDREN precisa entender se a venda veio da Casa EDREN, WhatsApp, Instagram, atacado, evento ou futura loja.

**Impacto no banco de dados:**  
Venda deve ter campo obrigatório de canal.

**Impacto nas telas:**  
Tela de venda deve exigir canal de venda.

**MVP:**  
Canal obrigatório.

**Fase futura:**  
Relatórios comparativos por canal.

---

### 9.5. Exportação para Excel

**Decisão operacional:**  
Exportação para Excel fica para fase futura.

**Justificativa:**  
No MVP, o mais importante é enxergar os dados com clareza dentro do sistema.

**Impacto no banco de dados:**  
Sem impacto imediato.

**Impacto nas telas:**  
Relatórios sem botão de exportação inicialmente.

**MVP:**  
Relatórios na tela.

**Fase futura:**  
Exportar para Excel.

---

## 10. Uso e experiência

### 10.1. Uso em computador e celular

**Decisão operacional:**  
O sistema será usado nos dois: computador e celular.

**Justificativa:**  
Computador é melhor para cadastros e relatórios; celular é útil para acompanhamento rápido.

**Impacto no banco de dados:**  
Sem impacto direto.

**Impacto nas telas:**  
Interface responsiva.

**MVP:**  
Sistema web funcionando bem em desktop e mobile.

**Fase futura:**  
Melhorias específicas para mobile.

---

### 10.2. Venda lançada na hora

**Decisão operacional:**  
A venda será lançada na hora do atendimento.

**Justificativa:**  
O sistema precisa acompanhar a venda real da loja.

**Impacto no banco de dados:**  
Estoque deve baixar no momento da venda.

**Impacto nas telas:**  
Tela de venda precisa ser rápida.

**MVP:**  
Venda rápida com busca por referência.

**Fase futura:**  
Leitura de código de barras e atalhos.

---

### 10.3. Tela de venda estilo balcão

**Decisão operacional:**  
A tela de venda precisa ser rápida, estilo balcão.

**Justificativa:**  
A cliente estará sendo atendida no momento do lançamento.

**Impacto no banco de dados:**  
Venda deve salvar itens, pagamentos, cliente, canal, responsável e descontos de forma simples.

**Impacto nas telas:**  
Fluxo curto para finalizar venda.

**MVP:**  
Busca por referência, seleção de cor/tamanho, cliente, pagamento e finalização.

**Fase futura:**  
Modo ainda mais rápido com código de barras.

---

### 10.4. Menu lateral no computador

**Decisão operacional:**  
No computador, o sistema deve ter menu lateral.

**Justificativa:**  
Facilita navegação e organização das áreas.

**Impacto no banco de dados:**  
Sem impacto direto.

**Impacto nas telas:**  
Layout desktop com menu lateral.

**MVP:**  
Menu com vendas, clientes, produtos, coleções, estoque, contas a receber, relatórios e configurações.

**Fase futura:**  
Atalhos personalizados.

---

### 10.5. Prioridade no celular

**Decisão operacional:**  
No celular, a prioridade será acesso rápido aos relatórios do dia.

**Justificativa:**  
Gracinha precisa acompanhar o movimento da EDREN rapidamente.

**Impacto no banco de dados:**  
Relatório diário precisa consultar vendas, pagamentos e saldos do dia.

**Impacto nas telas:**  
Tela inicial mobile com resumo diário.

**MVP:**  
Resumo do dia no celular.

**Fase futura:**  
Atalhos para venda rápida, consulta de estoque e contas a receber.

---

## 11. Dados iniciais sugeridos para o sistema

### 11.1. Coleções iniciais

**Decisão operacional sugerida:**  
O sistema deve nascer com as coleções:

- Solar;
- Signature;
- Luar;
- Apaixonadas pelo Brasil;
- Avulsas / Sem coleção definida.

**Justificativa:**  
São coleções recentes/importantes da EDREN, e a opção “Avulsas” evita travar cadastro de uma peça que não se encaixe em coleção.

**Impacto no banco de dados:**  
Tabela de coleções com nome e status.

**Impacto nas telas:**  
Cadastro de produto deve exigir ou sugerir vínculo com coleção.

**MVP:**  
Coleções iniciais cadastradas.

**Fase futura:**  
Status de coleção: ativa, encerrada, arquivada ou futura.

---

### 11.2. Locais de estoque iniciais

**Decisão operacional sugerida:**  

- Fábrica — ativo;
- Casa EDREN — ativo;
- Nova loja — futuro/inativo.

**Justificativa:**  
São os locais relevantes para a operação atual e expansão.

**Impacto no banco de dados:**  
Locais com status.

**Impacto nas telas:**  
Filtros por local em estoque e movimentações.

**MVP:**  
Fábrica e Casa EDREN ativos; nova loja futura.

**Fase futura:**  
Ativar a nova loja na inauguração.

---

### 11.3. Formas de pagamento iniciais

**Decisão operacional sugerida:**  

- Pix;
- Dinheiro;
- Cartão de crédito;
- Cartão de débito;
- Em aberto / contas a receber.

**Justificativa:**  
São as formas essenciais da rotina comercial.

**Impacto no banco de dados:**  
Tabela de formas de pagamento configuráveis.

**Impacto nas telas:**  
Tela de venda deve permitir combinar pagamentos.

**MVP:**  
Formas simples.

**Fase futura:**  
Taxas, parcelas e conciliação.

---

### 11.4. Canais de venda iniciais

**Decisão operacional sugerida:**  

- Casa EDREN;
- WhatsApp;
- Instagram;
- Atacado;
- Sacoleira / Revendedora;
- Nova loja — futuro/inativo;
- Evento EDREN.

**Justificativa:**  
Representam os canais comerciais reais e estratégicos da EDREN.

**Impacto no banco de dados:**  
Tabela de canais configuráveis.

**Impacto nas telas:**  
Campo de canal obrigatório na venda.

**MVP:**  
Canais cadastrados e obrigatórios na venda.

**Fase futura:**  
Relatórios por canal.

---

### 11.5. Usuários iniciais

**Decisão operacional sugerida:**  

- Gracinha — Administradora;
- Filho — Administrador;
- Gerente — Gerente operacional.

**Justificativa:**  
São os primeiros usuários necessários para iniciar a operação.

**Impacto no banco de dados:**  
Usuários com perfil e status.

**Impacto nas telas:**  
Tela de login e gerenciamento de usuários.

**MVP:**  
Criar os três usuários iniciais.

**Fase futura:**  
Perfis adicionais.

---

### 11.6. Fontes históricas futuras

**Decisão operacional sugerida:**  
Os seguintes controles manuais podem servir como base para importação ou digitação futura:

- caderno de referências;
- fichas técnicas;
- caderno de vendas;
- controle de estoque;
- contas a receber;
- controle de sacoleiras/revendedoras.

**Justificativa:**  
Hoje o lançamento inicial será manual, mas esses cadernos têm valor histórico.

**Impacto no banco de dados:**  
O banco deve permitir inserir dados históricos aos poucos.

**Impacto nas telas:**  
Não precisa existir importação no MVP.

**MVP:**  
Cadastro manual.

**Fase futura:**  
Importação por planilha ou digitação assistida.

---

## 12. Impacto geral no banco de dados

O MVP deve considerar, no mínimo, as seguintes entidades:

- Usuários;
- Perfis/permissões;
- Coleções;
- Produtos;
- SKUs;
- Cores;
- Tamanhos;
- Categorias;
- Locais de estoque;
- Estoque por SKU e local;
- Movimentações de estoque;
- Clientes;
- Tipos de cliente;
- Vendas;
- Itens da venda;
- Pagamentos;
- Contas a receber;
- Canais de venda;
- Formas de pagamento;
- Motivos de movimentação;
- Motivos de cancelamento.

### Regras importantes de banco

- Produto tem referência única;
- Produto pertence a uma coleção;
- Produto tem preço e custo;
- SKU representa produto + cor + tamanho;
- Estoque é controlado por SKU e local;
- Venda baixa estoque;
- Venda pode ter múltiplos pagamentos;
- Venda pode gerar saldo em aberto;
- Pagamentos podem ser estornados, mas não apagados;
- Vendas podem ser canceladas, mas não apagadas;
- Produtos, clientes e usuários com histórico devem ser inativados, não excluídos.

---

## 13. Impacto geral nas telas

### Telas essenciais do MVP

- Login;
- Dashboard / resumo do dia;
- Vendas;
- Clientes;
- Produtos;
- Coleções;
- Estoque;
- Movimentações de estoque;
- Contas a receber;
- Relatórios;
- Configurações;
- Usuários e permissões.

### Prioridade de experiência

- Tela de venda rápida;
- Cadastro de cliente simples;
- Consulta de estoque clara;
- Relatório do dia acessível pelo celular;
- Menu lateral no computador;
- Visual elegante, claro e acolhedor.

---

## 14. O que entra no MVP

- Cadastro de usuários com login e senha;
- Perfis básicos de permissão;
- Cadastro de coleções;
- Cadastro de produtos com referência única;
- Produto sem foto;
- Custo e preço por produto;
- SKU por cor e tamanho;
- Estoque por local;
- Locais: Fábrica, Casa EDREN e Nova Loja futura;
- Entrada manual de estoque;
- Movimentações com motivo obrigatório;
- Ajuste manual apenas por administrador;
- Cadastro de clientes;
- WhatsApp obrigatório e único;
- Separação entre cliente final e revendedora/sacoleira;
- Venda rápida;
- Venda com desconto;
- Venda com múltiplos pagamentos;
- Saldo em aberto;
- Contas a receber;
- Histórico financeiro por cliente;
- Cancelamento apenas pelo administrador;
- Cancelamento apenas no dia da venda;
- Estorno de pagamento reabrindo saldo;
- Relatórios de vendas do dia, contas a receber e estoque por referência;
- Filtro por coleção;
- Canal de venda obrigatório;
- Sistema responsivo para computador e celular.

---

## 15. O que fica para fase futura

- Sugestão automática da próxima referência;
- Campo de modelagem base/produto relacionado;
- Alerta de produto sem foto;
- Ficha técnica completa no sistema;
- Importação por planilha;
- Módulo completo de condicional;
- Módulo completo de sacoleiras/revendedoras;
- Auditoria avançada de estoque;
- Desconto por item;
- Limite de desconto por perfil;
- Taxas de cartão;
- Parcelas formais;
- Conciliação financeira;
- Fluxo completo de pedidos do WhatsApp;
- Campanhas por perfil de cliente;
- Lembretes de cobrança;
- Alertas de atraso;
- Relatórios por vendedora;
- Metas e comissões;
- Exportação para Excel;
- Código de barras;
- Atalhos personalizados;
- Relatórios avançados por canal, coleção, margem e giro de estoque.

---

## 16. Pontos pendentes ou a confirmar depois

Alguns pontos podem ser definidos no momento da implementação ou em uma próxima conversa:

1. Percentual ou valor padrão dos descontos à vista;
2. Regra exata de desconto para compras acima de 8 peças;
3. Diferença de preço entre varejo e atacado, se houver;
4. Lista final de tamanhos usados pela EDREN;
5. Lista final de cores cadastradas inicialmente;
6. Lista final de categorias de produto;
7. Nome oficial da nova loja no sistema;
8. Permissões exatas da gerente operacional;
9. Se a gerente poderá cadastrar cliente e lançar venda, mas sem editar produto/estoque;
10. Se o campo CPF será usado ou ficará apenas opcional;
11. Como tratar trocas após o dia da venda;
12. Como registrar devolução de condicional no MVP;
13. Se vendas de eventos terão canal próprio obrigatório;
14. Se “Atacado” e “Sacoleira/Revendedora” serão canais separados ou tipo de cliente + canal.

---

## 17. Recomendação final

A recomendação é construir o MVP do sistema EDREN com foco em controle real e uso diário.

O sistema deve ser simples o suficiente para ser usado na hora do atendimento, mas estruturado o suficiente para organizar estoque, vendas, clientes e contas a receber.

O primeiro objetivo não é ter um sistema grande, e sim um sistema que a EDREN consiga usar de verdade.

A partir desse MVP, a EDREN poderá evoluir para módulos mais completos de produção, ficha técnica, atacado, sacoleiras, condicionais, comissões, relatórios avançados e integração com a nova loja.
