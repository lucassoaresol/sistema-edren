# Project State

## Decisions

- Use `main` as the stable branch and `develop` as the integration branch.
- Follow Conventional Commits for commit messages.
- Treat root `PROJECT.md` as broad context, not closed MVP scope.
- Use `.specs/project/PROJECT.md` as the official concise project specification.
- MVP focuses on core operations: users, configurable registrations, collections, products, SKUs, stock, customers, sales, payments, receivables, and simple reports.
- In the MVP, a "piece" means SKU/product variation with quantity, not an individually tracked unit.
- Stock is controlled by SKU and location.
- Condicional and sacoleira enter the MVP only as stock movements with a responsible customer/person; full modules are Phase 2.
- Product commercial reference belongs to the product; SKU is identified by product + color + size.
- Product cost is a simple product-level field in the MVP.
- Sales with open balance require a real customer; fully paid quick sales may use seeded `Cliente Balcao`.
- Sales, payments, and stock movements should preserve history and avoid physical deletion.
- Full-sale cancellation is part of the MVP and must return stock, cancel/estornar payments, and require a reason.
- Wrong payments are canceled/estornados with a required reason instead of deleted.
- Model product images for multiple images, but the first interface may support only one main image.
- Start development locally; published dev environment on VPS is not required initially.
- Production target is a VPS with Nginx, PM2, PostgreSQL, Cloudflared Tunnel, and API access through `/api` only.
- Use React with Vite for the frontend because the system will have many internal management screens and reusable UI components.
- Use shadcn/ui as the frontend component foundation.
- Use TanStack Router, TanStack Query, TanStack Table, React Hook Form, Zod, Sonner, and Lucide React for frontend routing, server state, tables, forms, validation, notifications, and icons.
- Use username + password for authentication instead of email + password.
- Use HTTP-only server-side session cookies for authentication; do not use JWT for the MVP.
- Do not enable CORS by default because the frontend and API should run behind the same origin through `/api` in dev and production.
- Follow EDREN's visual identity guide: light, elegant, warm, feminine, modern, and operationally clear.
- Use EDREN green `#294F40` as the primary color and bright ivory `#FFD699` as a supporting highlight.
- Avoid a dark theme as the default frontend identity.
- Start Prisma with non-controversial foundation entities only: users, profiles, sessions, size grids, sizes, categories, colors, stock locations, sales channels, and payment methods.
- Operational discovery has answered the main product, SKU, customer, stock movement, sale, payment, report, and permission rules for the MVP.
- Product references are required, unique, manual, and never reused across collections.
- Product price and cost belong to the product/reference, not SKU.
- Product image is optional.
- Initial stock is entered manually.
- Fabrica and Casa EDREN are active stock locations; Nova Loja starts as future/inactive.
- Every stock movement requires a reason.
- Manual stock adjustment is administrator-only.
- Sales support sale-level discounts, multiple payments, responsible user, required channel, and later entry with actual sale date.
- Real customers require unique WhatsApp; open-balance sales require a real customer.
- Payment receipt, sales cancellation, stock adjustment, product price changes, product create/update, cost visibility, and receivables access are administrator-only in the MVP.
- Sales can only be canceled on the same day in the MVP and return stock to the original location.
- Priority reports are sales of the day, receivables, and stock by reference.

## Blockers

- None currently.

## Lessons

- The first broad brief was intentionally reduced to a smaller MVP to avoid overbuilding.
- Configuration data should be editable rather than hardcoded: size grids, categories, colors, stock locations, sales channels, and payment methods.
- Receivables can be calculated from sale totals minus active payments; formal installments are not needed in the MVP.
- The initial dark frontend screen conflicted with EDREN's visual identity and should be revised toward the light brand palette.
- Prisma config must explicitly load the monorepo root `.env` because `prisma.config.ts` disables Prisma's default environment loading.
- Initial migration and seed were successfully applied to the dev PostgreSQL database after database credentials were corrected.
- The API now loads the root `.env` through `@edren/database` and exposes `/api/health/db` to validate database connectivity and seed counts.
- API environment variables are validated with Zod before server startup.
- API logging uses Fastify/Pino with pretty logs in development, JSON logs in production, and redaction for cookies, authorization, password, and password hashes.
- API errors use `AppError` subclasses plus a centralized error handler with consistent error payloads and request IDs.
- API requests accept `x-request-id` or generate a UUID request id.
- API source should grow by modules under `apps/api/src/modules`, keeping routes, schemas, services, and repositories separated as features are added.
- The frontend now has an internal app shell with EDREN navigation and a dashboard that consumes `/api/health/db` through TanStack Query.
- Vite proxy to `/api` was validated against the Fastify API and PostgreSQL health endpoint.
- Release `v0.1.0` completed as the initial fullstack foundation and published from `main`.
- Initial admin users are not created by seed or default password; use the terminal-only `npm run users:create-admin` script to create the first administrator with an argon2id password hash.
- Session authentication implemented with username/password, argon2 verification, signed HTTP-only cookies, database-backed sessions, `/api/auth/login`, `/api/auth/logout`, and `/api/auth/me`.
- Frontend app shell is protected by `/api/auth/me`; unauthenticated users are redirected to `/login`.
- API route coverage now uses Vitest and covers health routes plus auth login/me/logout behavior.
- Specs were initially used mostly as project memory; retroactive specs now exist for MVP Foundation and Session Auth. Future large features should be specified before implementation.

## Todos

- Specify Configurable Registrations before implementation.
- Model product/sales/stock transaction details from `docs/context/DECISOES_OPERACIONAIS_EDREN.md` when their feature specs are created.
- Add backup documentation and scripts during the VPS deploy phase.

## Deferred Ideas

- Full condicional module with deadlines, alerts, and reports.
- Full sacoleira/revendedora module with acertos and reports.
- Expenses.
- Commissions.
- Formal installments, interest, fines, and automatic collection.
- Exchanges and partial returns.
- Exports, charts, advanced dashboard, and goals.
- E-commerce, WhatsApp/Instagram integrations, payment gateway, invoices, barcode, labels, native mobile app, advanced production, accounting, BI, AI, and marketing automation.

## Preferences

- Keep the MVP simple, reliable, and useful for the real EDREN routine.
- Avoid unnecessary architecture, microsservices, pnpm, yarn, and features that delay the operational core.
