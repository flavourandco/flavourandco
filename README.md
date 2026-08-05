# Flavour & Co. — Gourmet Indo-Australian Pies Web Application

Flavour & Co. is a modern, high-performance web application built with **Next.js 16 (App Router)**, **React 19**, **Supabase PostgreSQL**, **Clerk Authentication**, and **Zustand** state management.

---

## 📚 Technical Documentation Quick Links

- **[Database Migration Guide (`MIGRATION.md`)](./MIGRATION.md)** — Step-by-step instructions for SQL schema setup and populating Supabase tables using `scripts/migrate-data.ts`.
- **[API & State Architecture (`API.md`)](./API.md)** — Comprehensive breakdown of all API routes, Zod validation schemas, Zustand stores, and Stale-While-Revalidate (SWR) client state flow.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router & React 19) |
| **Language** | TypeScript |
| **Database** | Supabase (PostgreSQL with RLS & Indexes) |
| **Authentication** | Clerk Auth (`@clerk/nextjs`) synced to Supabase `users` table |
| **State Management** | Zustand 5 with `persist` middleware |
| **Validation** | Zod Schema Validation |
| **Styling & Motion** | Tailwind CSS v4, GSAP, Lenis Smooth Scroll, Lucide Icons |

---

## ⚙️ Architecture Under the Hood

```text
Supabase PostgreSQL ──► Server Actions / API Layer ──► Zod Validation ──► Zustand Stores (SWR) ──► UI Components
```

- **Server-Side Data Fetching**: Public pages (`/shop`, `/blog`, `/blog/[slug]`) utilize Next.js **Server Components** and direct Supabase queries (`src/lib/supabase/queries.ts`) for speed and SEO optimization.
- **Client State & SWR**: Interactive client components consume shared state via Zustand stores (`useProductStore`, `useBlogStore`). Products and blogs load instantly from local storage while quietly revalidating against Supabase in the background.
- **Strict Data Security**: Sensitive operations, orders, Clerk session tokens, and admin privileges bypass local storage and query live database records.
- **Admin Dashboard**: Full CRUD management for products, blogs, and customer review moderation connected directly to database mutations.

---

## 📁 Project Folder Structure

```text
flavourandco/
├── MIGRATION.md                   # Step-by-step database migration guide
├── API.md                         # API routes, Zod schemas, & Zustand documentation
├── README.md                      # Main project documentation & overview
├── supabase_schema.sql            # Complete PostgreSQL database schema definition
├── scripts/
│   └── migrate-data.ts            # Reusable script to seed Supabase database
├── src/
│   ├── app/
│   │   ├── admin/                 # Admin Dashboard pages (products, blogs, reviews, users)
│   │   ├── api/                   # API Route endpoints (products, blogs, reviews, auth, stats)
│   │   ├── blog/                  # Public Blog pages (/blog & /blog/[slug])
│   │   ├── shop/                  # Public Shop pages (/shop & /shop/[slug]/[id])
│   │   ├── layout.tsx             # Root layout & providers
│   │   └── page.tsx               # Homepage
│   ├── components/
│   │   ├── blog/                  # Blog cards & components
│   │   ├── home/                  # Homepage hero, products, navbar, testimonials
│   │   ├── layout/                # PageLayout, Footer, UserSyncListener
│   │   ├── products/              # Product cards, reviews, related products
│   │   └── ui/                    # Reusable UI primitives (Buttons, Modals, Inputs)
│   ├── lib/
│   │   ├── supabase/              # Supabase server/client SDK & direct queries
│   │   ├── validations/           # Zod validation schemas (product, blog, review)
│   │   ├── auth.ts                # Clerk admin authorization helpers
│   │   ├── data.ts                # UI constants & fallback definitions
│   │   └── types.ts               # Global TypeScript interface models
│   └── store/                     # Zustand Stores (auth, product, blog, ui, admin)
└── public/                        # Static media assets & product images
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your-publishable-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
CLERK_SECRET_KEY=<your-clerk-secret-key>
```

### 3. Initialize Database & Run Migration
Refer to the **[Database Migration Guide (`MIGRATION.md`)](./MIGRATION.md)** to execute `supabase_schema.sql` and run:

```bash
npx tsx scripts/migrate-data.ts
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the site.

---

## 📑 Detailed Guides
- 📖 Read **[Database Migration Guide (`MIGRATION.md`)](./MIGRATION.md)** for data seeding details.
- 🔌 Read **[API & State Architecture (`API.md`)](./API.md)** for endpoint catalog and Zod/Zustand logic.
