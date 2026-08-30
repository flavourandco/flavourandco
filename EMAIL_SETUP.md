# Transactional Email Notification System (Resend) - Flavour & Co.

This document provides complete instructions for configuring, maintaining, and testing the transactional email notification system for Flavour & Co.

---

## 1. Environment Variables Configuration

Add the following environment variables to your `.env` (or hosting provider environment settings, e.g., Vercel, Supabase, AWS):

```env
# ==============================================================================
# Resend Transactional Email Service
# ==============================================================================
# Secret Resend API key (SERVER-SIDE ONLY - Never prefix with NEXT_PUBLIC_)
RESEND_API_KEY=re_123456789abcdef...

# Verified sender email address
# In Production: "Flavour & Co. <help@flavourandco.com.au>"
EMAIL_FROM="Flavour & Co. <help@flavourandco.com.au>"

# Store Administrator Email Address (receives New Order Received alerts)
ADMIN_EMAIL=help@flavourandco.com.au

# Base Application URL (used to generate "View Order" CTA links in emails)
NEXT_PUBLIC_APP_URL=https://flavourandco.com.au
```

> [!CAUTION]
> - `RESEND_API_KEY` must **never** be exposed in client code or prefixed with `NEXT_PUBLIC_`.
> - All email sending logic is executed exclusively server-side.

---

## 2. Supabase Database Migration

Execute the SQL script located at:
[`src/lib/supabase/schema_email_notifications.sql`](file:///home/prashant-singh/code/client/flavourandco/src/lib/supabase/schema_email_notifications.sql)

in your **Supabase SQL Editor** to create the `email_notifications` audit and idempotency table:

```sql
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

CREATE UNIQUE INDEX IF NOT EXISTS idx_email_notifications_order_event_recipient 
ON public.email_notifications(order_number, event, recipient);

CREATE INDEX IF NOT EXISTS idx_email_notifications_order_id ON public.email_notifications(order_id);
CREATE INDEX IF NOT EXISTS idx_email_notifications_order_number ON public.email_notifications(order_number);
CREATE INDEX IF NOT EXISTS idx_email_notifications_event ON public.email_notifications(event);
CREATE INDEX IF NOT EXISTS idx_email_notifications_created_at ON public.email_notifications(created_at DESC);

ALTER TABLE public.email_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin Email Notifications All" ON public.email_notifications FOR ALL USING (true);
```

---

## 3. Architecture Overview

```
[ Customer Checkout / Webhook / Admin Status Change ]
                         │
                         ▼
        [ Respective API Handler (Square / Orders) ]
                         │
                         ▼ (Async, Safe Side Effect)
         [ Email Notifications Orchestrator ]
                         │
        ┌────────────────┴────────────────┐
        ▼                                 ▼
[ Deduplication & Audit Log ]    [ Resend Client & Dispatch ]
(public.email_notifications)     (Idempotency Key & HTML Templates)
                                                  │
                                                  ▼
                                       [ Recipient Inbox ]
                                (Customer or Admin with Reply-To)
```

### Key Modules:
- **`src/lib/email/resend.ts`**: Server-only client initialization and configuration validation.
- **`src/lib/email/send.ts`**: Core email dispatcher with idempotency check and database logging.
- **`src/lib/email/notifications.ts`**: High-level business notification dispatchers.
- **`src/lib/email/templates/`**: Responsive, inline-styled luxury email templates with Flavour & Co. branding.

---

## 4. Supported Email Events

| Event Name | Recipient | Trigger Point | Subject Line Example |
| :--- | :--- | :--- | :--- |
| `order_confirmed_customer` | Customer | Authoritative payment confirmed | `Order #FC-ORD-1234 Confirmed 🎉` |
| `order_confirmed_admin` | Admin (`ADMIN_EMAIL`) | Authoritative payment confirmed | `🛒 New Order #FC-ORD-1234 Received` (Reply-To: Customer) |
| `order_processing` | Customer | Admin updates order status to `processing` | `Your order #FC-ORD-1234 is being prepared 📦` |
| `order_shipped` | Customer | Admin updates order status to `shipped` | `Your order #FC-ORD-1234 has shipped 🚚` |
| `order_delivered` | Customer | Admin updates order status to `completed` | `Your order #FC-ORD-1234 has been delivered 🎉` |
| `order_cancelled` | Customer | Admin updates order status to `cancelled` | `Your order #FC-ORD-1234 has been cancelled` |
| `order_refunded` | Customer | Admin updates order status to `refunded` | `Your refund for order #FC-ORD-1234 has been processed` |

---

## 5. Duplicate Email Prevention (Idempotency)

1. **Database-Level Deduplication**: Before sending, `sendTransactionalEmail` queries `public.email_notifications` for matching `(order_number, event, recipient)`. If already marked as `sent`, duplicate execution is safely skipped.
2. **Provider-Level Idempotency**: Each outgoing Resend API request attaches an `X-Entity-Ref-ID` idempotency header.
3. **Double-Trigger Safety**: When Square checkout and Square webhook both report `COMPLETED`, whichever arrives first dispatches the email; the subsequent trigger is gracefully skipped.

---

## 6. Failure Isolation

- Email dispatching is designed as a **safe, non-blocking side effect**.
- If Resend API is unreachable or returns an error, the error is recorded in the `email_notifications` log.
- **Customer checkout, payment verification, and order records will NEVER fail due to an email delivery issue.**

---

## 7. Testing Instructions

### Protected Admin Test Endpoint
You can safely test email generation and delivery using the protected admin route:

```http
POST /api/admin/email/test
Content-Type: application/json
```

**Payload Example:**
```json
{
  "event": "order_confirmed_customer",
  "recipientEmail": "your-personal-email@domain.com"
}
```

**Available Events to Test:**
- `order_confirmed_customer`
- `order_confirmed_admin`
- `order_processing`
- `order_shipped`
- `order_delivered`
- `order_cancelled`
- `order_refunded`

> [!NOTE]
> This endpoint is protected with `requireAdminApi()` and requires an authenticated user with admin permissions.
