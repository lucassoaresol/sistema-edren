# Contributing

## Branches

- `main`: stable branch for released or production-ready code.
- `develop`: integration branch for ongoing work before release.

Create feature, fix, and chore branches from `develop`, then merge back into `develop` after review and verification.

## Commits

Use Conventional Commits:

```text
<type>(optional-scope): <description>
```

Common types:

- `feat`: new user-facing capability.
- `fix`: bug fix.
- `docs`: documentation-only change.
- `style`: formatting-only change.
- `refactor`: code change that is neither a feature nor a fix.
- `test`: test-only change.
- `chore`: maintenance, tooling, or repository setup.

Examples:

```text
feat(auth): add password reset flow
fix(api): handle missing customer email
docs: document branch strategy
chore: initialize project specs
```

## Specs e Rastreabilidade

- Toda spec/tarefa concluída deve ter pelo menos um commit associado.
- Só marque uma spec como concluída depois de executar a validação aplicável e criar o commit.
- Registre o hash curto do commit na spec, no `tasks.md`, no summary ou no changelog da entrega.
- Use commits atômicos: uma mudança lógica por commit.
- Se uma entrega tiver documentação, backend, frontend e testes independentes, prefira commits separados quando isso melhorar revisão e rollback.

Fluxo obrigatório ao concluir uma spec:

1. Rodar as validações definidas na spec.
2. Conferir `git status` e `git diff`.
3. Apresentar a entrega para revisão do usuário e aguardar aprovação para commit.
4. Commitar apenas os arquivos da entrega após aprovação.
5. Usar Conventional Commit.
6. Apresentar o commit para aprovação antes de qualquer push.
7. Atualizar a spec com o commit associado, quando aplicável.

## Arquivos Grandes

- Não adotar um limite fixo de linhas como regra principal.
- Preferir decompor arquivos quando começarem a reunir responsabilidades demais, como validação, regra de negócio, serialização, estado e UI no mesmo lugar.
- Tratar arquivos muito grandes como sinal de revisão arquitetural, especialmente em rotas, páginas e clientes de API.
- Antes de crescer um módulo, extrair fronteiras naturais de domínio e preservar comportamento com testes.

Exemplos para specs:

```text
docs(specs): add catalog service layer roadmap spec
feat(catalog): add product and collection management
refactor(catalog): extract product serialization service
test(catalog): cover product reference duplication
```
