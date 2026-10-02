import Link from "next/link";
import { updatePassword } from "@/app/password-actions";
import AuthSubmitButton from "@/components/AuthSubmitButton";

export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;

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
