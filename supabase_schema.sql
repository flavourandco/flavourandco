-- =====================================================================
-- FLAVOUR & CO. - SUPABASE DATABASE SCHEMA & RLS POLICIES
-- Execute this script in your Supabase SQL Editor to establish the database schema.
-- =====================================================================

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    tagline TEXT,
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    why_stand_out JSONB DEFAULT '[]'::jsonb,
    product_details JSONB DEFAULT '[]'::jsonb,
    pack_info TEXT NOT NULL DEFAULT 'Pack of 12',
    price NUMERIC(10, 2) NOT NULL,
    image TEXT NOT NULL,
    images JSONB DEFAULT '[]'::jsonb,
    badge TEXT,
    category TEXT NOT NULL CHECK (category IN ('freshly-baked', 'frozen', 'grazing-box')),
    variants JSONB DEFAULT '[]'::jsonb,
    preparation_options JSONB DEFAULT '[]'::jsonb,
    is_featured BOOLEAN DEFAULT FALSE,
    is_best_seller BOOLEAN DEFAULT FALSE,
    is_new_arrival BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BLOGS TABLE (author_role REMOVED)
CREATE TABLE IF NOT EXISTS public.blogs (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content JSONB NOT NULL DEFAULT '[]'::jsonb,
    writer TEXT NOT NULL DEFAULT 'Simran Gulati',
    date TEXT NOT NULL,
    read_time TEXT NOT NULL DEFAULT '3 min read',
    category TEXT NOT NULL DEFAULT 'General',
    image TEXT NOT NULL,
    image2 TEXT,
    author_avatar TEXT,
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
    product_name TEXT,
    name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migration commands for existing database deployments:
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS product_name TEXT;

-- Orders tracking columns migration:
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS courier_name TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_number TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_url TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS estimated_delivery TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS refund_amount NUMERIC(10, 2);

-- 4. WHOLESALE INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.wholesale_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    business_type TEXT NOT NULL,
    estimated_volume TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'contacted', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CONTACT INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'replied', 'resolved')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    user_id TEXT,
    idempotency_key TEXT,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    shipping_address JSONB DEFAULT '{}'::jsonb,
    shipping_method TEXT DEFAULT 'Standard Express Delivery',
    payment_method TEXT DEFAULT 'Square Credit Card',
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('paid', 'pending', 'refunded', 'failed', 'canceled')),
    square_payment_id TEXT,
    square_transaction_id TEXT,
    square_receipt_url TEXT,
    items JSONB DEFAULT '[]'::jsonb,
    subtotal NUMERIC(10, 2) DEFAULT 0.00,
    shipping_fee NUMERIC(10, 2) DEFAULT 0.00,
    tax_amount NUMERIC(10, 2) DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('completed', 'processing', 'shipped', 'pending', 'cancelled')),
    items_count INTEGER DEFAULT 1,
    fulfillment_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. USERS TABLE (Synced via Clerk)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_user_id TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'user',
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. PAYMENT ATTEMPTS TABLE (Tracking Server-Authoritative Attempts & Idempotency)
CREATE TABLE IF NOT EXISTS public.payment_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    order_number TEXT NOT NULL,
    user_id TEXT,
    idempotency_key TEXT UNIQUE NOT NULL,
    square_payment_id TEXT,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'AUD',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'canceled')),
    raw_response JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. WEBHOOK EVENTS TABLE (Square Webhook Event Deduplication & Idempotency)
CREATE TABLE IF NOT EXISTS public.webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id TEXT UNIQUE NOT NULL,
    event_type TEXT NOT NULL,
    status TEXT DEFAULT 'processed' CHECK (status IN ('processed', 'ignored', 'failed')),
    payload JSONB DEFAULT '{}'::jsonb,
    processed_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- INDEXES FOR FAST QUERYING
-- =====================================================================

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs(slug);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews(status);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wholesale_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Products Policies
DROP POLICY IF EXISTS "Public Products Read" ON public.products;
CREATE POLICY "Public Products Read" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admin Products All" ON public.products FOR ALL USING (true);

-- Blogs Policies
DROP POLICY IF EXISTS "Public Blogs Read" ON public.blogs;
CREATE POLICY "Public Blogs Read" ON public.blogs FOR SELECT USING (published = true OR auth.role() = 'service_role');
CREATE POLICY "Admin Blogs All" ON public.blogs FOR ALL USING (true);

-- Reviews Policies
DROP POLICY IF EXISTS "Public Reviews Read" ON public.reviews;
CREATE POLICY "Public Reviews Read" ON public.reviews FOR SELECT USING (status = 'approved' OR auth.role() = 'service_role');
CREATE POLICY "Public Reviews Insert" ON public.reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Reviews All" ON public.reviews FOR ALL USING (true);

-- Wholesale Inquiries Policies
CREATE POLICY "Public Wholesale Insert" ON public.wholesale_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Wholesale All" ON public.wholesale_inquiries FOR ALL USING (true);

-- Contact Inquiries Policies
CREATE POLICY "Public Contact Insert" ON public.contact_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Contact All" ON public.contact_inquiries FOR ALL USING (true);

-- Orders Policies
CREATE POLICY "Admin Orders All" ON public.orders FOR ALL USING (true);

-- Users Policies
DROP POLICY IF EXISTS "Public Users Select" ON public.users;
CREATE POLICY "Public Users Select" ON public.users FOR SELECT USING (true);
CREATE POLICY "Public Users Insert" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Users Update" ON public.users FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public Users Delete" ON public.users FOR DELETE USING (true);

-- 7. SUBSCRIBERS TABLE
CREATE TABLE IF NOT EXISTS public.subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    discount_code TEXT DEFAULT 'PIECLUB10',
    discount_used BOOLEAN DEFAULT FALSE,
    first_order_id TEXT,
    source TEXT DEFAULT 'offer_modal',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscribers_email ON public.subscribers (LOWER(email));
CREATE INDEX IF NOT EXISTS idx_subscribers_discount_used ON public.subscribers (discount_used);

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Subscribers Insert" ON public.subscribers;
CREATE POLICY "Public Subscribers Insert" ON public.subscribers FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public Subscribers Select" ON public.subscribers;
CREATE POLICY "Public Subscribers Select" ON public.subscribers FOR SELECT USING (true);
CREATE POLICY "Admin Subscribers All" ON public.subscribers FOR ALL USING (true);

