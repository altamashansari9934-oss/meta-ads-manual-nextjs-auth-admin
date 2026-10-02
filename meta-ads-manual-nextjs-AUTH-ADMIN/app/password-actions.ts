"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function enc(value: string) {
  return encodeURIComponent(value);
}

function getSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) {
    return vercel.startsWith("http") ? vercel.replace(/\/$/, "") : `https://${vercel}`;
  }

  return "http://localhost:3000";
}

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") || "").trim();

  if (!email) {
    redirect(`/forgot-password?error=${enc("Registered email required hai.")}`);
  }

  const supabase = await createSupabaseServerClient();

  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getSiteUrl()}/auth/callback?flow=recovery`,
  });

  // Generic response to avoid revealing whether an email exists.
  redirect(
    `/forgot-password?message=${enc(
      "Agar ye email registered hai to password reset link bhej diya gaya hai."
    )}`
  );
}

export async function updatePassword(formData: FormData) {
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (password.length < 8) {
    redirect(
      `/update-password?error=${enc(
        "Password minimum 8 characters ka hona chahiye."
      )}`
    );
  }

  if (password !== confirmPassword) {
    redirect(`/update-password?error=${enc("Passwords match nahi kar rahe.")}`);
  }

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/forgot-password?error=${enc(
        "Reset link invalid ya expire ho gaya hai. Naya reset link request karein."
      )}`
    );
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(
      `/update-password?error=${enc(
        "Password update nahi ho saka. Naya reset link request karein."
      )}`
    );
  }

  await supabase.auth.signOut();

  redirect(
    `/login?message=${enc(
      "Password successfully update ho gaya. Ab new password se login karein."
    )}`
  );
}
