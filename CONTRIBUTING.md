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
