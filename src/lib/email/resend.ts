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
 * Ensures the company display name is always "Flavour & Co. <email>"
 * even if EMAIL_FROM only contains a raw email address or generic prefix.
 */
export function getEmailFromAddress(): string {
  const configured = process.env.EMAIL_FROM;
  if (configured && configured.trim().length > 0) {
    const clean = configured.trim().replace(/^["']|["']$/g, "");
    const match = clean.match(/^(?:.*<)?([^<>@\s]+@[^<>@\s]+)>?$/);
    if (match) {
      const email = match[1];
      return `Flavour & Co. <${email}>`;
    }
    return clean;
  }
  return "Flavour & Co. <Orders@flavourandco.com.au>";
}

/**
 * Returns the store primary administrator email for order alerts.
 */
export function getAdminEmailAddress(): string {
  const configured = process.env.ADMIN_EMAIL;
  if (configured && configured.trim().length > 0) {
    return configured.trim().replace(/^["']|["']$/g, "");
  }
  return "info@flavourandco.com.au";
}

/**
 * Returns the backup administrator email for order alerts and fallbacks.
 */
export function getAdminBackupEmailAddress(): string | null {
  const configured = process.env.ADMIN_BACKUP_EMAIL || process.env.BACKUP_ADMIN_EMAIL;
  if (configured && configured.trim().length > 0) {
    const clean = configured.trim().replace(/^["']|["']$/g, "");
    if (clean.length > 0) return clean;
  }
  return null;
}

/**
 * Returns all admin email recipients (primary + backup if configured).
 */
export function getAdminEmailRecipients(): string[] {
  const primary = getAdminEmailAddress();
  const backup = getAdminBackupEmailAddress();
  const list = [primary];
  if (backup && backup.toLowerCase() !== primary.toLowerCase()) {
    list.push(backup);
  }
  return list;
}

/**
 * Returns the public app URL for links in email templates.
 * Directly reads configured URL from environment (e.g. NEXT_PUBLIC_APP_URL).
 */
export function getAppBaseUrl(): string {
  const configured =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

  if (configured && configured.trim().length > 0) {
    let clean = configured.trim().replace(/\/$/, "");
    if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
      clean = `https://${clean}`;
    }
    return clean;
  }
  return "https://flavourandco.vercel.app";
}
