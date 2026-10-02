"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/site-url";
import { passwordUpdateErrorMessage } from "@/lib/auth-errors";

const RECOVERY_COOKIE = "meta_ads_password_recovery";

function enc(value: string) {
  return encodeURIComponent(value);
}

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") || "").trim();

  if (!email) {
    redirect(`/forgot-password?error=${enc("Registered email required hai.")}`);
  }

  const supabase = await createSupabaseServerClient();
  const siteUrl = getSiteUrl();

  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?flow=recovery`,
  });

  // Intentionally identical for existing/non-existing users to prevent account enumeration.
  redirect(
    `/forgot-password?message=${enc("Agar ye email registered hai to password reset link bhej diya gaya hai.")}`
  );
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

  const cookieStore = await cookies();
  const isRecovery = cookieStore.get(RECOVERY_COOKIE)?.value === "1";

  if (!isRecovery) {
    redirect(
      `/forgot-password?error=${enc("Password reset session invalid ya expire ho gaya hai. Naya reset link request karein.")}`
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    cookieStore.delete(RECOVERY_COOKIE);
    redirect(
      `/forgot-password?error=${enc("Password reset session invalid ya expire ho gaya hai. Naya reset link request karein.")}`
    );
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`/update-password?error=${enc(passwordUpdateErrorMessage(error))}`);
  }

  cookieStore.delete(RECOVERY_COOKIE);
  await supabase.auth.signOut();

  redirect(`/login?message=${enc("Password successfully update ho gaya. Ab new password se login karein.")}`);
}
