import Link from "next/link";
import { signUp } from "@/app/auth-actions";
import AuthSubmitButton from "@/components/AuthSubmitButton";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="auth-screen">
      <section className="auth-card">
        <div className="auth-logo">M</div>
        <div className="auth-kicker">META ADS</div>
        <h1>Create account</h1>
        <p>After creating your account, access will require admin approval.</p>

        {params.error ? <div className="form-alert error">{params.error}</div> : null}

        <form className="auth-form" action={signUp}>
          <label>
            Name
            <input name="name" type="text" autoComplete="name" required />
          </label>
          <label>
            Email
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            Password
            <input name="password" type="password" minLength={8} autoComplete="new-password" required />
          </label>
          <AuthSubmitButton idleText="Create account" pendingText="Creating account..." />
        </form>

        <p className="auth-small">
          Already registered? <Link href="/login">Login</Link>
        </p>
      </section>
    </main>
  );
}
