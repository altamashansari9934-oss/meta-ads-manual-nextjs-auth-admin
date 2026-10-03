import Link from "next/link";
import { requestPasswordReset } from "@/app/password-actions";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="auth-screen">
      <section className="auth-card">
        <div className="auth-kicker">RESET PASSWORD</div>
        <h1>Forgot Password?</h1>
        <p>Enter your registered email address and we’ll send you a password reset link.</p>

        {params.error ? <div className="form-alert error">{params.error}</div> : null}
        {params.message ? <div className="form-alert success">{params.message}</div> : null}

        <form className="auth-form" action={requestPasswordReset}>
          <label>
            Email
            <input name="email" type="email" autoComplete="email" required />
          </label>

          <button className="primary-btn" type="submit">Send Reset Link</button>
        </form>

        <p className="auth-small">
          <Link href="/login">Back to Login</Link>
        </p>
      </section>
    </main>
  );
}
