/**
 * Transforms raw system/HTTP error strings into polite, customer-friendly messages.
 */
export function formatCustomerError(rawError: unknown, fallbackMessage = "Something went wrong. Please try again in a moment."): string {
  if (!rawError) return fallbackMessage;

  const errorString = typeof rawError === "string" ? rawError : (rawError as Error).message || String(rawError);
  const lower = errorString.toLowerCase();

  if (lower.includes("500") || lower.includes("internal server") || lower.includes("database")) {
    return "We couldn't complete your request right now. Please refresh or try again in a few moments.";
  }

  if (lower.includes("404") || lower.includes("not found")) {
    return "The requested item or page could not be found.";
  }

  if (lower.includes("401") || lower.includes("unauthenticated") || lower.includes("not authenticated")) {
    return "Please sign in to complete this action.";
  }

  if (lower.includes("403") || lower.includes("forbidden") || lower.includes("admin")) {
    return "You don't have permission to perform this action.";
  }

  if (lower.includes("fetch") || lower.includes("network") || lower.includes("failed to fetch")) {
    return "Network connection issue detected. Please check your internet connection and try again.";
  }

  if (lower.includes("required") || lower.includes("invalid") || lower.includes("validation")) {
    return "Please fill in all required fields correctly before submitting.";
  }

  return errorString.length < 100 ? errorString : fallbackMessage;
}
