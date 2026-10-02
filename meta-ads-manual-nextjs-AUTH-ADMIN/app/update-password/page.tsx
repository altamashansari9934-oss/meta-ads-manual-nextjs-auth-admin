import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { updatePassword } from "@/app/password-actions";
import AuthSubmitButton from "@/components/AuthSubmitButton";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const RECOVERY_COOKIE = "meta_ads_password_recovery";

export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const recovery = cookieStore.get(RECOVERY_COOKIE)?.value === "1";
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!recovery || !user) {
    redirect(
      "/forgot-password?error=Password%20reset%20session%20invalid%20ya%20expire%20ho%20gaya%20hai.%20Naya%20reset%20link%20request%20karein."
    );
  }

  return (
    <main className="auth-screen">
      <section className="auth-card">
        <div className="auth-logo">M</div>
        <div className="auth-kicker">NEW PASSWORD</div>
        <h1>Create new password</h1>
        <p>Apne account ke liye naya password set karein.</p>

        {params.error ? <div className="form-alert error">{params.error}</div> : null}
        {params.message ? <div className="form-alert success">{params.message}</div> : null}

        <form className="auth-form" action={updatePassword}>
          <label>
            New Password
            <input name="password" type="password" minLength={8} autoComplete="new-password" required />
          </label>
          <label>
            Confirm Password
            <input name="confirmPassword" type="password" minLength={8} autoComplete="new-password" required />
          </label>
          <AuthSubmitButton idleText="Update Password" pendingText="Updating..." />
        </form>

        <p className="auth-small">
          <Link href="/login">Back to Login</Link>
        </p>
      </section>
    </main>
  );
}
