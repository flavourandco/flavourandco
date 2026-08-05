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
| **Skeleton Tooling** | Boneyard JS (`boneyard-js`) layout-matched skeletons |
| **Notifications** | React Hot Toast (`react-hot-toast`) with custom high z-index overlay |
| **Validation** | Zod Schema Validation |
| **Styling & Motion** | Tailwind CSS v4, GSAP, Lenis Smooth Scroll, Lucide Icons |

---

## 🦴 Skeleton Loaders & Boneyard JS (`boneyard-js`)

This application utilizes **Boneyard JS (`boneyard-js`)** for pixel-perfect, zero-layout-shift skeleton loading screens across all pages where data is loaded dynamically from Supabase or Clerk.

### How it Works
1. **Reusable Skeleton Presets (`src/components/ui/BoneyardSkeleton.tsx`)**:
   - `<BoneyardSkeleton loading={isLoading} name="component-name">`: Universal Boneyard wrapper.
   - `<BoneyardStatCardSkeleton />`: Animated bone placeholders for summary cards in the Admin Dashboard and admin overview pages.
   - `<BoneyardTableSkeleton rows={N} columns={M} />`: Animated skeleton rows for table views (Orders, Products, Blogs, Users, Contact Inquiries, Wholesale Inquiries).
   - `<BoneyardProductCardSkeleton />`: Shimmer skeleton bones matching product grid items on `/shop` and the homepage carousel.
   - `<BoneyardBlogCardSkeleton />`: Shimmer skeleton bones matching article cards on `/blog`.
   - `<BoneyardReviewCardSkeleton />`: Skeleton bones matching customer reviews on product detail pages and `/admin/reviews`.

### For Developers: Auto-Generating Bones
When layout changes are made or new components are added, you can auto-capture exact DOM bones:
1. Ensure your development server is running (`npm run dev`).
2. Execute the Boneyard CLI:
   ```bash
   npx boneyard-js build
   ```
3. Boneyard scans your rendered layout and outputs updated static bone descriptors to registry files.

---

## 🍞 Notifications & React Hot Toast (`react-hot-toast`)

All user notifications, store alerts, and admin status updates use **React Hot Toast (`react-hot-toast`)**.

### Features & Styling
- **Global Provider**: Configured in `src/components/ui/ToastContainer.tsx` and mounted in `src/app/layout.tsx`.
- **Z-Index Layering (`z-[999999]`)**: Styled with `containerStyle: { zIndex: 999999 }` so toasts float cleanly above all Admin backdrop blur modals, popup dialogs, and Lenis scroll containers.
- **Unified Store API**: Calling `useUIStore.getState().addToast(message, type)` automatically triggers `toast.success`, `toast.error`, or standard toasts. You can also import `toast` directly from `react-hot-toast`:
  ```tsx
  import { toast } from "react-hot-toast";

  toast.success("Product created successfully!");
  toast.error("Failed to delete record.");
  ```

---

## 🌀 Lenis Smooth Scroll & Modal Interception

Lenis smooth scroll handles smooth inertia scrolling across the site.
- **Rule for Popup Modals & Drawers**: All backdrop overlays and modal containers **must** include the attribute `data-lenis-prevent` (e.g. `<div data-lenis-prevent className="fixed inset-0 ... overflow-y-auto">`).
- This prevents Lenis from capturing wheel and touch events inside scrollable popup bodies.

---

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
