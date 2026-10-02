"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function enc(value: string) {
  return encodeURIComponent(value);
}

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") || "").trim();

  if (!email) {
    redirect(`/forgot-password?error=${enc("Registered email required hai.")}`);
  }

  const supabase = await createSupabaseServerClient();

  const explicitSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const siteUrl = explicitSiteUrl
    ? explicitSiteUrl
    : vercelUrl
      ? (vercelUrl.startsWith("http") ? vercelUrl : `https://${vercelUrl}`)
      : "http://localhost:3000";

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/update-password`,
  });

  // Avoid account enumeration: always show the same user-facing message.
  if (error) {
    redirect(`/forgot-password?message=${enc("Agar ye email registered hai to reset link bhej diya gaya hai.")}`);
  }

  redirect(`/forgot-password?message=${enc("Agar ye email registered hai to reset link bhej diya gaya hai.")}`);
}

export async function updatePassword(formData: FormData) {
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (password.length < 8) {
    redirect(`/update-password?error=${enc("Password minimum 8 characters ka hona chahiye.")}`);
  }

  if (password !== confirmPassword) {
    redirect(`/update-password?error=${enc("Passwords match nahi kar rahe.")}`);
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`/update-password?error=${enc(error.message)}`);
  }

  redirect(`/login?message=${enc("Password successfully update ho gaya. Ab login karein.")}`);
}
