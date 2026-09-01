-- ==============================================================================
-- FLAVOUR & CO. SUBSCRIBERS TABLE SCHEMA
-- ==============================================================================

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

-- Indices for rapid lookup
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON public.subscribers (LOWER(email));
CREATE INDEX IF NOT EXISTS idx_subscribers_discount_used ON public.subscribers (discount_used);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_subscribers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_subscribers_timestamp ON public.subscribers;
CREATE TRIGGER trigger_update_subscribers_timestamp
    BEFORE UPDATE ON public.subscribers
    FOR EACH ROW
    EXECUTE FUNCTION update_subscribers_updated_at();
