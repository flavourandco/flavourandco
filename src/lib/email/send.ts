import { render } from "@react-email/render";
import { getResendClient, getEmailFromAddress, isResendConfigured } from "./resend";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { SendEmailOptions, EmailSendResult } from "./types";

// In-memory deduplication cache to prevent race-condition duplicates (e.g. concurrent webhook + checkout API)
const recentSendCache = new Map<string, number>();

function isRecentDuplicate(key: string): boolean {
  const lastTime = recentSendCache.get(key);
  if (!lastTime) return false;
  // Keep cache for 10 minutes
  if (Date.now() - lastTime > 10 * 60 * 1000) {
    recentSendCache.delete(key);
    return false;
  }
  return true;
}

function markRecentlySent(key: string): void {
  recentSendCache.set(key, Date.now());
  if (recentSendCache.size > 500) {
    const cutoff = Date.now() - 15 * 60 * 1000;
    for (const [k, time] of recentSendCache.entries()) {
      if (time < cutoff) recentSendCache.delete(k);
    }
  }
}

/**
 * Basic email format validator.
 */
function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Core server-side email dispatch function.
 * Features:
 * - Checks in-memory mutex cache for race-condition duplicate prevention.
 * - Checks Supabase `email_notifications` table for persistent event deduplication.
 * - Sends via Resend with clean HTML/React template.
 * - Records delivery / failure status in DB audit log.
 * - Safe non-blocking execution with sanitized logging.
 */
export async function sendTransactionalEmail(options: SendEmailOptions): Promise<EmailSendResult> {
  const {
    to,
    subject,
    react,
    replyTo,
    orderId,
    orderNumber = "ORD-UNKNOWN",
    event,
    templateName,
    idempotencyKey,
  } = options;

  const recipients = Array.isArray(to) ? to : [to];
  const primaryRecipient = recipients[0]?.trim() || "";

  // 1. Validate Recipient Email
  if (!primaryRecipient || !isValidEmail(primaryRecipient)) {
    console.warn(`[EMAIL DISPATCH SKIPPED] Invalid recipient email address: "${primaryRecipient}" for event "${event}".`);
    return {
      success: false,
      error: `Invalid recipient email address: ${primaryRecipient}`,
    };
  }

  // 2. Immediate In-Memory Deduplication (Prevents race conditions between Checkout API & Webhook)
  const cacheKey = `${orderNumber}:${event}:${primaryRecipient}`;
  if (orderNumber && isRecentDuplicate(cacheKey)) {
    console.log(
      `[EMAIL DEDUPLICATED] Notification already dispatched for Order #${orderNumber} [Event: ${event}] to ${primaryRecipient}. Skipping duplicate send.`
    );
    return {
      success: true,
      skipped: true,
    };
  }
  // Reserve the slot immediately
  if (orderNumber) {
    markRecentlySent(cacheKey);
  }

  // 3. Persistent Idempotency Check in Supabase Database
  const supabase = isSupabaseConfigured() ? getSupabaseServerClient() : null;

  if (supabase && orderNumber) {
    try {
      const { data: existingSend, error: selectErr } = await supabase
        .from("email_notifications")
        .select("id, status, provider_message_id")
        .eq("order_number", orderNumber)
        .eq("event", event)
        .eq("recipient", primaryRecipient)
        .eq("status", "sent")
        .maybeSingle();

      if (!selectErr && existingSend) {
        console.log(
          `[EMAIL IDEMPOTENCY] Notification already sent for Order #${orderNumber} [Event: ${event}] to ${primaryRecipient}. Skipping duplicate send.`
        );
        return {
          success: true,
          skipped: true,
          messageId: existingSend.provider_message_id,
        };
      }
    } catch (checkErr) {
      console.warn("[EMAIL IDEMPOTENCY CHECK WARNING]", checkErr);
      // Continue execution safely even if checking DB encountered an issue
    }
  }

  // 3. Verify Resend Configuration
  if (!isResendConfigured()) {
    console.warn(
      `[EMAIL NOTICE] RESEND_API_KEY is not configured on server. Email send skipped for Order #${orderNumber} [Event: ${event}] to ${primaryRecipient}.`
    );
    return {
      success: false,
      error: "RESEND_API_KEY is not configured.",
    };
  }

  const resend = getResendClient();
  if (!resend) {
    return {
      success: false,
      error: "Failed to initialize Resend client.",
    };
  }

  const fromAddress = getEmailFromAddress();
  const headers: Record<string, string> = {};
  if (idempotencyKey) {
    headers["X-Entity-Ref-ID"] = idempotencyKey;
  }

  // 4. Send via Resend API
  try {
    let htmlContent: string | undefined;
    if (react) {
      htmlContent = await render(react);
    }

    const payload: any = {
      from: fromAddress,
      to: recipients,
      subject,
      html: htmlContent,
      headers,
    };

    if (replyTo && replyTo.length > 0) {
      payload.replyTo = replyTo;
    }

    let sendResult = await resend.emails.send(payload);

    // Fallback: If custom domain is not yet verified in DNS, retry once via verified onboarding domain
    if (sendResult.error && (sendResult.error.message.toLowerCase().includes("domain") || sendResult.error.message.toLowerCase().includes("verify") || sendResult.error.message.toLowerCase().includes("not verified"))) {
      console.warn(`[RESEND DOMAIN NOTICE] Domain not verified for "${fromAddress}". Retrying with "Flavour & Co. <onboarding@resend.dev>"...`);
      payload.from = "Flavour & Co. <onboarding@resend.dev>";
      sendResult = await resend.emails.send(payload);
    }

    const { data, error } = sendResult;

    if (error) {
      console.error(`[RESEND API ERROR] Order #${orderNumber} [Event: ${event}] to ${primaryRecipient}:`, error.message);

      // Record failure in DB audit log if possible
      if (supabase) {
        try {
          await supabase.from("email_notifications").upsert(
            {
              order_id: orderId || null,
              order_number: orderNumber,
              channel: "email",
              event,
              recipient: primaryRecipient,
              template: templateName,
              status: "failed",
              error_message: error.message,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "order_number,event,recipient" }
          );
        } catch (dbErr) {
          console.warn("[EMAIL LOG ERROR]", dbErr);
        }
      }

      return {
        success: false,
        error: error.message,
      };
    }

    const providerMessageId = data?.id || `resend_${Date.now()}`;
    console.log(
      `[EMAIL SENT SUCCESSFULLY] Order #${orderNumber} [Event: ${event}] to ${primaryRecipient} (Message ID: ${providerMessageId})`
    );

    // 5. Record Success in DB Audit Log
    if (supabase) {
      try {
        await supabase.from("email_notifications").upsert(
          {
            order_id: orderId || null,
            order_number: orderNumber,
            channel: "email",
            event,
            recipient: primaryRecipient,
            template: templateName,
            status: "sent",
            provider_message_id: providerMessageId,
            error_message: null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "order_number,event,recipient" }
        );
      } catch (dbErr) {
        console.warn("[EMAIL LOG ERROR]", dbErr);
      }
    }

    return {
      success: true,
      messageId: providerMessageId,
    };
  } catch (err: any) {
    const errorMsg = err?.message || "Unknown error sending email via Resend.";
    console.error(`[EMAIL DISPATCH EXCEPTION] Order #${orderNumber} [Event: ${event}]:`, errorMsg);

    if (supabase) {
      try {
        await supabase.from("email_notifications").upsert(
          {
            order_id: orderId || null,
            order_number: orderNumber,
            channel: "email",
            event,
            recipient: primaryRecipient,
            template: templateName,
            status: "failed",
            error_message: errorMsg,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "order_number,event,recipient" }
        );
      } catch (dbErr) {
        console.warn("[EMAIL LOG ERROR]", dbErr);
      }
    }

    return {
      success: false,
      error: errorMsg,
    };
  }
}
