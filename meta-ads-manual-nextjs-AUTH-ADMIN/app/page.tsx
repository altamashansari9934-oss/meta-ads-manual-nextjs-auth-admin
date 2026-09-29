import { redirect } from "next/navigation";
import { getCurrentUserAndProfile, isExpired } from "@/lib/access";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { user, profile } = await getCurrentUserAndProfile();

  if (!user) redirect("/login");
  if (!profile) redirect("/pending");
  if (profile.role === "admin") redirect("/admin/users");
  if (profile.access_status === "blocked") redirect("/blocked");
  if (profile.access_status === "revoked") redirect("/revoked");
  if (profile.access_status !== "approved") redirect("/pending");
  if (isExpired(profile)) redirect("/expired");

  redirect("/manual");
}
