# Sistema EDREN

Sistema interno de gestão da EDREN, focado em acompanhar a vida da peça: coleção, produto, SKU, estoque, venda, pagamento, contas a receber e relatórios operacionais.

O projeto está em fase de MVP. A prioridade atual é construir entregas pequenas, seguras e validadas com a rotina real da EDREN.

## Status do Projeto

- Versão atual do monorepo: `0.1.0`.
- Base técnica, autenticação, cadastros configuráveis e documentação inicial já estão especificados.
- Próximas fatias planejadas: catálogo/produtos, estoque, vendas/pagamentos e relatórios mínimos.
- Planejamento de releases: `docs/releases/PLANEJAMENTO_DE_RELEASES.md`.
- Histórico de mudanças: `CHANGELOG.md`.

## Stack

- Monorepo com npm workspaces.
- Frontend: Vite, React, TypeScript e Tailwind CSS.
- API: Fastify e TypeScript.
- Banco: PostgreSQL com Prisma.
- Deploy previsto: VPS, Nginx, PM2 e Cloudflared Tunnel.

## Estrutura

```text
apps/
  api/       API Fastify
  web/       Frontend React
packages/
  config/    Configuração compartilhada
  database/  Prisma, migrations, seeds e scripts de usuários
  shared/    Tipos/utilitários compartilhados
docs/
  context/   Decisões operacionais e técnicas
  deploy/    Guias de produção
  releases/  Planejamento de releases
.specs/
  features/  Specs por feature
```

## Requisitos

- Node.js `>=22.0.0`.
- npm `>=10.0.0`.
- PostgreSQL disponível para desenvolvimento ou produção.

## Comandos Principais

Instalar dependências:

```bash
npm ci
```

Rodar frontend e API em desenvolvimento:

```bash
npm run dev
```

Rodar typecheck em todos os workspaces:

```bash
npm run typecheck
```

Rodar testes:

```bash
npm test
```

Gerar Prisma Client:

```bash
npm run db:generate
```

Aplicar migrações:

```bash
npm run db:migrate
```

Rodar seeds:

```bash
npm run db:seed
```

Criar administrador inicial:

```bash
npm run users:create-admin
```

Build completo:

```bash
npm run build
```

Validação completa de typecheck e build:

```bash
npm run check
```

## Documentação

- Planejamento de releases: `docs/releases/PLANEJAMENTO_DE_RELEASES.md`.
- Changelog: `CHANGELOG.md`.
- Deploy de produção: `docs/deploy/PRODUCAO.md`.
- Decisões operacionais: `docs/context/DECISOES_OPERACIONAIS_EDREN.md`.
- Devolutiva técnica: `docs/context/DEVOLUTIVA_TECNICA_EDREN.md`.
- Identidade visual: `docs/context/GUIA_IDENTIDADE_VISUAL_EDREN.md`.
- Brief original: `docs/context/PROJECT_ORIGINAL_BRIEF.md`.

## Specs

As specs ficam em `.specs/features` e devem ser atualizadas antes de qualquer mudança funcional relevante.

Specs existentes:

- Fundação do MVP: `.specs/features/mvp-foundation/spec.md`.
- Autenticação por sessão: `.specs/features/session-auth/spec.md`.
- Cadastros configuráveis: `.specs/features/configurable-registrations/spec.md`.

Próximas specs recomendadas:

- Catálogo, coleções, produtos e SKUs.
- Estoque essencial.
- Vendas, pagamentos e recebíveis básicos.
- Painel inicial e relatórios mínimos.

## Fluxo de Release

Antes de cortar uma release:

- Revisar specs afetadas.
- Confirmar migrações e seeds necessários.
- Rodar `npm run typecheck`.
- Rodar `npm test`.
- Rodar `npm run build` ou `npm run check`.
- Validar telas principais em desktop e mobile quando houver UI.
- Atualizar `CHANGELOG.md`.
- Atualizar docs operacionais afetadas.
- Publicar seguindo `docs/deploy/PRODUCAO.md`.

Os marcos sugeridos do MVP estão descritos em `docs/releases/PLANEJAMENTO_DE_RELEASES.md`.

## Pontos de Atenção

- Não usar senha padrão em seed para administrador; usar `npm run users:create-admin`.
- Manter cadastros operacionais configuráveis, evitando listas fixas no código.
- Documentar backup/restauração antes de operar vendas reais em produção.
- Registrar mudanças relevantes no changelog mesmo quando o sistema for apenas interno.
