# Concerns

## Divergências de Especificação

- Especificação técnica menciona autenticação por email, mas implementação atual usa `username` único.
- Custo do produto foi decidido como opcional em um documento e como campo simples em outro; schema usa `cost` opcional, alinhado ao caminho mais flexível.
- `.env.example` usa porta `3001`, enquanto deploy de produção usa `43101`; precisa estar claro por ambiente.
- Seeds usam alguns nomes sem acento. Isso pode ser intencional pela convenção ASCII, mas impacta a aparência para usuário final.

## Riscos Técnicos

- Schema está mais avançado que a API. Isso é bom como base, mas pode criar falsa impressão de que os módulos estão prontos.
- A maioria das funcionalidades de negócio ainda não tem endpoints, telas nem testes.
- Regras críticas de estoque/venda ainda não estão protegidas por transações.
- Permissões por perfil ainda não existem como enforcement de API.
- Health check `/api/health/db` consulta contagens de seed e pode ser confundido com métricas reais.
- `node_modules`, `.vite` e `dist` aparecem no workspace; confirmar `.gitignore`/estado git para evitar artefatos versionados.

## Riscos de Produto

- O menu já mostra áreas não implementadas; isso pode gerar expectativa se for publicado para usuários finais.
- Sem CRUD de cadastros configuráveis, os seeds viram configuração fixa na prática.
- Sem contas a receber calculadas, venda em aberto ainda não tem valor operacional.
- Sem relatórios mínimos, o sistema ainda não substitui cadernos/planilhas.

## Recomendações

- Antes de novos módulos visuais, implementar endpoints base e testes das regras de negócio.
- Definir se o identificador de login será `username` ou `email` antes de criar tela de usuários.
- Criar guardas de permissão reutilizáveis no backend.
- Criar serviços transacionais para estoque e venda em vez de espalhar regras nas rotas.
