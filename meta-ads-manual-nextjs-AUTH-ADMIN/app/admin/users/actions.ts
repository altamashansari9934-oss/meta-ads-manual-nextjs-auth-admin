"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/access";

type DurationKey = "30d" | "90d" | "1y" | "permanent";
const VALID_DURATIONS = new Set<DurationKey>(["30d", "90d", "1y", "permanent"]);

function getDuration(value: FormDataEntryValue | null): DurationKey {
  const duration = String(value || "permanent") as DurationKey;
  return VALID_DURATIONS.has(duration) ? duration : "permanent";
}

function expiryFromDuration(duration: DurationKey) {
  if (duration === "permanent") return null;

  const now = new Date();
  if (duration === "30d") now.setDate(now.getDate() + 30);
  if (duration === "90d") now.setDate(now.getDate() + 90);
  if (duration === "1y") now.setFullYear(now.getFullYear() + 1);
  return now.toISOString();
}

async function assertUserId(formData: FormData) {
  const userId = String(formData.get("userId") || "").trim();
  if (!userId) throw new Error("Invalid user request.");
  return userId;
}

export async function approveUser(formData: FormData) {
  const userId = await assertUserId(formData);
  const duration = getDuration(formData.get("duration"));
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("profiles")
    .update({
      access_status: "approved",
      access_expires_at: expiryFromDuration(duration),
      approved_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .eq("role", "user");

  if (error) throw new Error("Unable to update user access.");
  revalidatePath("/admin/users");
}

export async function revokeUser(formData: FormData) {
  const userId = await assertUserId(formData);
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("profiles")
    .update({ access_status: "revoked", access_expires_at: null })
    .eq("id", userId)
    .eq("role", "user");

  if (error) throw new Error("Unable to revoke user access.");
  revalidatePath("/admin/users");
}

export async function blockUser(formData: FormData) {
  const userId = await assertUserId(formData);
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("profiles")
    .update({ access_status: "blocked", access_expires_at: null })
    .eq("id", userId)
    .eq("role", "user");

  if (error) throw new Error("Unable to block user access.");
  revalidatePath("/admin/users");
}

export async function restoreUser(formData: FormData) {
  const userId = await assertUserId(formData);
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("profiles")
    .update({
      access_status: "approved",
      access_expires_at: null,
      approved_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .eq("role", "user");

  if (error) throw new Error("Unable to restore user access.");
  revalidatePath("/admin/users");
}
