# EDREN

**Vision:** Build a simple, reliable internal management system for EDREN that tracks the operational life of each product variation from collection and stock entry through sale, payment, stock movement, and basic reporting.
**For:** EDREN owners, administrative staff, sellers/operators, and people responsible for products, stock, customers, sales, and receivables.
**Solves:** Replaces notebooks and spreadsheets with a centralized system that shows what is in stock, where it is, what was sold, what was paid, and what is still receivable.

## Goals

- Deliver an MVP that supports EDREN's core daily operation: products, SKUs, stock, customers, sales, payments, and receivables.
- Keep the first version small enough to ship and use in practice, postponing advanced finance, commission, e-commerce, and automation features.
- Preserve operational history for sales, payments, and stock movements so reports and corrections remain trustworthy.

## Tech Stack

**Core:**

- Frontend: Vite + React + TypeScript + Tailwind CSS + shadcn/ui
- Backend: Fastify
- Database: PostgreSQL
- ORM: Prisma

**Key dependencies and infrastructure:**

- Package manager: npm
- Repository structure: npm workspaces monorepo
- Frontend libraries: TanStack Router, TanStack Query, TanStack Table, React Hook Form, Zod, Sonner, Lucide React
- UI utilities: class-variance-authority, clsx, tailwind-merge
- Image storage: Cloudinary
- Deployment target: VPS with Nginx, PM2, and Cloudflared Tunnel
- API exposure: frontend consumes backend through Nginx at `/api`; no public API domain

## Scope

**MVP includes:**

- Authentication with username and password.
- Basic users and profile-based permissions.
- Configurable registrations for size grids, sizes, categories, colors, stock locations, sales channels, and payment methods.
- Initial seeds for profiles, default size grid, categories, colors, stock locations, sales channels, payment methods, and `Cliente Balcao`.
- Collections.
- Products with commercial reference/code.
- SKUs/product variations identified by product + color + size.
- Product images through Cloudinary, with database support for multiple images and an initial interface focused on one main image.
- Customers.
- Stock balances by SKU and location.
- Stock entries and stock movements.
- Condicional and sacoleira handling only as stock movements with a responsible customer/person, not as full modules.
- Sales, sale items, payments, partial payments, and calculated receivables.
- Full-sale cancellation with stock return and payment cancellation/estorno.
- Simple home panel and minimum reports using filters and totals.
- Manual initial stock entry by SKU and location.
- Manual stock adjustment restricted to administrators.
- Fast point-of-sale flow with product reference search.
- Operational reports prioritized for sales of the day, receivables, and stock by reference.

**Explicitly out of scope for MVP:**

- Full condicional module with deadlines, alerts, detailed return/acerto flow, and specific reports.
- Full sacoleira/revendedora module with acertos, deadlines, and specific reports.
- Commissions.
- Expenses.
- Formal installments, carnê, interest, fines, and automatic collection.
- Detailed exchanges and partial returns.
- E-commerce or public customer ordering.
- WhatsApp, Instagram, payment gateway, invoice, barcode, or label-printer integrations.
- Native mobile app.
- Advanced production, accounting, fiscal, BI, AI, dashboards, charts, or exports.
- Custom per-user permissions.

## Business Rules

- Users authenticate with a unique `username` and password, not email.
- User records include display name, username, password hash, profile, and active/inactive status.
- Authentication uses server-side session cookies with `HttpOnly`, `Secure` in production, and `SameSite=Lax`.
- JWT is not part of the MVP authentication strategy.
- CORS is not required by default because frontend and API are served from the same origin via `/api`; Vite and Nginx should proxy `/api` to Fastify.
- In the MVP, a "piece" means a SKU/product variation with quantity, not an individually tracked unit.
- Stock is controlled by SKU and location.
- Product commercial reference belongs to the product; SKUs are product + color + size.
- Cost is optional in the MVP.
- Product reference is required, unique, manually entered, and follows EDREN's continuous sequence.
- Product reference belongs to the product and does not repeat across collections.
- Reworked or repaginated models receive a new product reference.
- Product sale price and product cost are stored on the product, not on the SKU.
- Product image is optional.
- Product belongs to a collection; initial collections include `Solar`, `Signature`, `Luar`, `Apaixonadas pelo Brasil`, and `Avulsas / Sem colecao definida`.
- Confirmed sales reduce stock immediately, even when payment is partial or open.
- Sales can include a simple sale-level discount with a required reason when applied.
- Sales can have multiple payments.
- Every sale must have a responsible user and a required sales channel.
- Sales can be entered after they occurred, preserving both sale date and entry date.
- Sales with open balance require a real registered customer.
- Fully paid quick sales may use seeded `Cliente Balcao`.
- Receivables are calculated from sale total minus active payments.
- Open receivables may exist without a required due date.
- Payments may be partial and can be canceled/estornados with a required reason; they are not physically deleted after being linked to a sale.
- Partial payments may include an optional note.
- Only administrators can mark payments as received in the MVP.
- Sales are not physically deleted; they can be canceled with a required reason.
- Only administrators can cancel sales in the MVP.
- Sales can only be canceled on the same day as the sale in the MVP.
- Canceling a full sale returns stock to the original stock location and cancels/estorna linked payments.
- Stock movements are not physically deleted; corrections use inverse movement or controlled cancellation.
- Every stock movement must have a required reason, manual or generated automatically by the system.
- Condicional and sacoleira movements may originate from Casa EDREN or Fabrica.
- Products/SKUs and customers with history are inactivated instead of deleted.
- Users are inactivated instead of deleted when they have history.
- Condicional is not a sale; sacoleira is not a sale until acerto/sale confirmation.
- Condicional and sacoleira stock movements reserve stock and keep a responsible person/customer link.
- Real customers require name and WhatsApp; WhatsApp must be unique.
- Customers can be classified at least as final customer or sacoleira/revendedora.
- Customer city, neighborhood, usual size, preferences, and notes are optional.
- No customer credit limit is required in the MVP.
- Administrator-only actions include canceling sales, adjusting stock, marking payments as received, changing prices, creating/updating products, viewing cost, and accessing receivables.
- Manager/seller can apply sale discount but cannot change registered product price.

## Initial Seeds

- Profiles: `Administrador`, `Gerente`, `Vendedor/Operador`.
- Size grid: `Grade Feminina P ao GG` with `P`, `M`, `G`, `GG`.
- Categories: `Vestido`, `Blusa`, `Calca`, `Saia`, `Short`, `Macacao`, `Conjunto`, `Outros`.
- Colors: `Preto`, `Branco`, `Off White`, `Azul`, `Verde`, `Vermelho`, `Rosa`, `Amarelo`, `Bege`, `Marrom`, `Estampado`, `Xadrez`, `Outros`.
- Stock locations: `Casa EDREN`, `Fabrica`, `Nova Loja`.
- Initial stock location status: `Casa EDREN` active, `Fabrica` active, `Nova Loja` future/inactive.
- Sales channels: `Casa EDREN`, `WhatsApp`, `Instagram`, `Atacado`, `Sacoleira / Revendedora`, `Nova loja`, `Evento EDREN`.
- Payment methods: `Pix`, `Dinheiro`, `Cartao de credito`, `Cartao de debito`, `Em aberto / contas a receber`.
- Customer: `Cliente Balcao` for fully paid quick sales.
- Collections: `Solar`, `Signature`, `Luar`, `Apaixonadas pelo Brasil`, `Avulsas / Sem colecao definida`.

## Minimum Reports

- Sales by period.
- Sales of the day.
- Sales of the month.
- Stock by product/SKU.
- Stock by location.
- Receivables.
- Customers with open balance.
- Sales by collection.
- Sales by channel.
- Stock by reference.

## Constraints

- Timeline: TBD.
- Technical: Start with local development; published dev environment on VPS is not required initially.
- Technical: The API must not be publicly exposed through a separate domain.
- Technical: Avoid exposing auth tokens to browser JavaScript; use HTTP-only session cookies instead.
- Technical: Backups should be documented initially and implemented as basic scripts when the VPS deploy phase starts.
- Product: Prioritize a small, usable MVP over a broad system.

## Visual Identity

- The interface should be predominantly light, elegant, serene, modern, and welcoming.
- Primary brand color: EDREN green `#294F40` for main actions, titles, active navigation, and strong brand presence.
- Supporting brand color: bright ivory `#FFD699` for subtle highlights, badges, hover states, and decorative emphasis.
- Base system colors should use warm light surfaces: background `#FFF8ED`, surface `#FFFCF6`, muted surface `#F6EAD8`, text `#213D33`, muted text `#6F6558`.
- Avoid a dark theme as the default visual identity.
- Avoid generic, cold, overly technological, overly colorful, or e-commerce-like visuals.
- Use the textual brand `EDREN / VESTUARIO FEMININO` if official logo assets are not available; do not invent a symbol or icon as a logo.
- Prioritize readable UI typography for tables, forms, menus, filters, reports, and operational data.
- Use `docs/context/GUIA_IDENTIDADE_VISUAL_EDREN.md` as the detailed visual guidance for frontend work.

## Context Documents

- `docs/context/PROJECT_ORIGINAL_BRIEF.md`: original broad project brief.
- `docs/context/DEVOLUTIVA_TECNICA_EDREN.md`: technical scope reduction and MVP recommendation.
- `docs/context/DECISOES_FINAIS_ESPECIFICACAO_EDREN.md`: final practical decisions used to create this official project specification.
- `docs/context/GUIA_IDENTIDADE_VISUAL_EDREN.md`: visual identity guidance for the frontend.
- `docs/context/DECISOES_OPERACIONAIS_EDREN.md`: operational decisions from EDREN discovery used to model products, stock, customers, sales, payments, reports, and permissions.
