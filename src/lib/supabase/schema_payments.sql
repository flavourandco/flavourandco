-- =====================================================================
-- FLAVOUR & CO. - SQUARE PAYMENTS & WEBHOOKS EXTENSION SCHEMA
-- =====================================================================

-- 1. ADD USER LINKAGE AND EXTRA METADATA TO ORDERS TABLE IF NOT EXISTS
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS user_id TEXT,
ADD COLUMN IF NOT EXISTS idempotency_key TEXT;

-- 2. PAYMENT ATTEMPTS TABLE (Tracking Server-Authoritative Attempts & Idempotency)
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

-- 3. WEBHOOK EVENTS TABLE (Square Webhook Event Deduplication & Idempotency)
CREATE TABLE IF NOT EXISTS public.webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id TEXT UNIQUE NOT NULL,
    event_type TEXT NOT NULL,
    status TEXT DEFAULT 'processed' CHECK (status IN ('processed', 'ignored', 'failed')),
    payload JSONB DEFAULT '{}'::jsonb,
    processed_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- INDEXES FOR FAST QUERYING & DEDUPLICATION
-- =====================================================================

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_idempotency_key ON public.orders(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_orders_square_payment_id ON public.orders(square_payment_id);
CREATE INDEX IF NOT EXISTS idx_payment_attempts_order_id ON public.payment_attempts(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_attempts_idempotency ON public.payment_attempts(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_id ON public.webhook_events(event_id);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

ALTER TABLE public.payment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin Payment Attempts All" ON public.payment_attempts FOR ALL USING (true);
CREATE POLICY "Admin Webhook Events All" ON public.webhook_events FOR ALL USING (true);
