import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const RECOVERY_COOKIE = "meta_ads_password_recovery";

function redirectWithMessage(
  request: NextRequest,
  path: string,
  key: "error" | "message",
  value: string
) {
  const url = new URL(path, request.url);
  url.searchParams.set(key, value);
  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const otpType = request.nextUrl.searchParams.get("type") as EmailOtpType | null;
  const flow = request.nextUrl.searchParams.get("flow");

  const supabase = await createSupabaseServerClient();
  let authError: unknown = null;

  if (tokenHash && otpType) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: otpType,
    });
    authError = error;
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    authError = error;
  } else {
    authError = new Error("Missing auth callback token");
  }

  if (authError) {
    const path = flow === "recovery" ? "/forgot-password" : "/login";
    return redirectWithMessage(
      request,
      path,
      "error",
      flow === "recovery"
        ? "Password reset link invalid ya expire ho gaya hai. Naya link request karein."
        : "Verification link invalid ya expire ho gaya hai. Naya verification flow try karein."
    );
  }

  if (flow === "recovery" || otpType === "recovery") {
    const cookieStore = await cookies();
    cookieStore.set(RECOVERY_COOKIE, "1", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });

    return NextResponse.redirect(new URL("/update-password", request.url));
  }

  // Signup verification confirms the email, then this app intentionally requires
  // a fresh login before applying profile/access-status routing.
  await supabase.auth.signOut();

  return redirectWithMessage(
    request,
    "/login",
    "message",
    "Email successfully verify ho gaya. Ab login karein; manual access admin approval ke according milega."
  );
}
