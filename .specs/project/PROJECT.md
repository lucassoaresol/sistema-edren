# EDREN

**Visão:** Construir um sistema interno simples e confiável para a EDREN acompanhar a vida operacional de cada variação de produto, da coleção e entrada de estoque até venda, pagamento, movimentação de estoque e relatórios básicos.
**Para:** Donas da EDREN, equipe administrativa, vendedoras/operadoras e pessoas responsáveis por produtos, estoque, clientes, vendas e recebíveis.
**Resolve:** Substitui cadernos e planilhas por um sistema centralizado que mostra o que existe em estoque, onde está, o que foi vendido, o que foi pago e o que ainda está a receber.

## Objetivos

- Entregar um MVP que suporte a operação diária central da EDREN: produtos, SKUs, estoque, clientes, vendas, pagamentos e recebíveis.
- Manter a primeira versão pequena o suficiente para ser entregue e usada na prática, adiando finanças avançadas, comissões, e-commerce e automações.
- Preservar histórico operacional de vendas, pagamentos e movimentações de estoque para manter relatórios e correções confiáveis.

## Stack Técnica

**Base:**

- Frontend: Vite + React + TypeScript + Tailwind CSS + shadcn/ui
- Backend: Fastify
- Banco de dados: PostgreSQL
- ORM: Prisma

**Dependências e infraestrutura principais:**

- Gerenciador de pacotes: npm
- Estrutura do repositório: monorepo com npm workspaces
- Bibliotecas frontend: TanStack Router, TanStack Query, TanStack Table, React Hook Form, Zod, Sonner, Lucide React
- Utilitários de UI: class-variance-authority, clsx, tailwind-merge
- Armazenamento de imagens: Cloudinary
- Alvo de deploy: VPS com Nginx, PM2 e Cloudflared Tunnel
- Exposição da API: frontend consome backend pelo Nginx em `/api`; sem domínio público separado para API

## Escopo

**MVP inclui:**

- Autenticação com username e senha.
- Usuários básicos e permissões por perfil.
- Cadastros configuráveis para grades de tamanho, tamanhos, categorias, cores, locais de estoque, canais de venda e formas de pagamento.
- Seeds iniciais para perfis, grade padrão, categorias, cores, locais de estoque, canais de venda, formas de pagamento e `Cliente Balcao`.
- Coleções.
- Produtos com referência/código comercial.
- SKUs/variações identificadas por produto + cor + tamanho.
- Imagens de produto via Cloudinary, com suporte no banco para múltiplas imagens e interface inicial focada em uma imagem principal.
- Clientes.
- Saldos de estoque por SKU e local.
- Entradas e movimentações de estoque.
- Tratamento de condicional e sacoleira apenas como movimentações de estoque com cliente/pessoa responsável, não como módulos completos.
- Vendas, itens de venda, pagamentos, pagamentos parciais e recebíveis calculados.
- Cancelamento completo de venda com retorno de estoque e cancelamento/estorno de pagamentos.
- Painel inicial simples e relatórios mínimos com filtros e totais.
- Entrada manual de estoque inicial por SKU e local.
- Ajuste manual de estoque restrito a administradores.
- Fluxo rápido de venda com busca por referência de produto.
- Relatórios operacionais priorizados para vendas do dia, recebíveis e estoque por referência.

**Explicitamente fora do MVP:**

- Módulo completo de condicional com prazos, alertas, fluxo detalhado de retorno/acerto e relatórios específicos.
- Módulo completo de sacoleira/revendedora com acertos, prazos e relatórios específicos.
- Comissões.
- Despesas.
- Parcelamentos formais, carnê, juros, multas e cobrança automática.
- Trocas detalhadas e devoluções parciais.
- E-commerce ou pedidos públicos de clientes.
- Integrações com WhatsApp, Instagram, gateway de pagamento, nota fiscal, código de barras ou impressora de etiquetas.
- App mobile nativo.
- Produção avançada, contabilidade, fiscal, BI, IA, dashboards, gráficos ou exportações avançadas.
- Permissões customizadas por usuário.

## Regras de Negócio

- Usuários autenticam com `username` único e senha, não email.
- Registros de usuário incluem nome de exibição, username, password hash, perfil e status ativo/inativo.
- Autenticação usa cookies de sessão server-side com `HttpOnly`, `Secure` em produção e `SameSite=Lax`.
- JWT não faz parte da estratégia de autenticação do MVP.
- CORS não é necessário por padrão porque frontend e API são servidos pela mesma origem via `/api`; Vite e Nginx devem fazer proxy de `/api` para o Fastify.
- No MVP, uma "peça" significa SKU/variação de produto com quantidade, não unidade individualmente rastreada.
- Estoque é controlado por SKU e local.
- A referência comercial pertence ao produto; SKUs são produto + cor + tamanho.
- Custo é opcional no MVP.
- Referência do produto é obrigatória, única, preenchida manualmente e segue a sequência contínua da EDREN.
- A referência do produto pertence ao produto e não se repete entre coleções.
- Modelos refeitos ou repaginados recebem nova referência de produto.
- Preço de venda e custo são armazenados no produto, não no SKU.
- Imagem de produto é opcional.
- Produto pertence a uma coleção; coleções iniciais incluem `Solar`, `Signature`, `Luar`, `Apaixonadas pelo Brasil` e `Avulsas / Sem colecao definida`.
- Vendas confirmadas baixam estoque imediatamente, mesmo com pagamento parcial ou em aberto.
- Vendas podem ter desconto simples no nível da venda com motivo obrigatório quando aplicado.
- Vendas podem ter múltiplos pagamentos.
- Toda venda deve ter usuário responsável e canal de venda obrigatório.
- Vendas podem ser lançadas depois de terem ocorrido, preservando data da venda e data de entrada.
- Vendas com saldo em aberto exigem cliente real cadastrado.
- Vendas rápidas totalmente pagas podem usar o seed `Cliente Balcao`.
- Recebíveis são calculados a partir do total da venda menos pagamentos ativos.
- Recebíveis em aberto podem existir sem data de vencimento obrigatória.
- Pagamentos podem ser parciais e podem ser cancelados/estornados com motivo obrigatório; não são excluídos fisicamente depois de vinculados a uma venda.
- Pagamentos parciais podem ter observação opcional.
- Apenas administradores podem marcar pagamentos como recebidos no MVP.
- Vendas não são excluídas fisicamente; podem ser canceladas com motivo obrigatório.
- Apenas administradores podem cancelar vendas no MVP.
- Vendas só podem ser canceladas no mesmo dia da venda no MVP.
- Cancelar uma venda completa retorna estoque ao local original e cancela/estorna pagamentos vinculados.
- Movimentações de estoque não são excluídas fisicamente; correções usam movimentação inversa ou cancelamento controlado.
- Toda movimentação de estoque deve ter motivo obrigatório, manual ou gerado automaticamente pelo sistema.
- Movimentações de condicional e sacoleira podem sair da Casa EDREN ou da Fabrica.
- Produtos/SKUs e clientes com histórico são inativados em vez de excluídos.
- Usuários com histórico são inativados em vez de excluídos.
- Condicional não é venda; sacoleira não é venda até acerto/confirmação de venda.
- Movimentações de condicional e sacoleira reservam estoque e mantêm vínculo com pessoa/cliente responsável.
- Clientes reais exigem nome e WhatsApp; WhatsApp deve ser único.
- Clientes podem ser classificados pelo menos como cliente final ou sacoleira/revendedora.
- Cidade, bairro, tamanho usual, preferências e observações do cliente são opcionais.
- Não é necessário limite de crédito de cliente no MVP.
- Ações somente de administrador incluem cancelar vendas, ajustar estoque, marcar pagamentos como recebidos, alterar preços, criar/editar produtos, ver custo e acessar recebíveis.
- Gerente/vendedor pode aplicar desconto na venda, mas não pode alterar preço cadastrado do produto.

## Seeds Iniciais

- Perfis: `Administrador`, `Gerente`, `Vendedor/Operador`.
- Grade de tamanho: `Grade Feminina P ao GG` com `P`, `M`, `G`, `GG`.
- Categorias: `Vestido`, `Blusa`, `Calca`, `Saia`, `Short`, `Macacao`, `Conjunto`, `Outros`.
- Cores: `Preto`, `Branco`, `Off White`, `Azul`, `Verde`, `Vermelho`, `Rosa`, `Amarelo`, `Bege`, `Marrom`, `Estampado`, `Xadrez`, `Outros`.
- Locais de estoque: `Casa EDREN`, `Fabrica`, `Nova Loja`.
- Status inicial dos locais: `Casa EDREN` ativa, `Fabrica` ativa, `Nova Loja` futura/inativa.
- Canais de venda: `Casa EDREN`, `WhatsApp`, `Instagram`, `Atacado`, `Sacoleira / Revendedora`, `Nova loja`, `Evento EDREN`.
- Formas de pagamento: `Pix`, `Dinheiro`, `Cartao de credito`, `Cartao de debito`, `Em aberto / contas a receber`.
- Cliente: `Cliente Balcao` para vendas rápidas totalmente pagas.
- Coleções: `Solar`, `Signature`, `Luar`, `Apaixonadas pelo Brasil`, `Avulsas / Sem colecao definida`.

## Relatórios Mínimos

- Vendas por período.
- Vendas do dia.
- Vendas do mês.
- Estoque por produto/SKU.
- Estoque por local.
- Recebíveis.
- Clientes com saldo em aberto.
- Vendas por coleção.
- Vendas por canal.
- Estoque por referência.

## Restrições

- Prazo: TBD.
- Técnica: começar com desenvolvimento local; ambiente de desenvolvimento publicado no VPS não é necessário inicialmente.
- Técnica: a API não deve ser exposta publicamente por domínio separado.
- Técnica: evitar expor tokens de autenticação ao JavaScript do navegador; usar cookies de sessão HTTP-only.
- Técnica: backups devem ser documentados inicialmente e implementados como scripts básicos quando a fase de deploy no VPS começar.
- Produto: priorizar um MVP pequeno e utilizável em vez de um sistema amplo.

## Identidade Visual

- A interface deve ser predominantemente clara, elegante, serena, moderna e acolhedora.
- Cor primária da marca: verde EDREN `#294F40` para ações principais, títulos, navegação ativa e presença forte de marca.
- Cor de apoio: marfim vivo `#FFD699` para destaques sutis, badges, hover states e ênfase decorativa.
- Cores base do sistema devem usar superfícies claras e quentes: background `#FFF8ED`, surface `#FFFCF6`, muted surface `#F6EAD8`, text `#213D33`, muted text `#6F6558`.
- Evitar tema escuro como identidade visual padrão.
- Evitar visual genérico, frio, excessivamente tecnológico, colorido demais ou com aparência de e-commerce.
- Usar a marca textual `EDREN / VESTUARIO FEMININO` se os assets oficiais do logo não estiverem disponíveis; não inventar símbolo ou ícone como logo.
- Priorizar tipografia legível para tabelas, formulários, menus, filtros, relatórios e dados operacionais.
- Usar `docs/context/GUIA_IDENTIDADE_VISUAL_EDREN.md` como guia visual detalhado para trabalhos de frontend.

## Documentos de Contexto

- `docs/context/PROJECT_ORIGINAL_BRIEF.md`: briefing amplo original do projeto.
- `docs/context/DEVOLUTIVA_TECNICA_EDREN.md`: redução técnica de escopo e recomendação de MVP.
- `docs/context/DECISOES_FINAIS_ESPECIFICACAO_EDREN.md`: decisões finais práticas usadas para criar esta especificação oficial.
- `docs/context/GUIA_IDENTIDADE_VISUAL_EDREN.md`: guia de identidade visual para o frontend.
- `docs/context/DECISOES_OPERACIONAIS_EDREN.md`: decisões operacionais da descoberta EDREN usadas para modelar produtos, estoque, clientes, vendas, pagamentos, relatórios e permissões.
