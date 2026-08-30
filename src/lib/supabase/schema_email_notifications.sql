-- =====================================================================
-- FLAVOUR & CO. - TRANSACTIONAL EMAIL NOTIFICATIONS SCHEMA
-- =====================================================================

-- 1. EMAIL NOTIFICATIONS AUDIT & IDEMPOTENCY LOG
CREATE TABLE IF NOT EXISTS public.email_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    order_number TEXT NOT NULL,
    channel TEXT NOT NULL DEFAULT 'email',
    event TEXT NOT NULL,
    recipient TEXT NOT NULL,
    template TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'skipped')),
    provider_message_id TEXT,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. UNIQUE INDEX FOR STRICT DEDUPLICATION & IDEMPOTENCY
-- Guarantees the same event for the same order is never sent to the same recipient more than once.
CREATE UNIQUE INDEX IF NOT EXISTS idx_email_notifications_order_event_recipient 
ON public.email_notifications(order_number, event, recipient);

-- 3. INDEXES FOR PERFORMANCE & AUDIT QUERIES
CREATE INDEX IF NOT EXISTS idx_email_notifications_order_id ON public.email_notifications(order_id);
CREATE INDEX IF NOT EXISTS idx_email_notifications_order_number ON public.email_notifications(order_number);
CREATE INDEX IF NOT EXISTS idx_email_notifications_event ON public.email_notifications(event);
CREATE INDEX IF NOT EXISTS idx_email_notifications_created_at ON public.email_notifications(created_at DESC);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.email_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin Email Notifications All" ON public.email_notifications FOR ALL USING (true);
