import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isExpired, type Profile } from "@/lib/access";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ allowed: false, redirectTo: "/login" });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ allowed: false, redirectTo: "/pending" });
  }

  const p = profile as Profile;

  if (p.role === "admin") return NextResponse.json({ allowed: true });
  if (p.access_status === "blocked") return NextResponse.json({ allowed: false, redirectTo: "/blocked" });
  if (p.access_status === "revoked") return NextResponse.json({ allowed: false, redirectTo: "/revoked" });
  if (p.access_status !== "approved") return NextResponse.json({ allowed: false, redirectTo: "/pending" });
  if (isExpired(p)) return NextResponse.json({ allowed: false, redirectTo: "/expired" });

  return NextResponse.json({ allowed: true });
}
