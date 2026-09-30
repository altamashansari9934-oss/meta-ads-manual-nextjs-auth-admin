"use client";

import { useFormStatus } from "react-dom";

type AuthSubmitButtonProps = {
  idleText: string;
  pendingText: string;
};

export default function AuthSubmitButton({
  idleText,
  pendingText,
}: AuthSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      className={`primary-btn auth-submit-btn ${pending ? "is-pending" : ""}`}
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      aria-busy={pending}
    >
      {pending ? <span className="auth-btn-spinner" aria-hidden="true" /> : null}
      <span>{pending ? pendingText : idleText}</span>
    </button>
  );
}
