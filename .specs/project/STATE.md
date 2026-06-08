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
- Product cost is optional in the MVP.
- Sales with open balance require a real customer; fully paid quick sales may use seeded `Cliente Balcao`.
- Sales, payments, and stock movements should preserve history and avoid physical deletion.
- Full-sale cancellation is part of the MVP and must return stock, cancel/estornar payments, and require a reason.
- Wrong payments are canceled/estornados with a required reason instead of deleted.
- Model product images for multiple images, but the first interface may support only one main image.
- Start development locally; published dev environment on VPS is not required initially.
- Production target is a VPS with Nginx, PM2, PostgreSQL, Cloudflared Tunnel, and API access through `/api` only.

## Blockers

- None for project specification consolidation.

## Lessons

- The first broad brief was intentionally reduced to a smaller MVP to avoid overbuilding.
- Configuration data should be editable rather than hardcoded: size grids, categories, colors, stock locations, sales channels, and payment methods.
- Receivables can be calculated from sale totals minus active payments; formal installments are not needed in the MVP.

## Todos

- Create the initial npm workspaces monorepo.
- Configure Vite + TypeScript + Tailwind in `apps/web`.
- Configure Fastify in `apps/api`.
- Configure PostgreSQL and Prisma.
- Specify the MVP Foundation feature before implementation.
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
