import Link from "next/link";
import { requestPasswordReset } from "@/app/password-actions";
import AuthSubmitButton from "@/components/AuthSubmitButton";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="auth-screen">
      <section className="auth-card">
        <div className="auth-logo">M</div>
        <div className="auth-kicker">RESET PASSWORD</div>
        <h1>Forgot password?</h1>
        <p>
          Apna registered email enter karein. Hum us email par password reset link bhejenge.
        </p>

        {params.error ? <div className="form-alert error">{params.error}</div> : null}
        {params.message ? <div className="form-alert success">{params.message}</div> : null}

        <form className="auth-form" action={requestPasswordReset}>
          <label>
            Registered Email
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <AuthSubmitButton idleText="Send Reset Link" pendingText="Sending..." />
        </form>

        <p className="auth-small">
          Password yaad aa gaya? <Link href="/login">Back to Login</Link>
        </p>
      </section>
    </main>
  );
}
