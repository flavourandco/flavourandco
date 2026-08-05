# Flavour & Co. — Database Migration Guide (`MIGRATION.md`)

This guide provides a step-by-step walkthrough for initializing, running, and managing database migrations for the Flavour & Co. web application. The application uses **Supabase PostgreSQL** as the single source of truth for all database records.

---

## 📌 Executive Summary of Migration

1. **Static Data to Supabase**: All product items, journal blog articles, customer reviews, and seed orders have been migrated from in-memory JSON files into relational PostgreSQL tables in Supabase.
2. **`authorRole` Removal**: The `authorRole` field was permanently removed from the database schema, TypeScript types (`BlogPost`), API routes, admin forms, and blog detail pages. Only the author name (`writer`) is retained.
3. **Automated & Reusable**: The migration script `scripts/migrate-data.ts` uses `upsert` operations (`onConflict`), allowing it to be rerun safely anytime without creating duplicate records.

---

## 🛠️ Step-by-Step Migration Guide

### Step 1: Execute SQL Schema Definition in Supabase

Before running the migration script, ensure all PostgreSQL tables, Row Level Security (RLS) policies, and indexes are created in your Supabase project.

1. Open your **[Supabase Dashboard](https://supabase.com/dashboard)**.
2. Navigate to **SQL Editor** on the left menu.
3. Open [`supabase_schema.sql`](./supabase_schema.sql) in your code editor, copy its contents, paste them into the Supabase SQL Editor, and click **Run**.

#### Created Tables:
- `products`: Stores pie catalog, pricing, variants, pack info, badges, category, and feature flags.
- `blogs`: Stores journal articles, slugs, excerpts, content paragraphs, and writer details (**no `author_role`**).
- `reviews`: Stores customer ratings, reviews, verification status, and moderation approval status.
- `users`: Stores user profiles synced from Clerk authentication.
- `orders`: Stores customer purchases, status, and financial metrics for dashboard analytics.
- `wholesale_inquiries`: Stores commercial wholesale inquiry submissions.
- `contact_inquiries`: Stores customer support & contact form submissions.

---

### Step 2: Configure Environment Variables

Ensure your `.env` file contains your active Supabase URL and keys:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your-publishable-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

> **Note**: The `SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security (RLS) policies during data seeding and should be kept secure.

---

### Step 3: Run the Migration Script

Run the automated migration command in your terminal:

```bash
npx tsx scripts/migrate-data.ts
```

#### What Happens During Execution:
```text
🚀 Starting database migration to Supabase...
Connecting to: https://<your-project-ref>.supabase.co
📦 Migrating 11 products to Supabase...
✅ Products migration completed.
📝 Migrating 4 blog posts (authorRole removed)...
✅ Blogs migration completed.
⭐ Migrating 6 customer reviews...
✅ Customer reviews migration completed.
🎉 ALL DATA SUCCESSFULLY MIGRATED TO SUPABASE!
```

---

## 🔄 Re-running Migrations & Resetting Data

- **Re-running**: If you add new items to `scripts/migrate-data.ts`, simply run `npx tsx scripts/migrate-data.ts` again. The script uses `onConflict: "id"` for products and blogs, so existing records are updated while new ones are created.
- **New Environments**: If you spin up a new Supabase project (e.g. for staging or testing), execute `supabase_schema.sql` first, then run `npx tsx scripts/migrate-data.ts` to populate the new database in seconds.

---

## 🔗 Related Documentation
- [Main Project README](./README.md)
- [API Architecture & Routes Guide (`API.md`)](./API.md)
