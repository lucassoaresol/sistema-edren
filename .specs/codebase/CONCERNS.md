# Concerns

## Divergencias De Especificacao

- Especificacao tecnica menciona autenticacao por email, mas implementacao atual usa `username` unico.
- Custo do produto foi decidido como opcional em um documento e como campo simples em outro; schema usa `cost` opcional, alinhado ao caminho mais flexivel.
- `.env.example` usa porta `3001`, enquanto deploy de producao usa `43101`; precisa estar claro por ambiente.
- Seeds usam alguns nomes sem acento. Isso pode ser intencional pela convencao ASCII, mas impacta a aparencia para usuario final.

## Riscos Tecnicos

- Schema esta mais avancado que a API. Isso e bom como base, mas pode criar falsa impressao de que os modulos estao prontos.
- A maioria das funcionalidades de negocio ainda nao tem endpoints, telas nem testes.
- Regras criticas de estoque/venda ainda nao estao protegidas por transacoes.
- Permissoes por perfil ainda nao existem como enforcement de API.
- Health check `/api/health/db` consulta contagens de seed e pode ser confundido com metricas reais.
- `node_modules`, `.vite` e `dist` aparecem no workspace; confirmar `.gitignore`/estado git para evitar artefatos versionados.

## Riscos De Produto

- O menu ja mostra areas nao implementadas; isso pode gerar expectativa se for publicado para usuarios finais.
- Sem CRUD de cadastros configuraveis, os seeds viram configuracao fixa na pratica.
- Sem contas a receber calculadas, venda em aberto ainda nao tem valor operacional.
- Sem relatorios minimos, o sistema ainda nao substitui cadernos/planilhas.

## Recomendacoes

- Antes de novos modulos visuais, implementar endpoints base e testes das regras de negocio.
- Definir se o identificador de login sera `username` ou `email` antes de criar tela de usuarios.
- Criar guardas de permissao reutilizaveis no backend.
- Criar servicos transacionais para estoque e venda em vez de espalhar regras nas rotas.
