import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AccessStatus = "pending" | "approved" | "revoked" | "blocked";

export type Profile = {
  id: string;
  email: string | null;
  name: string | null;
  role: "user" | "admin";
  access_status: AccessStatus;
  access_expires_at: string | null;
  approved_at: string | null;
  created_at: string;
};

export function isExpired(profile: Profile) {
  if (!profile.access_expires_at) return false;
  return new Date(profile.access_expires_at).getTime() <= Date.now();
}

export async function getCurrentUserAndProfile() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, profile: null, supabase };

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    return { user, profile: null, supabase };
  }

  return { user, profile: profile as Profile, supabase };
}

export async function requireApprovedUser() {
  const { user, profile, supabase } = await getCurrentUserAndProfile();

  if (!user) redirect("/login");
  if (!profile) redirect("/pending");

  if (profile.role === "admin") {
    return { user, profile, supabase };
  }

  if (profile.access_status === "blocked") redirect("/blocked");
  if (profile.access_status === "revoked") redirect("/revoked");
  if (profile.access_status !== "approved") redirect("/pending");
  if (isExpired(profile)) redirect("/expired");

  return { user, profile, supabase };
}

export async function requireAdmin() {
  const { user, profile, supabase } = await getCurrentUserAndProfile();

  if (!user) redirect("/login");
  if (!profile || profile.role !== "admin") redirect("/manual");

  return { user, profile, supabase };
}
