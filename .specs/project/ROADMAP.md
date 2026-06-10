# Roadmap

**Current Milestone:** MVP Foundation
**Status:** Planning

---

## MVP Foundation

**Goal:** Create the monorepo, base apps, database layer, authentication, and initial configurable data needed for all MVP features.
**Target:** Complete when local development can run frontend, backend, Prisma, and seeded PostgreSQL data.

### Features

**Monorepo Setup** - PLANNED

- Configure npm workspaces.
- Create `apps/web` with Vite, React, TypeScript, Tailwind CSS, and shadcn/ui.
- Create `apps/api` with Fastify.
- Create shared/database package structure as needed.

**Database Foundation** - PLANNED

- Configure PostgreSQL and Prisma.
- Model users, profiles, sessions, configurable registrations, collections, products, SKUs, customers, stock, sales, payments, and movement/cancellation reasons according to operational decisions.
- Add initial seeds for profiles, configuration data, collections, stock locations, sales channels, payment methods, and future/inactive locations.

**Authentication And Permissions** - PLANNED

- Implement username/password login.
- Store passwords with secure hashing.
- Use HTTP-only session cookies.
- Add simple profile-based permissions.
- Support user activation/inactivation.

---

## MVP Operations

**Goal:** Support EDREN's core daily workflow for products, stock, customers, sales, payments, and receivables.
**Target:** Complete when users can register products/SKUs, move stock, sell items, record payments, and view open balances.

### Features

**Configurable Registrations** - PLANNED

- Manage size grids and sizes.
- Manage categories, colors, stock locations, sales channels, and payment methods.

**Products And Collections** - PLANNED

- Manage collections.
- Manage products with commercial reference and optional cost.
- Manage SKUs by product, color, and size.
- Upload one main product image while storing images in a multi-image-ready model.
- Keep product sale price and cost at product/reference level.
- Allow product without image.

**Customers** - PLANNED

- Manage customers.
- Use `Cliente Balcao` for fully paid quick sales.
- Require real customers for sales with open balance.
- Require name and unique WhatsApp for real customers.
- Support final customer and sacoleira/revendedora classification.

**Stock Control** - PLANNED

- Track stock balances by SKU and location.
- Register stock entries.
- Register stock movements.
- Require movement reason.
- Support manual initial stock entry.
- Restrict manual stock adjustment to administrators.
- Support condicional and sacoleira only as stock movements with responsible customer/person.

**Sales And Payments** - PLANNED

- Register sales and sale items.
- Support fast sale flow with product reference search.
- Reduce stock on confirmed sales.
- Support multiple and partial payments.
- Support sale-level discount and discount reason.
- Require responsible user and sales channel.
- Allow sale entry after occurrence while preserving sale date and entry date.
- Calculate receivables from sale total minus active payments.
- Cancel full sales with required reason, stock return, and payment cancellation/estorno.
- Cancel/estornar wrong payments with required reason.
- Restrict payment receipt and sales cancellation to administrators.

---

## MVP Visibility

**Goal:** Provide simple operational visibility without advanced dashboards or exports.
**Target:** Complete when EDREN can answer basic sales, stock, and receivables questions from the system.

### Features

**Home Panel** - PLANNED

- Show practical operational indicators.
- Keep the panel simple and non-graph-heavy.

**Minimum Reports** - PLANNED

- Sales by period, day, and month.
- Stock by product/SKU, reference, and location.
- Receivables and customers with open balance.
- Sales by collection and channel.

---

## Deploy And Operations

**Goal:** Prepare production deployment on the EDREN VPS after the MVP works locally.
**Target:** Complete when production can run through Nginx, PM2, PostgreSQL, and Cloudflared Tunnel.

### Features

**Production Build** - PLANNED

- Build frontend static assets.
- Build backend for PM2 execution.
- Configure environment variables for production.

**VPS Deployment** - PLANNED

- Serve frontend through Nginx.
- Proxy `/api` to local Fastify.
- Keep backend without public API domain.
- Configure PM2 process.

**Backup Preparation** - PLANNED

- Document PostgreSQL backup and restore.
- Add basic backup script during deploy phase.

---

## Phase 2

**Goal:** Expand operational coverage after the MVP is stable in daily use.

### Features

**Condicional Module** - PLANNED

- Dedicated condicional screens.
- Return deadlines.
- Late alerts.
- Condicional-specific reports.

**Sacoleira Module** - PLANNED

- Dedicated sacoleira/revendedora screens.
- Detailed acertos.
- History by sacoleira.
- Sacoleira-specific reports.

**Finance Extensions** - PLANNED

- Expenses.
- Commissions.
- Formal installments.
- Exchanges and partial returns.

**Reporting Extensions** - PLANNED

- Exports.
- Charts.
- Advanced dashboard.
- Goals and comparisons.

---

## Future Considerations

- E-commerce or public customer ordering.
- WhatsApp and Instagram integrations.
- Payment gateway integration.
- Invoice/fiscal integration.
- Barcode and label printer support.
- Native mobile app.
- Advanced production control.
- Advanced accounting, BI, AI, and marketing automation.
- Published dev environment on VPS if needed.
