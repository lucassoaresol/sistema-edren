# Session Auth Spec

**Status:** Implemented retroactively from existing commits.
**Traceability:** `feat: implement session auth`, related admin bootstrap fixes, and `test: add api route coverage`.

## Purpose

Allow EDREN users to authenticate with username and password through server-side sessions stored in the database and represented in the browser by signed HTTP-only cookies.

## Requirements

- REQ-AUTH-001: Users must authenticate with unique `username` and password, not email.
- REQ-AUTH-002: Password verification must use secure argon2 hashes.
- REQ-AUTH-003: The API must create database-backed sessions on successful login.
- REQ-AUTH-004: Session cookies must be signed, HTTP-only, `SameSite=Lax`, path `/`, and `Secure` in production.
- REQ-AUTH-005: `/api/auth/login` must validate credentials and return the current user payload on success.
- REQ-AUTH-006: `/api/auth/logout` must delete the active session when present and clear the session cookie.
- REQ-AUTH-007: `/api/auth/me` must return the current user or `null` when unauthenticated.
- REQ-AUTH-008: Protected frontend areas must redirect unauthenticated users to `/login`.
- REQ-AUTH-009: Initial administrators must be created through a terminal-only bootstrap script, not seeded with a default password.
- REQ-AUTH-010: API tests must cover unauthenticated user lookup, invalid login, successful login/session cookie, logout, and health routes.

## Out Of Scope

- JWT authentication.
- Password reset flow.
- Per-user custom permissions.
- Full role/permission enforcement for all future MVP modules.
- Multi-factor authentication.

## Validation

- `npm run typecheck`
- `npm run build`
- `npm test`
- Manual API login/me/logout checks during implementation.

## Notes

- Profile-based permission checks still need to be designed and applied as protected business actions are added.
- This spec was added after implementation to restore traceability. Future auth changes should update this spec before coding when behavior changes.
