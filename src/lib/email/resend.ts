import { Resend } from "resend";

let resendInstance: Resend | null = null;

/**
 * Validates whether the Resend API key is properly configured server-side.
 */
export function isResendConfigured(): boolean {
  const apiKey = process.env.RESEND_API_KEY;
  return Boolean(
    apiKey &&
      apiKey.trim().length > 10 &&
      !apiKey.includes("your_resend_api_key") &&
      !apiKey.includes("re_example")
  );
}

/**
 * Returns a singleton instance of the Resend client.
 * Server-only execution. Throws or returns null if not configured.
 */
export function getResendClient(): Resend | null {
  if (typeof window !== "undefined") {
    throw new Error("Security Violation: Resend client must only be initialized server-side.");
  }

  if (!isResendConfigured()) {
    return null;
  }

  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY!.trim();
    resendInstance = new Resend(apiKey);
  }

  return resendInstance;
}

/**
 * Returns the configured default sender email.
 * Falls back to "Flavour & Co. <onboarding@resend.dev>" in development if unset.
 */
export function getEmailFromAddress(): string {
  const configured = process.env.EMAIL_FROM;
  if (configured && configured.trim().length > 0) {
    return configured.trim();
  }
  return "Flavour & Co. <onboarding@resend.dev>";
}

/**
 * Returns the store administrator email for order alerts.
 */
export function getAdminEmailAddress(): string {
  const configured = process.env.ADMIN_EMAIL;
  if (configured && configured.trim().length > 0) {
    return configured.trim();
  }
  return "help@flavourandco.com.au";
}

/**
 * Returns the public app URL for links in email templates.
 */
export function getAppBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL;
  if (configured && configured.trim().length > 0) {
    return configured.trim().replace(/\/$/, "");
  }
  return "http://localhost:3000";
}
