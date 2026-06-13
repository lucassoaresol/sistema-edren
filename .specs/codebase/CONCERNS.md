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
- `apps/web/src/routes/products.tsx` concentra 774 linhas com rota, filtros, formulários, listagem, detalhe, upload de imagem, SKUs e utilitários de data; isso aumenta risco de conflito e regressão a cada evolução de catálogo/estoque.
- `apps/web/src/routes/settings.tsx` concentra 575 linhas com múltiplos cadastros e componentes editáveis; ainda é aceitável, mas já repete padrões de lista editável, estado de carregamento, mutations e invalidação.
- `apps/web/src/lib/api.ts` concentra 418 linhas com tipos, request base, endpoints de autenticação, configurações, catálogo, filtros e upload; tende a crescer rapidamente com estoque/vendas.
- `apps/api/src/modules/catalog/routes.ts` concentra 488 linhas com rotas, regras de negócio, serialização, validações auxiliares e integração Cloudinary; o próximo uso dessas regras por estoque/vendas pode gerar duplicação se não houver camada de serviço.
- `requireAdmin` aparece duplicado em módulos de API (`config` e `catalog`), com mensagens diferentes e sem política reutilizável de autorização.
- Há lógica duplicada de coleção vigente no backend e frontend (`isCurrentCollection`/`endOfDay`), o que pode divergir em bordas de data/fuso.

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
- Priorizar decomposição incremental dos arquivos grandes antes de adicionar estoque e vendas, começando por preservar comportamento com testes existentes.
- Extrair primeiro por fronteiras naturais de domínio, não por abstrações genéricas: coleções, produtos, SKUs, imagens, query keys e serializadores.
- Evitar uma refatoração massiva sem valor imediato; trabalhar em specs técnicas pequenas com critério de aceite e validação por `npm run typecheck`, `npm test` e `npm run build`.
