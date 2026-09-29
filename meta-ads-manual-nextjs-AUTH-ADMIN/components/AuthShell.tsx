import Link from "next/link";
import { signOut } from "@/app/auth-actions";

type Props = {
  title: string;
  message: string;
  tone?: "default" | "warning" | "danger";
  showLogout?: boolean;
};

export default function AuthShell({
  title,
  message,
  tone = "default",
  showLogout = true,
}: Props) {
  return (
    <main className="auth-screen">
      <section className={`auth-card auth-${tone}`}>
        <div className="auth-logo">M</div>
        <div className="auth-kicker">META ADS</div>
        <h1>{title}</h1>
        <p>{message}</p>
        <div className="auth-actions-row">
          {showLogout ? (
            <form action={signOut}>
              <button className="secondary-btn" type="submit">
                Sign out
              </button>
            </form>
          ) : (
            <Link className="secondary-btn" href="/login">
              Login
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
