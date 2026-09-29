"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/access";

type DurationKey = "30d" | "90d" | "1y" | "permanent";

function expiryFromDuration(duration: DurationKey) {
  if (duration === "permanent") return null;

  const now = new Date();

  if (duration === "30d") now.setDate(now.getDate() + 30);
  if (duration === "90d") now.setDate(now.getDate() + 90);
  if (duration === "1y") now.setFullYear(now.getFullYear() + 1);

  return now.toISOString();
}

export async function approveUser(formData: FormData) {
  const userId = String(formData.get("userId") || "");
  const duration = String(formData.get("duration") || "permanent") as DurationKey;

  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("profiles")
    .update({
      access_status: "approved",
      access_expires_at: expiryFromDuration(duration),
      approved_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/users");
}

export async function revokeUser(formData: FormData) {
  const userId = String(formData.get("userId") || "");
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("profiles")
    .update({
      access_status: "revoked",
      access_expires_at: null,
    })
    .eq("id", userId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/users");
}

export async function blockUser(formData: FormData) {
  const userId = String(formData.get("userId") || "");
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("profiles")
    .update({
      access_status: "blocked",
      access_expires_at: null,
    })
    .eq("id", userId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/users");
}

export async function restoreUser(formData: FormData) {
  const userId = String(formData.get("userId") || "");
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("profiles")
    .update({
      access_status: "approved",
      access_expires_at: null,
      approved_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/users");
}
