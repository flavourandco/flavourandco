/**
 * Transforms raw system, payment, database, or HTTP error strings into polite, user-friendly messages.
 * Completely strips machine jargon, error codes, underscores, and technical stack traces.
 */
export function formatCustomerError(
  rawError: unknown,
  fallbackMessage = "Something went wrong. Please try again in a moment."
): string {
  if (!rawError) return fallbackMessage;

  let errorString =
    typeof rawError === "string"
      ? rawError
      : (rawError as Error)?.message || String(rawError);

  if (!errorString || errorString === "[object Object]" || errorString === "[object Error]") {
    return fallbackMessage;
  }

  const upper = errorString.toUpperCase();
  const lower = errorString.toLowerCase();

  // 1. Payment & Card Specific Errors
  if (upper.includes("CARD_NOT_SUPPORTED") || upper.includes("CARD NOT SUPPORTED")) {
    return "Card not supported. Please try a different card.";
  }
  if (upper.includes("INSUFFICIENT_FUNDS")) {
    return "Insufficient funds. Please try another card or account.";
  }
  if (
    upper.includes("CARD_EXPIRED") ||
    upper.includes("INVALID_EXPIRATION") ||
    lower.includes("expiration date")
  ) {
    return "Card has expired. Please check your expiration date.";
  }
  if (
    upper.includes("CVV_FAILURE") ||
    upper.includes("VERIFY_CVV") ||
    upper.includes("INVALID_FEES") ||
    lower.includes("cvv") ||
    lower.includes("security code")
  ) {
    return "Incorrect CVV security code. Please check the 3 digits on the back of your card.";
  }
  if (
    upper.includes("ADDRESS_VERIFICATION_FAILURE") ||
    upper.includes("POSTAL_CODE") ||
    upper.includes("POSTCODE")
  ) {
    return "Postcode does not match the billing address for this card.";
  }
  if (
    upper.includes("GENERIC_DECLINE") ||
    upper.includes("CARD_DECLINED") ||
    upper.includes("DECLINED")
  ) {
    return "Card declined. Please check with your bank or try a different card.";
  }
  if (
    upper.includes("INVALID_CARD") ||
    upper.includes("PAN_FAILURE") ||
    upper.includes("INVALID_ACCOUNT") ||
    lower.includes("card number")
  ) {
    return "Invalid card number. Please check and try again.";
  }
  if (
    upper.includes("ALLOWABLE_PIN_TRIES_EXCEEDED") ||
    upper.includes("CARD_TOKEN_EXPIRED")
  ) {
    return "Payment session expired. Please re-enter your card details.";
  }

  // 2. Database & Schema Errors (PostgREST, Supabase, Postgres)
  if (
    upper.includes("PGRST") ||
    lower.includes("schema cache") ||
    lower.includes("column") ||
    lower.includes("relation") ||
    lower.includes("violates") ||
    lower.includes("database") ||
    lower.includes("sqlstate")
  ) {
    return "We couldn't save your request right now. Please try again in a few moments.";
  }

  // 3. Network & Connection Errors
  if (
    lower.includes("failed to fetch") ||
    lower.includes("networkerror") ||
    lower.includes("network error") ||
    lower.includes("econnrefused") ||
    lower.includes("etimedout") ||
    lower.includes("timeout")
  ) {
    return "Network connection issue. Please check your internet connection and try again.";
  }

  // 4. HTTP & Server Errors
  if (
    lower.includes("500") ||
    lower.includes("502") ||
    lower.includes("503") ||
    lower.includes("504") ||
    lower.includes("internal server")
  ) {
    return "Our servers are experiencing a brief hiccup. Please refresh and try again.";
  }
  if (lower.includes("404") || lower.includes("not found")) {
    return "The requested item could not be found.";
  }
  if (
    lower.includes("401") ||
    lower.includes("unauthenticated") ||
    lower.includes("not authenticated") ||
    lower.includes("unauthorized")
  ) {
    return "Please sign in to continue.";
  }
  if (lower.includes("403") || lower.includes("forbidden")) {
    return "You don't have permission to perform this action.";
  }

  // 5. Form Validation & Syntax Errors
  if (
    lower.includes("json at position") ||
    lower.includes("unexpected token") ||
    lower.includes("cannot read properties") ||
    lower.includes("typeerror")
  ) {
    return fallbackMessage;
  }

  // 6. General Fallback Cleanup (Strips machine prefixes, quotes, and underscores)
  let cleaned = errorString
    .replace(/^error:\s*/i, "")
    .replace(/^authorization\s*error:\s*/i, "")
    .replace(/^payment\s*error:\s*/i, "")
    .replace(/^api\s*error:\s*/i, "")
    .replace(/^square\s*error:\s*/i, "")
    .replace(/['"`]/g, "")
    .replace(/_/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();

  if (!cleaned) return fallbackMessage;

  // Capitalize sentence nicely
  if (cleaned === cleaned.toUpperCase() && cleaned.length > 3) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
  } else {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  return cleaned;
}
