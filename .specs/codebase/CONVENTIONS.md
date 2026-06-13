# Convencoes

## Codigo

- TypeScript em ESM.
- Imports relativos no backend com extensao `.js` nos paths compilados.
- Nomes de arquivos em kebab-case para rotas/componentes utilitarios.
- Componentes React em PascalCase.
- Mensagens e textos de UI estão em português, mas majoritariamente sem acentos por convenção atual do código.
- Banco usa nomes Prisma em ingles e valores enum em maiusculo.

## API

- Rotas publicadas sob `/api`.
- Respostas de auth seguem envelope `{ data: ... }`.
- Erros usam classes em `apps/api/src/lib/errors.ts` e handler central.
- Validacao de entrada com Zod.

## Frontend

- Alias `@/` aponta para `apps/web/src`.
- Estado remoto com TanStack Query.
- Formularios com React Hook Form + Zod.
- Componentes UI pequenos em `src/components/ui`.
- Layout responsivo: sidebar fixa em desktop, header/nav horizontal em mobile.

## Git/Processo

- `CONTRIBUTING.md` recomenda branches `main` e `develop`.
- Commits devem usar Conventional Commits.
- Cada spec/tarefa concluída deve terminar com um commit atômico.
- Não marcar spec como `Implementada`, `Concluída`, `Feita` ou equivalente antes de criar o commit correspondente.
- Registrar na spec, summary ou tasks o hash curto do commit quando a entrega for concluída.
- Preferir um commit por unidade lógica de entrega. Se a spec exigir múltiplas mudanças independentes, dividir em commits menores.
- Commits de specs/documentação usam `docs(...)`; refatorações sem mudança funcional usam `refactor(...)`; features funcionais usam `feat(...)`; correções usam `fix(...)`; testes isolados usam `test(...)`; manutenção usa `chore(...)`.
