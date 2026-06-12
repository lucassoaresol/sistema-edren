# MVP Foundation Spec

**Status:** Implemented retroactively from existing commits.
**Traceability:** Initial foundation release `v0.1.0` and subsequent deploy/bootstrap updates.

## Purpose

Create the technical foundation needed to build EDREN's MVP safely: monorepo structure, frontend shell, API foundation, database schema/seeds, operational documentation, and production-oriented deployment guidance.

## Requirements

- REQ-MVPF-001: The project must use an npm workspaces monorepo with separate apps and packages.
- REQ-MVPF-002: The frontend app must use Vite, React, TypeScript, Tailwind CSS, and EDREN's light visual identity direction.
- REQ-MVPF-003: The API must use Fastify with structured logging, request IDs, centralized error handling, and environment validation.
- REQ-MVPF-004: The database layer must use Prisma with PostgreSQL and load environment configuration correctly from the monorepo root.
- REQ-MVPF-005: Initial Prisma models and seeds must support users/profiles/sessions and configurable operational data needed by the MVP.
- REQ-MVPF-006: The API must expose health endpoints for application and database/seed connectivity checks.
- REQ-MVPF-007: The frontend must be able to consume backend health through the `/api` path.
- REQ-MVPF-008: Production deployment guidance must support VPS, Nginx, PM2, PostgreSQL, Cloudflared Tunnel, and no separate public API domain.

## Out Of Scope

- Full product, SKU, stock, customer, sale, payment, and report workflows.
- Advanced dashboards, exports, integrations, e-commerce, native app, and automation.
- Published dev environment on VPS.

## Validation

- `npm run check`
- `npm audit --audit-level=moderate`
- `GET /api/health`
- `GET /api/health/db`

## Notes

- This spec was added after implementation to restore traceability. Future large features should get a spec before execution.
