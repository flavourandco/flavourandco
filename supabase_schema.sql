-- =====================================================================
-- FLAVOUR & CO. - SUPABASE DATABASE SCHEMA & RLS POLICIES
-- Paste and execute this script in your Supabase SQL Editor.
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
    pack_info TEXT NOT NULL,
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
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. WHOLESALE INQUIRIES TABLE
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

-- 3. CONTACT INQUIRIES TABLE
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

-- 4. ORDERS TABLE (For sales metrics & calculations)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'processing', 'pending', 'cancelled')),
    items_count INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. USERS TABLE (Synced via Clerk Webhook)
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

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wholesale_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Products: Public can READ, Authenticated Service Role can insert/update/delete
CREATE POLICY "Public Products Read" ON public.products FOR SELECT USING (true);
CREATE POLICY "Service Role Products All" ON public.products FOR ALL USING (auth.role() = 'service_role');

-- Wholesale Inquiries: Public can INSERT, Service Role can READ/UPDATE/DELETE
CREATE POLICY "Public Wholesale Insert" ON public.wholesale_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Service Role Wholesale All" ON public.wholesale_inquiries FOR ALL USING (auth.role() = 'service_role');

-- Contact Inquiries: Public can INSERT, Service Role can READ/UPDATE/DELETE
CREATE POLICY "Public Contact Insert" ON public.contact_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Service Role Contact All" ON public.contact_inquiries FOR ALL USING (auth.role() = 'service_role');

-- Orders: Service Role can ALL, Public restricted
CREATE POLICY "Service Role Orders All" ON public.orders FOR ALL USING (auth.role() = 'service_role');

-- Users: Allow read and webhook upsert operations for all
DROP POLICY IF EXISTS "Public Users Read" ON public.users;
DROP POLICY IF EXISTS "Public Users Upsert" ON public.users;

CREATE POLICY "Public Users Select" ON public.users FOR SELECT USING (true);
CREATE POLICY "Public Users Insert" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Users Update" ON public.users FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public Users Delete" ON public.users FOR DELETE USING (true);



-- =====================================================================
-- SEED DATA (PRODUCTS & MOCK ORDERS FOR DASHBOARD STATS)
-- =====================================================================

INSERT INTO public.products (
    id, name, tagline, short_description, description, pack_info, price, image, images, badge, category, is_featured, is_best_seller, is_new_arrival
) VALUES 
(
    'mini-authentic-butter-chicken',
    'Mini Authentic Butter Chicken Pies',
    'A crowd favourite, reimagined in bite-sized form.',
    'Slow-cooked chicken thigh fillets in a rich, velvety butter chicken sauce, wrapped in golden flaky pastry.',
    'Our Mini Authentic Butter Chicken Pies combine slow-cooked chicken thigh fillets with a rich, velvety butter chicken sauce, wrapped in golden flaky pastry for the perfect balance of comfort and flavour.',
    'Pack of 12',
    34.99,
    '/products/butter-chicken-pie.png',
    '["/products/butter-chicken-pie.png", "/products/PHOTOS_Flavour&Co-3.jpg"]'::jsonb,
    'Best Seller',
    'frozen',
    true, true, false
),
(
    'mini-beef-rendang',
    'Mini Beef Rendang Pies',
    'Deeply aromatic, tender beef rendang in golden pastry.',
    'Tender beef slow-cooked in coconut milk and authentic spices.',
    'Simmered for hours in toasted coconut and fresh galangal, lemongrass and kaffir lime, encased in rich pastry.',
    'Pack of 12',
    36.99,
    '/products/beef-rendang-pie.png',
    '["/products/beef-rendang-pie.png", "/products/PHOTOS_Flavour&Co-2.jpg"]'::jsonb,
    'Popular',
    'frozen',
    true, false, true
)
ON CONFLICT (id) DO NOTHING;

-- Seed Sample Orders for Dashboard Calculations
INSERT INTO public.orders (order_number, customer_name, customer_email, total_amount, status, items_count, created_at) VALUES
('ORD-1001', 'Sarah Jenkins', 'sarah@example.com', 124.50, 'completed', 3, NOW() - INTERVAL '1 day'),
('ORD-1002', 'Liam O''Connor', 'liam@example.com', 89.90, 'completed', 2, NOW() - INTERVAL '2 days'),
('ORD-1003', 'Chloe Zhao', 'chloe@example.com', 215.00, 'completed', 5, NOW() - INTERVAL '3 days'),
('ORD-1004', 'David Smith', 'david@example.com', 69.98, 'completed', 2, NOW() - INTERVAL '4 days'),
('ORD-1005', 'Emma Watson', 'emma@example.com', 145.00, 'completed', 4, NOW() - INTERVAL '5 days'),
('ORD-1006', 'Michael Brown', 'michael@example.com', 320.00, 'completed', 8, NOW() - INTERVAL '10 days'),
('ORD-1007', 'Jessica Davis', 'jessica@example.com', 95.00, 'completed', 2, NOW() - INTERVAL '15 days')
ON CONFLICT DO NOTHING;
