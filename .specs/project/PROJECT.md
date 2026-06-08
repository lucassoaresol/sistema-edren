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

- Frontend: Vite + React + TypeScript + Tailwind CSS
- Backend: Fastify
- Database: PostgreSQL
- ORM: Prisma

**Key dependencies and infrastructure:**

- Package manager: npm
- Repository structure: npm workspaces monorepo
- Image storage: Cloudinary
- Deployment target: VPS with Nginx, PM2, and Cloudflared Tunnel
- API exposure: frontend consumes backend through Nginx at `/api`; no public API domain

## Scope

**MVP includes:**

- Authentication with email and password.
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

- In the MVP, a "piece" means a SKU/product variation with quantity, not an individually tracked unit.
- Stock is controlled by SKU and location.
- Product commercial reference belongs to the product; SKUs are product + color + size.
- Cost is optional in the MVP.
- Confirmed sales reduce stock immediately, even when payment is partial or open.
- Sales with open balance require a real registered customer.
- Fully paid quick sales may use seeded `Cliente Balcao`.
- Receivables are calculated from sale total minus active payments.
- Payments may be partial and can be canceled/estornados with a required reason; they are not physically deleted after being linked to a sale.
- Sales are not physically deleted; they can be canceled with a required reason.
- Canceling a full sale returns stock and cancels/estorna linked payments.
- Stock movements are not physically deleted; corrections use inverse movement or controlled cancellation.
- Products/SKUs and customers with history are inactivated instead of deleted.
- Users are inactivated instead of deleted when they have history.
- Condicional is not a sale; sacoleira is not a sale until acerto/sale confirmation.
- Condicional and sacoleira stock movements reserve stock and keep a responsible person/customer link.

## Initial Seeds

- Profiles: `Administrador`, `Gerente`, `Vendedor/Operador`.
- Size grid: `Grade Feminina P ao GG` with `P`, `M`, `G`, `GG`.
- Categories: `Vestido`, `Blusa`, `Calca`, `Saia`, `Short`, `Macacao`, `Conjunto`, `Outros`.
- Colors: `Preto`, `Branco`, `Off White`, `Azul`, `Verde`, `Vermelho`, `Rosa`, `Amarelo`, `Bege`, `Marrom`, `Estampado`, `Xadrez`, `Outros`.
- Stock locations: `Casa EDREN`, `Fabrica`, `Nova Loja`.
- Sales channels: `Loja fisica`, `WhatsApp`, `Instagram`, `Evento`, `Indicacao`, `Nova Loja`, `Sacoleira`, `Outros`.
- Payment methods: `Dinheiro`, `Pix`, `Cartao`, `Crediario`, `Transferencia`, `Link de pagamento`, `Outro`.
- Customer: `Cliente Balcao` for fully paid quick sales.

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

## Constraints

- Timeline: TBD.
- Technical: Start with local development; published dev environment on VPS is not required initially.
- Technical: The API must not be publicly exposed through a separate domain.
- Technical: Backups should be documented initially and implemented as basic scripts when the VPS deploy phase starts.
- Product: Prioritize a small, usable MVP over a broad system.

## Context Documents

- `docs/context/PROJECT_ORIGINAL_BRIEF.md`: original broad project brief.
- `docs/context/DEVOLUTIVA_TECNICA_EDREN.md`: technical scope reduction and MVP recommendation.
- `docs/context/DECISOES_FINAIS_ESPECIFICACAO_EDREN.md`: final practical decisions used to create this official project specification.
