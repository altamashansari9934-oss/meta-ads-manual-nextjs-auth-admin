"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isExpired, type Profile } from "@/lib/access";

function enc(value: string) {
  return encodeURIComponent(value);
}

export async function signUp(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!name || !email || password.length < 8) {
    redirect(`/signup?error=${enc("Name, email aur minimum 8-character password required hai.")}`);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
    },
  });

  if (error) {
    redirect(`/signup?error=${enc(error.message)}`);
  }

  redirect("/check-email");
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    redirect(`/login?error=${enc(error?.message || "Login failed")}`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  if (!profile) redirect("/pending");

  const p = profile as Profile;

  if (p.role === "admin") redirect("/admin/users");
  if (p.access_status === "blocked") redirect("/blocked");
  if (p.access_status === "revoked") redirect("/revoked");
  if (p.access_status !== "approved") redirect("/pending");
  if (isExpired(p)) redirect("/expired");

  redirect("/manual");
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
