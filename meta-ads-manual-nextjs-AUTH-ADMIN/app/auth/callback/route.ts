import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const flow = url.searchParams.get("flow");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");

  const supabase = await createSupabaseServerClient();

  try {
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) throw error;
    } else if (tokenHash && type) {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: type as "signup" | "recovery" | "email",
      });
      if (error) throw error;
    } else {
      return NextResponse.redirect(
        new URL("/forgot-password?error=Invalid%20or%20expired%20reset%20link.", request.url)
      );
    }

    if (flow === "recovery" || type === "recovery") {
      return NextResponse.redirect(new URL("/update-password", request.url));
    }

    return NextResponse.redirect(new URL("/login", request.url));
  } catch {
    return NextResponse.redirect(
      new URL("/forgot-password?error=Invalid%20or%20expired%20reset%20link.", request.url)
    );
  }
}
