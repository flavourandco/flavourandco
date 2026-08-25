# Square Payments Architecture & Developer Documentation

## Overview

This repository uses a **server-authoritative, production-grade payment architecture** for Square Payments integrated into Next.js App Router, Supabase, and Clerk Authentication.

The frontend is **NEVER** treated as the source of truth for payment completion or order amounts. All order totals are calculated on the server using trusted database data, and final order confirmation is driven authoritatively by Square Webhook events (`payment.updated` -> `COMPLETED`).

---

## Complete Architecture & Flow

```
Customer 
  └─► 1. Open Checkout Page
  └─► 2. Validate Clerk Session (auth())
  └─► 3. POST /api/checkout/create-intent ──► Server calculates total from DB ──► Creates Pending Order & PaymentAttempt with Idempotency Key
  └─► 4. Tokenize Card via Square Web Payments SDK (Client) ──► Obtain sourceId token
  └─► 5. POST /api/checkout/square ──► Validates Order & Idempotency ──► Server calls Square Payments API
  └─► 6. Redirects to /checkout/success?orderId=...
  
Square Webhook Service 
  └─► 7. POST /api/webhooks/square (Header: x-square-hmacsha256-signature)
  └─► 8. Verify HMAC-SHA256 Signature ──► Check webhook_events table for deduplication
  └─► 9. Update order in DB (payment_status: 'paid', status: 'completed') ──► Record event_id
```

---

## Key Security Features & Mechanisms

### 1. Authentication & Session Handling
- Every payment API route (`/api/checkout/create-intent`, `/api/checkout/square`) validates the user's Clerk session server-side using `auth()`.
- Orders created by authenticated users are linked to `orders.user_id = userId`.
- Ownership verification prevents users from submitting payment requests for another user's order.

### 2. Server-Authoritative Price Calculation
- The frontend passes item IDs and quantities, but **never price totals**.
- `calculateAuthoritativeOrderTotals()` in `src/lib/orders.ts` fetches trusted product prices directly from the database and recalculates subtotal, shipping fee, tax, and cents total for Square.
- Any client attempts to manipulate item prices are ignored.

### 3. Payment Idempotency Strategy
- When an order intent is created (`POST /api/checkout/create-intent`), a unique, persistent `idempotency_key` is generated and saved in `orders` and `payment_attempts`.
- Retries of the same payment call reuse the **same idempotency key**, preventing duplicate charges even if the user clicks "Pay" multiple times or experiences network retries.

### 4. Authoritative Square Webhooks & HMAC Signature Verification
- Endpoint: `POST /api/webhooks/square`.
- Verifies Square HMAC-SHA256 signatures using `verifySquareWebhookSignature()` in `src/lib/square.ts` against `SQUARE_WEBHOOK_SIGNATURE_KEY`.
- Subscribes to events: `payment.created`, `payment.updated`.
- Event Deduplication: Checked against the `webhook_events` table by `event_id`. Duplicate webhook deliveries are safely acknowledged with HTTP 200 without duplicate database updates or notification dispatches.

### 5. Real-time Status Verification & Success Page
- Page: `/checkout/success?orderId=...`.
- Queries `/api/orders/verify?orderId=...`.
- If payment status is `pending`, automatically polls for state updates while displaying real-time feedback until webhook confirmation completes.

---

## Required Environment Variables

Add the following to your `.env` file (or production deployment settings):

```env
# Client-side Square credentials
NEXT_PUBLIC_SQUARE_APPLICATION_ID=sandbox-sq0idb-I9umGnBny9X_64QmbV3_4A
NEXT_PUBLIC_SQUARE_LOCATION_ID=LHHNA34V5WV0G
NEXT_PUBLIC_SQUARE_ENVIRONMENT=sandbox

# Server-side Square secrets (Do NOT expose to browser)
SQUARE_ACCESS_TOKEN=EAAAl4DZPx052jJ0O6QYXvJvJBHEpRx-FhOQbx27cX_uJXlfQR_PZyIvqDwKF7SB
SQUARE_ENVIRONMENT=sandbox
SQUARE_WEBHOOK_SIGNATURE_KEY=YOUR_SQUARE_WEBHOOK_SIGNATURE_KEY
SQUARE_WEBHOOK_NOTIFICATION_URL=https://YOUR_DOMAIN/api/webhooks/square
```

---

## Database Models & Schema

The following tables exist in Supabase (`supabase_schema.sql` / `schema_payments.sql`):

### `orders`
- `id` (UUID, primary key)
- `order_number` (TEXT, unique)
- `user_id` (TEXT, Clerk user ID)
- `idempotency_key` (TEXT)
- `payment_status` (`pending` | `paid` | `failed` | `canceled` | `refunded`)
- `status` (`pending` | `processing` | `completed` | `shipped` | `cancelled`)
- `square_payment_id`, `square_transaction_id`, `square_receipt_url`
- `items`, `subtotal`, `shipping_fee`, `tax_amount`, `total_amount`

### `payment_attempts`
- `id` (UUID, primary key)
- `order_id` (UUID, references `orders.id`)
- `idempotency_key` (TEXT, unique)
- `square_payment_id` (TEXT)
- `amount` (NUMERIC), `currency` (TEXT)
- `status` (`pending` | `processing` | `completed` | `failed` | `canceled`)
- `raw_response` (JSONB)

### `webhook_events`
- `id` (UUID, primary key)
- `event_id` (TEXT, unique)
- `event_type` (TEXT)
- `status` (`processed` | `ignored` | `failed`)
- `payload` (JSONB)

---

## Square Developer Dashboard Setup

1. **Log in to Developer Dashboard**: Go to [Square Developer Portal](https://developer.squareup.com/apps).
2. **Select Application & Environment**: Choose Sandbox or Production.
3. **Webhooks Configuration**:
   - URL: `https://YOUR_DOMAIN/api/webhooks/square`
   - Events: `payment.created`, `payment.updated`
4. **Copy Webhook Signature Key**:
   - Copy the **Signature Key** for your environment and set `SQUARE_WEBHOOK_SIGNATURE_KEY` in `.env`.

---

## Testing in Square Sandbox

1. Use standard Sandbox test nonces provided by Square (e.g. `cnon:card-nonce-ok`).
2. Run your development server (`npm run dev`).
3. Complete checkout on `/checkout`.
4. Trigger webhooks using Square's Webhook Test tool or `ngrok` forwarding to `http://localhost:3000/api/webhooks/square`.
5. Observe order status transition from `pending` -> `paid` on `/checkout/success`.

---

## Files Created & Changed

| File Path | Action | Description |
| :--- | :--- | :--- |
| `src/lib/square.ts` | **[NEW]** | Square Payments API wrapper & HMAC-SHA256 signature verifier. |
| `src/lib/orders.ts` | **[NEW]** | Authoritative server price lookup and order total calculation. |
| `src/lib/supabase/schema_payments.sql` | **[NEW]** | Schema definition for `payment_attempts` & `webhook_events`. |
| `src/app/api/checkout/create-intent/route.ts` | **[NEW]** | Server route to validate prices and register pending order intent. |
| `src/app/api/webhooks/square/route.ts` | **[NEW]** | Authoritative Square Webhook handler with signature validation & event deduplication. |
| `src/app/api/orders/verify/route.ts` | **[NEW]** | Real-time order payment status verification API. |
| `src/app/checkout/success/page.tsx` | **[NEW]** | Luxury order receipt page with status polling. |
| `SQUARE_PAYMENT_DOCS.md` | **[NEW]** | Complete technical & developer documentation. |
| `src/app/api/checkout/square/route.ts` | **[MODIFY]** | Refactored to server-authoritative flow with persistent idempotency. |
| `src/app/checkout/page.tsx` | **[MODIFY]** | Integrated 2-phase payment intent & checkout flow. |
| `supabase_schema.sql` | **[MODIFY]** | Updated `orders` table schema and added payment tracking tables. |
| `.env` | **[MODIFY]** | Configured `SQUARE_WEBHOOK_SIGNATURE_KEY` and notification URL. |
