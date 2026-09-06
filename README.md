# Flavour & Co. — Gourmet Indo-Australian Pies Web Application

Flavour & Co. is a high-performance, artisan e-commerce web application built with **Next.js 16 (App Router)**, **React 19**, **Supabase PostgreSQL**, **Clerk Authentication**, **Square Payments**, **Resend Transactional Email**, **Cloudinary CDN**, and **Zustand** state management.

---

## 📚 Technical Documentation Quick Links

- **[Square Payment Architecture (`SQUARE_PAYMENT_DOCS.md`)](./SQUARE_PAYMENT_DOCS.md)** — Detailed guide on Square Web SDK, idempotency keys, server-authoritative pricing, and webhook signature verification.
- **[Email Configuration Guide (`EMAIL_SETUP.md`)](./EMAIL_SETUP.md)** — Step-by-step setup for Resend transactional order notifications, DNS DKIM/SPF domain verification, and email previews.
- **[Database Migration Guide (`MIGRATION.md`)](./MIGRATION.md)** — SQL schema definitions, indexes, Row Level Security (RLS), and database seed scripts via `scripts/migrate-data.ts`.
- **[API & State Architecture (`API.md`)](./API.md)** — Complete breakdown of all REST API endpoints, Zod schemas, Zustand stores, and Stale-While-Revalidate (SWR) client caching.

---

## 🛠️ Comprehensive Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router & React 19) | Server Components, dynamic SSR & SSG routing, server actions |
| **Language** | TypeScript | Strict type safety across client and server |
| **Database** | Supabase (PostgreSQL) | Relational database with Row Level Security (RLS) & indexing |
| **Authentication** | Clerk Auth (`@clerk/nextjs`) | User sessions, sign-in/up modals, profile sync with Svix webhooks |
| **Payment Gateway** | Square Payments API & Web SDK | Card tokenization, Apple Pay, Google Pay, and server processing |
| **Email Service** | Resend (`resend` & `@react-email/render`) | Automated order confirmation and store admin notification emails |
| **Media & Assets** | Cloudinary CDN | High-performance image hosting & dynamic media transformations |
| **State Management** | Zustand 5 with `persist` | Cart store, UI store, SWR product & blog caches |
| **Skeleton Tooling** | Boneyard JS (`boneyard-js`) | Pixel-perfect layout skeleton loaders |
| **Notifications** | React Hot Toast (`react-hot-toast`) | Global user feedback with automatic error humanization |
| **Validation** | Zod Schema Validation | Runtime type checking on API routes and forms |
| **Styling & Motion** | Tailwind CSS v4, GSAP, Lenis Smooth Scroll | Luxury typography, smooth scrolling, and micro-animations |

---

## 🌟 Key Features & Integrations

### 1. 💳 Square Payments (Production & Sandbox)
- **Zero-Client Price Authority**: Cart totals and product prices are strictly calculated on the server using trusted database records.
- **Idempotency Strategy**: Each checkout intent generates a persistent `idempotency_key` stored in the database to prevent duplicate charges.
- **Square Web SDK**: Embedded card element with automatic Apple Pay & Google Pay support in AUD.
- **Webhook Handlers**: Cryptographically verified HMAC-SHA256 webhook listener (`/api/webhooks/square`) for `payment.updated`, `payment.created`, and `refund.updated`.
- **Humanized Card Errors**: Machine error codes (e.g. `CARD_NOT_SUPPORTED`, `GENERIC_DECLINE`, `CVV_FAILURE`) are automatically translated into polite, clear English messages placed cleanly below the card input.

### 2. 📧 Automated Transactional Emails (Resend)
- **Customer Order Confirmations**: Sends itemized receipt with delivery details, GST breakdown, and order tracking links.
- **Admin Alerts**: Instantly notifies store owners when a new paid order arrives.
- **Inquiry Notifications**: Forwards wholesale and contact form submissions directly to admin inboxes.

### 3. 🚚 Delivery Zones & Courier Tracking
- **Greater Sydney 50km Check**: Enforces delivery zone validation against Australian postcodes.
- **Dynamic Free Delivery Threshold**: Store administrators can update the free shipping cart threshold live from `/admin/dashboard`.
- **Live Courier Redirection**: Generates tracking URLs for Australia Post, StarTrack, Sendle, DHL, and FedEx.

### 4. 🎁 First-Order Subscriber Discounts
- **Pie Club Discount (`PIECLUB10`)**: 10% discount for first-time subscribers verified against past completed orders in Supabase.
- **Offer Popup Modal**: Timed promotional modal with local storage TTL caching.

### 5. 🛡️ User-Friendly Error Handling
- **Master Error Sanitizer (`src/lib/error-formatter.ts`)**: Automatically strips technical jargon, stack traces, database schema errors (PostgREST), and underscores across all toaster notifications and form error states.

---

## 📁 Project Folder Structure

```text
flavourandco/
├── SQUARE_PAYMENT_DOCS.md         # Square payments architecture & webhook guide
├── EMAIL_SETUP.md                 # Resend email templates & domain verification guide
├── MIGRATION.md                   # Database schema setup & seed guide
├── API.md                         # API endpoints catalog & Zod validation schemas
├── README.md                      # Main project documentation
├── supabase_schema.sql            # Master PostgreSQL schema definitions & migrations
├── scripts/
│   └── migrate-data.ts            # Database seeding utility
├── src/
│   ├── app/
│   │   ├── admin/                 # Admin Dashboard (Orders, Products, Blogs, Reviews, Users, Wholesale, Contact, Subscribers)
│   │   ├── api/                   # Server API endpoints (Checkout, Square Webhook, Clerk Webhook, Orders, Settings, Media)
│   │   ├── blog/                  # Public Blog articles & single post view
│   │   ├── cart/                  # Shopping cart & promo code application
│   │   ├── checkout/              # Multi-step checkout with Square Web SDK
│   │   │   └── success/           # Order confirmation & live payment verification
│   │   ├── food-safety/           # Food safety standards & hygiene certifications
│   │   ├── wholesale/             # B2B Wholesale inquiry portal
│   │   ├── contact/               # Contact & customer inquiry form
│   │   ├── profile/               # Customer account profile & order history
│   │   ├── shop/                  # Product catalog with category filtering
│   │   ├── layout.tsx             # Root layout & global providers
│   │   └── page.tsx               # Homepage with GSAP hero & featured pies
│   ├── components/
│   │   ├── checkout/              # Square payment forms & payment method badges
│   │   ├── home/                  # Hero banner, product showcases, offer popup, testimonials
│   │   ├── layout/                # Navbar, Footer, PageLayout, FloatingAdminButton
│   │   ├── orders/                # Receipt modals & tracking status components
│   │   ├── products/              # Product cards, review forms, image galleries
│   │   └── ui/                    # Boneyard skeletons, buttons, modals, toasts
│   ├── lib/
│   │   ├── email/                 # Resend client, React email templates, dispatch helpers
│   │   ├── supabase/              # Supabase server/client SDK & query helpers
│   │   ├── error-formatter.ts     # Master error humanizer & sanitizer
│   │   ├── square.ts              # Square Payments API & HMAC signature verification
│   │   ├── shipping.ts            # Australian postcode zones & delivery calculations
│   │   ├── tracking.ts            # Courier live tracking URL generator
│   │   ├── subscribers.ts         # First-order discount eligibility validation
│   │   └── settings.ts            # Site configuration & delivery thresholds
│   └── store/                     # Zustand Stores (Cart, UI, Products, Blogs)
└── public/                        # Static assets, branding logos, product photography
```

---

## 🚀 Environment Variables (`.env`)

Create a `.env` file in the project root:

```env
# ------------------------------------------------------------------------------
# 1. Supabase PostgreSQL Database & Auth
# ------------------------------------------------------------------------------
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# ------------------------------------------------------------------------------
# 2. Clerk Authentication
# ------------------------------------------------------------------------------
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key
CLERK_SECRET_KEY=sk_test_your_clerk_secret
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
CLERK_WEBHOOK_SECRET=ep_your_clerk_webhook_signing_secret

# ------------------------------------------------------------------------------
# 3. Square Payment Gateway
# ------------------------------------------------------------------------------
NEXT_PUBLIC_SQUARE_APPLICATION_ID=sq0idp-your_square_app_id
NEXT_PUBLIC_SQUARE_LOCATION_ID=your_square_location_id
NEXT_PUBLIC_SQUARE_ENVIRONMENT=production
SQUARE_ENVIRONMENT=production
SQUARE_ACCESS_TOKEN=EAAA_your_square_access_token
SQUARE_WEBHOOK_SIGNATURE_KEY=your_square_webhook_signature_key
SQUARE_WEBHOOK_NOTIFICATION_URL=https://www.flavourandco.com.au/api/webhooks/square

# ------------------------------------------------------------------------------
# 4. Cloudinary Media Asset Hosting
# ------------------------------------------------------------------------------
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# ------------------------------------------------------------------------------
# 5. Resend Transactional Email Service
# ------------------------------------------------------------------------------
RESEND_API_KEY=re_your_resend_api_key
EMAIL_FROM="Flavour & Co. <orders@flavourandco.com.au>"
ADMIN_EMAIL=admin@flavourandco.com.au

# ------------------------------------------------------------------------------
# 6. Application URL & Environment
# ------------------------------------------------------------------------------
NEXT_PUBLIC_APP_URL=https://www.flavourandco.com.au
NODE_ENV=production
```

---

## 🏃 Local Setup & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Database Migration
Execute `supabase_schema.sql` in your Supabase SQL Editor, then seed sample products and blogs:
```bash
npx tsx scripts/migrate-data.ts
```

### 3. Start Development Server
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Security Best Practices
- **Never expose Secret Keys**: `SQUARE_ACCESS_TOKEN`, `SUPABASE_SERVICE_ROLE_KEY`, `CLERK_SECRET_KEY`, and `RESEND_API_KEY` are strictly server-side and never prefixed with `NEXT_PUBLIC_`.
- **HMAC Verification**: All webhooks from Clerk and Square are verified with cryptographic signatures before performing database state mutations.
- **Server Authority**: Product pricing, discounts, shipping fees, and taxes are strictly calculated and validated on the backend.
