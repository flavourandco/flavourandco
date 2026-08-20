import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "./client";

export { isSupabaseConfigured };

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";

const getApiKey = () => {
  const envKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (
    envKey &&
    !envKey.includes("your-supabase-service-role-key") &&
    !envKey.includes("example_service_role_key") &&
    !envKey.toLowerCase().includes("example") &&
    envKey.length > 50
  ) {
    return envKey;
  }
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    ""
  );
};

export const getSupabaseServerClient = () => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  return createClient(supabaseUrl, getApiKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};
