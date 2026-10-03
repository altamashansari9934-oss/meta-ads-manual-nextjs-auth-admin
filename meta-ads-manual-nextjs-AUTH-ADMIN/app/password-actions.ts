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
    redirect(`/forgot-password?error=${enc("Please enter your registered email address.")}`);
  }

  const supabase = await createSupabaseServerClient();

  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getSiteUrl()}/auth/callback?flow=recovery`,
  });

  // Generic response to avoid revealing whether an email exists.
  redirect(
    `/forgot-password?message=${enc(
      "If an account exists for this email, a password reset link has been sent."
    )}`
  );
}

export async function updatePassword(formData: FormData) {
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (password.length < 8) {
    redirect(
      `/update-password?error=${enc(
        "Your password must be at least 8 characters long."
      )}`
    );
  }

  if (password !== confirmPassword) {
    redirect(`/update-password?error=${enc("The passwords do not match.")}`);
  }

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/forgot-password?error=${enc(
        "This reset link is invalid or has expired. Please request a new password reset link."
      )}`
    );
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(
      `/update-password?error=${enc(
        "We could not update your password. Please request a new password reset link."
      )}`
    );
  }

  await supabase.auth.signOut();

  redirect(
    `/login?message=${enc(
      "Your password has been updated successfully. You can now sign in with your new password."
    )}`
  );
}
