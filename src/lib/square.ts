import crypto from "crypto";

export interface CreateSquarePaymentInput {
  sourceId: string;
  idempotencyKey: string;
  amountCents: number;
  currency?: string;
  locationId: string;
  referenceId: string;
  buyerEmail?: string;
  note?: string;
}

export interface SquarePaymentResponse {
  success: boolean;
  paymentId?: string;
  status?: string;
  receiptUrl?: string;
  error?: string;
  raw?: Record<string, unknown>;
}

/**
 * Formats technical or raw Square error strings into human-friendly, simplified messages.
 * Removes underscores, authorization prefixes, and tech jargon.
 */
export function humanizePaymentError(raw?: string | null): string {
  if (!raw || typeof raw !== "string") {
    return "Payment failed. Please check your card details and try again.";
  }

  const upper = raw.toUpperCase();

  if (upper.includes("CARD_NOT_SUPPORTED") || upper.includes("CARD NOT SUPPORTED")) {
    return "Card not supported. Please try a different card.";
  }
  if (upper.includes("INSUFFICIENT_FUNDS")) {
    return "Insufficient funds. Please try another card or account.";
  }
  if (upper.includes("CARD_EXPIRED") || upper.includes("INVALID_EXPIRATION") || upper.includes("EXPIRATION")) {
    return "Card has expired. Please check your card expiration date.";
  }
  if (upper.includes("CVV_FAILURE") || upper.includes("VERIFY_CVV") || upper.includes("INVALID_FEES")) {
    return "Incorrect CVV security code. Please check the 3 digits on the back of your card.";
  }
  if (upper.includes("ADDRESS_VERIFICATION_FAILURE") || upper.includes("POSTAL_CODE") || upper.includes("POSTCODE")) {
    return "Postcode does not match the billing address for this card.";
  }
  if (upper.includes("GENERIC_DECLINE") || upper.includes("CARD_DECLINED") || upper.includes("DECLINED")) {
    return "Card declined. Please contact your bank or try a different card.";
  }
  if (upper.includes("INVALID_CARD") || upper.includes("PAN_FAILURE") || upper.includes("INVALID_ACCOUNT")) {
    return "Invalid card number. Please verify the digits.";
  }
  if (upper.includes("ALLOWABLE_PIN_TRIES_EXCEEDED") || upper.includes("CARD_TOKEN_EXPIRED")) {
    return "Payment session expired. Please re-enter your card details.";
  }

  // Fallback cleanup: strip authorization prefixes, quotes, and underscores
  let cleaned = raw
    .replace(/^authorization\s*error:\s*/i, "")
    .replace(/^payment\s*error:\s*/i, "")
    .replace(/^square\s*error:\s*/i, "")
    .replace(/['"`]/g, "")
    .replace(/_/g, " ")
    .trim();

  if (!cleaned) return "Payment could not be processed. Please try again.";

  // Normalize case (e.g. "CARD NOT PROCESSED" -> "Card not processed")
  if (cleaned === cleaned.toUpperCase() && cleaned.length > 3) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
  } else {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  return cleaned;
}

/**
 * Executes a payment call directly to Square Payments API (v2/payments).
 * Server-only execution.
 */
export async function createSquarePayment(
  input: CreateSquarePaymentInput
): Promise<SquarePaymentResponse> {
  const squareAccessToken = process.env.SQUARE_ACCESS_TOKEN;
  const squareEnv = (process.env.SQUARE_ENVIRONMENT || process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT || "sandbox").toLowerCase();

  if (!squareAccessToken || squareAccessToken.includes("EXAMPLE") || squareAccessToken.includes("YOUR_SQUARE")) {
    return {
      success: false,
      error: "Square access token is missing or unconfigured on the server.",
    };
  }

  const baseUrl =
    squareEnv === "production"
      ? "https://connect.squareup.com/v2/payments"
      : "https://connect.squareupsandbox.com/v2/payments";

  try {
    const res = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${squareAccessToken}`,
        "Square-Version": "2024-01-18",
      },
      body: JSON.stringify({
        source_id: input.sourceId,
        idempotency_key: input.idempotencyKey,
        amount_money: {
          amount: input.amountCents,
          currency: input.currency || "AUD",
        },
        location_id: input.locationId,
        reference_id: input.referenceId,
        buyer_email_address: input.buyerEmail,
        note: input.note || "Flavour & Co. Gourmet Order",
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      const detail = data?.errors?.[0]?.detail || data?.errors?.[0]?.code || "Square payment processing failed.";
      return {
        success: false,
        error: humanizePaymentError(detail),
        raw: data,
      };
    }

    const payment = data.payment;
    return {
      success: true,
      paymentId: payment?.id,
      status: payment?.status, // e.g. 'COMPLETED', 'APPROVED', 'PENDING'
      receiptUrl: payment?.receipt_url,
      raw: payment,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to reach Square Payments API";
    return {
      success: false,
      error: humanizePaymentError(errorMsg),
    };
  }
}

/**
 * Cryptographically verifies Square webhook signature using HMAC-SHA256.
 *
 * Signature calculation per Square spec:
 * 1. Notification URL + Raw UTF-8 Request Body.
 * 2. HMAC-SHA256 with Signature Key.
 * 3. Base64 encode and compare with `x-square-hmacsha256-signature` header.
 */
export function verifySquareWebhookSignature(params: {
  signatureHeader: string | null;
  signatureKey: string;
  notificationUrl: string;
  rawBody: string;
}): boolean {
  if (!params.signatureHeader || !params.signatureKey || !params.notificationUrl) {
    return false;
  }

  try {
    const stringToSign = params.notificationUrl + params.rawBody;
    const hmac = crypto.createHmac("sha256", params.signatureKey);
    hmac.update(stringToSign, "utf8");
    const expectedSignature = hmac.digest("base64");

    const headerBuf = Buffer.from(params.signatureHeader);
    const expectedBuf = Buffer.from(expectedSignature);

    if (headerBuf.length !== expectedBuf.length) {
      return false;
    }

    return crypto.timingSafeEqual(headerBuf, expectedBuf);
  } catch (err) {
    console.error("Square webhook signature verification error:", err);
    return false;
  }
}
