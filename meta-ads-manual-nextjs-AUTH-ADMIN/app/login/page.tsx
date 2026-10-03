import Link from "next/link";
import { signIn } from "@/app/auth-actions";
import AuthSubmitButton from "@/components/AuthSubmitButton";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="auth-screen">
      <section className="auth-card">
        <div className="auth-logo">M</div>
        <div className="auth-kicker">META ADS</div>
        <h1>Login</h1>
        <p>Approved users hi Meta AdDiagnosis access kar sakte hain.</p>

        {params.error ? <div className="form-alert error">{params.error}</div> : null}
        {params.message ? <div className="form-alert success">{params.message}</div> : null}

        <form className="auth-form" action={signIn}>
          <label>
            Email
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            Password
            <input name="password" type="password" autoComplete="current-password" required />
          </label>
          <AuthSubmitButton idleText="Login" pendingText="Logging in..." />
        </form>

        <p className="auth-small"><a href="/forgot-password">Forgot Password?</a></p>

        <p className="auth-small">
          New user? <Link href="/signup">Create account</Link>
        </p>
      </section>
    </main>
  );
}
