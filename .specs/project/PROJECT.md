# EDREN

**Visao:** Construir um sistema interno simples e confiavel para a EDREN acompanhar a vida operacional de cada variacao de produto, da colecao e entrada de estoque ate venda, pagamento, movimentacao de estoque e relatorios basicos.
**Para:** Donas da EDREN, equipe administrativa, vendedoras/operadoras e pessoas responsaveis por produtos, estoque, clientes, vendas e recebiveis.
**Resolve:** Substitui cadernos e planilhas por um sistema centralizado que mostra o que existe em estoque, onde esta, o que foi vendido, o que foi pago e o que ainda esta a receber.

## Objetivos

- Entregar um MVP que suporte a operacao diaria central da EDREN: produtos, SKUs, estoque, clientes, vendas, pagamentos e recebiveis.
- Manter a primeira versao pequena o suficiente para ser entregue e usada na pratica, adiando financas avancadas, comissoes, e-commerce e automacoes.
- Preservar historico operacional de vendas, pagamentos e movimentacoes de estoque para manter relatorios e correcoes confiaveis.

## Stack Tecnica

- Frontend: Vite + React + TypeScript + Tailwind CSS + componentes UI proprios.
- Backend: Fastify.
- Banco de dados: PostgreSQL.
- ORM: Prisma.
- Gerenciador de pacotes: npm.
- Estrutura do repositorio: monorepo com npm workspaces.
- Bibliotecas frontend: TanStack Router, TanStack Query, TanStack Table, React Hook Form, Zod, Sonner, Lucide React.
- Utilitarios de UI: class-variance-authority, clsx, tailwind-merge.
- Armazenamento de imagens: Cloudinary.
- Alvo de deploy: VPS com Nginx, PM2 e Cloudflared Tunnel.
- Exposicao da API: frontend consome backend pelo Nginx em `/api`; sem dominio publico separado para API.

## Escopo

**MVP inclui:**

- Autenticacao com username e senha.
- Usuarios basicos e permissoes por perfil.
- Cadastros configuraveis para grades de tamanho, tamanhos, categorias, cores, locais de estoque, canais de venda e formas de pagamento.
- Seeds iniciais para perfis, dados de configuracao, colecoes, locais de estoque, canais de venda, formas de pagamento e `Cliente Balcao`.
- Colecoes.
- Produtos com referencia/codigo comercial.
- SKUs/variacoes identificadas por produto + cor + tamanho.
- Imagens de produto via Cloudinary, com suporte no banco para multiplas imagens e interface inicial focada em uma imagem principal.
- Clientes.
- Saldos de estoque por SKU e local.
- Entradas e movimentacoes de estoque.
- Tratamento de condicional e sacoleira apenas como movimentacoes de estoque com cliente/pessoa responsavel, nao como modulos completos.
- Vendas, itens de venda, pagamentos, pagamentos parciais e recebiveis calculados.
- Cancelamento completo de venda com retorno de estoque e cancelamento/estorno de pagamentos.
- Painel inicial simples e relatorios minimos com filtros e totais.
- Entrada manual de estoque inicial por SKU e local.
- Ajuste manual de estoque restrito a administradores.
- Fluxo rapido de venda com busca por referencia de produto.
- Relatorios operacionais priorizados para vendas do dia, recebiveis e estoque por referencia.

**Explicitamente fora do MVP:**

- Modulo completo de condicional com prazos, alertas, fluxo detalhado de retorno/acerto e relatorios especificos.
- Modulo completo de sacoleira/revendedora com acertos, prazos e relatorios especificos.
- Comissoes.
- Despesas.
- Parcelamentos formais, carne, juros, multas e cobranca automatica.
- Trocas detalhadas e devolucoes parciais.
- E-commerce ou pedidos publicos de clientes.
- Integracoes com WhatsApp, Instagram, gateway de pagamento, nota fiscal, codigo de barras ou impressora de etiquetas.
- App mobile nativo.
- Producao avancada, contabilidade, fiscal, BI, IA, dashboards, graficos ou exportacoes avancadas.
- Permissoes customizadas por usuario.

## Regras De Negocio

- Usuarios autenticam com `username` unico e senha, nao email.
- Registros de usuario incluem nome de exibicao, username, password hash, perfil e status ativo/inativo.
- Autenticacao usa cookies de sessao server-side com `HttpOnly`, `Secure` em producao e `SameSite=Lax`.
- JWT nao faz parte da estrategia de autenticacao do MVP.
- CORS nao e necessario por padrao porque frontend e API sao servidos pela mesma origem via `/api`; Vite e Nginx devem fazer proxy de `/api` para o Fastify.
- No MVP, uma "peca" significa SKU/variacao de produto com quantidade, nao unidade individualmente rastreada.
- Estoque e controlado por SKU e local.
- A referencia comercial pertence ao produto; SKUs sao produto + cor + tamanho.
- Custo e opcional no MVP.
- Referencia do produto e obrigatoria, unica, preenchida manualmente e segue a sequencia continua da EDREN.
- Modelos refeitos ou repaginados recebem nova referencia de produto.
- Preco de venda e custo sao armazenados no produto, nao no SKU.
- Imagem de produto e opcional.
- Produto pertence a uma colecao; colecoes iniciais incluem `Solar`, `Signature`, `Luar`, `Apaixonadas pelo Brasil` e `Avulsas / Sem colecao definida`.
- Vendas confirmadas baixam estoque imediatamente, mesmo com pagamento parcial ou em aberto.
- Vendas podem ter desconto simples no nivel da venda com motivo obrigatorio quando aplicado.
- Vendas podem ter multiplos pagamentos.
- Toda venda deve ter usuario responsavel e canal de venda obrigatorio.
- Vendas podem ser lancadas depois de terem ocorrido, preservando data da venda e data de entrada.
- Vendas com saldo em aberto exigem cliente real cadastrado.
- Vendas rapidas totalmente pagas podem usar o seed `Cliente Balcao`.
- Recebiveis sao calculados a partir do total da venda menos pagamentos ativos.
- Recebiveis em aberto podem existir sem data de vencimento obrigatoria.
- Pagamentos podem ser parciais e podem ser cancelados/estornados com motivo obrigatorio; nao sao excluidos fisicamente depois de vinculados a uma venda.
- Apenas administradores podem marcar pagamentos como recebidos no MVP.
- Vendas nao sao excluidas fisicamente; podem ser canceladas com motivo obrigatorio.
- Apenas administradores podem cancelar vendas no MVP.
- Vendas so podem ser canceladas no mesmo dia da venda no MVP.
- Cancelar uma venda completa retorna estoque ao local original e cancela/estorna pagamentos vinculados.
- Movimentacoes de estoque nao sao excluidas fisicamente; correcoes usam movimentacao inversa ou cancelamento controlado.
- Toda movimentacao de estoque deve ter motivo obrigatorio, manual ou gerado automaticamente pelo sistema.
- Movimentacoes de condicional e sacoleira podem sair da Casa EDREN ou da Fabrica.
- Produtos/SKUs e clientes com historico sao inativados em vez de excluidos.
- Usuarios com historico sao inativados em vez de excluidos.
- Condicional nao e venda; sacoleira nao e venda ate acerto/confirmacao de venda.
- Movimentacoes de condicional e sacoleira reservam estoque e mantem vinculo com pessoa/cliente responsavel.
- Clientes reais exigem nome e WhatsApp; WhatsApp deve ser unico.
- Clientes podem ser classificados pelo menos como cliente final ou sacoleira/revendedora.
- Cidade, bairro, tamanho usual, preferencias e observacoes do cliente sao opcionais.
- Nao e necessario limite de credito de cliente no MVP.
- Acoes somente de administrador incluem cancelar vendas, ajustar estoque, marcar pagamentos como recebidos, alterar precos, criar/editar produtos, ver custo e acessar recebiveis.
- Gerente/vendedor pode aplicar desconto na venda, mas nao pode alterar preco cadastrado do produto.

## Seeds Iniciais

- Perfis: `Administrador`, `Gerente`, `Vendedor/Operador`.
- Grade de tamanho: `Grade Feminina P ao GG` com `P`, `M`, `G`, `GG`.
- Categorias: `Vestido`, `Blusa`, `Calca`, `Saia`, `Short`, `Macacao`, `Conjunto`, `Outros`.
- Cores: `Preto`, `Branco`, `Off White`, `Azul`, `Verde`, `Vermelho`, `Rosa`, `Amarelo`, `Bege`, `Marrom`, `Estampado`, `Xadrez`, `Outros`.
- Locais de estoque: `Casa EDREN`, `Fabrica`, `Nova Loja`.
- Status inicial dos locais: `Casa EDREN` ativa, `Fabrica` ativa, `Nova Loja` futura/inativa.
- Canais de venda: `Casa EDREN`, `WhatsApp`, `Instagram`, `Atacado`, `Sacoleira / Revendedora`, `Nova loja`, `Evento EDREN`.
- Formas de pagamento: `Pix`, `Dinheiro`, `Cartao de credito`, `Cartao de debito`, `Em aberto / contas a receber`.
- Cliente: `Cliente Balcao` para vendas rapidas totalmente pagas.
- Colecoes: `Solar`, `Signature`, `Luar`, `Apaixonadas pelo Brasil`, `Avulsas / Sem colecao definida`.

## Relatorios Minimos

- Vendas por periodo.
- Vendas do dia.
- Vendas do mes.
- Estoque por produto/SKU.
- Estoque por local.
- Recebiveis.
- Clientes com saldo em aberto.
- Vendas por colecao.
- Vendas por canal.
- Estoque por referencia.

## Restricoes

- Prazo: TBD.
- Tecnica: comecar com desenvolvimento local; ambiente de desenvolvimento publicado no VPS nao e necessario inicialmente.
- Tecnica: a API nao deve ser exposta publicamente por dominio separado.
- Tecnica: evitar expor tokens de autenticacao ao JavaScript do navegador; usar cookies de sessao HTTP-only.
- Tecnica: backups devem ser documentados inicialmente e implementados como scripts basicos quando a fase de deploy no VPS comecar.
- Produto: priorizar um MVP pequeno e utilizavel em vez de um sistema amplo.

## Identidade Visual

- A interface deve ser predominantemente clara, elegante, serena, moderna e acolhedora.
- Cor primaria da marca: verde EDREN `#294F40` para acoes principais, titulos, navegacao ativa e presenca forte de marca.
- Cor de apoio: marfim vivo `#FFD699` para destaques sutis, badges, hover states e enfase decorativa.
- Cores base do sistema devem usar superficies claras e quentes: background `#FFF8ED`, surface `#FFFCF6`, muted surface `#F6EAD8`, text `#213D33`, muted text `#6F6558`.
- Evitar tema escuro como identidade visual padrao.
- Evitar visual generico, frio, excessivamente tecnologico, colorido demais ou com aparencia de e-commerce.
- Usar a marca textual `EDREN / VESTUARIO FEMININO` se os assets oficiais do logo nao estiverem disponiveis; nao inventar simbolo ou icone como logo.
- Priorizar tipografia legivel para tabelas, formularios, menus, filtros, relatorios e dados operacionais.
- Usar `docs/context/GUIA_IDENTIDADE_VISUAL_EDREN.md` como guia visual detalhado para trabalhos de frontend.

## Analise Brownfield Atual

- O codigo atual confirma uma fundacao fullstack com web, API, banco, seed, autenticacao e shell visual.
- O schema Prisma ja cobre grande parte do MVP operacional, mas os fluxos de negocio ainda nao foram implementados.
- O dashboard atual e uma prova tecnica de conectividade com banco, nao um dashboard de negocio.
- As rotas de vendas, clientes, produtos, colecoes, estoque, contas a receber, relatorios e configuracoes existem como placeholders no frontend.

## Documentos De Contexto

- `docs/context/PROJECT_ORIGINAL_BRIEF.md`
- `docs/context/DEVOLUTIVA_TECNICA_EDREN.md`
- `docs/context/DECISOES_FINAIS_ESPECIFICACAO_EDREN.md`
- `docs/context/DECISOES_OPERACIONAIS_EDREN.md`
- `docs/deploy/PRODUCAO.md`
