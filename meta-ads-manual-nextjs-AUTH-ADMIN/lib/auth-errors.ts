type AuthLikeError = {
  code?: string;
  message?: string;
} | null | undefined;

export function loginErrorMessage(error: AuthLikeError) {
  const code = error?.code || "";
  const message = (error?.message || "").toLowerCase();

  if (code === "email_not_confirmed" || message.includes("email not confirmed")) {
    return "Email abhi verify nahi hua hai. Verification email open karke account verify karein.";
  }

  if (
    code === "invalid_credentials" ||
    message.includes("invalid login credentials") ||
    message.includes("invalid credentials")
  ) {
    return "Email ya password incorrect hai.";
  }

  return "Login nahi ho saka. Email/password check karke dobara try karein.";
}

export function signupErrorMessage(error: AuthLikeError) {
  const code = error?.code || "";
  const message = (error?.message || "").toLowerCase();

  if (code === "user_already_exists" || message.includes("already registered")) {
    return "Is email se account already registered hai. Login ya Forgot Password use karein.";
  }

  if (code === "email_address_invalid" || message.includes("invalid email")) {
    return "Valid email address enter karein.";
  }

  if (code === "over_email_send_rate_limit" || message.includes("rate limit")) {
    return "Verification email abhi send nahi ho saka. Thodi der baad dobara try karein.";
  }

  return "Account create nahi ho saka. Details check karke dobara try karein.";
}

export function passwordUpdateErrorMessage(error: AuthLikeError) {
  const message = (error?.message || "").toLowerCase();

  if (
    message.includes("session") ||
    message.includes("jwt") ||
    message.includes("expired") ||
    message.includes("not authenticated")
  ) {
    return "Password reset session expire ya invalid ho gaya hai. Naya reset link request karein.";
  }

  return "Password update nahi ho saka. Naya reset link request karke dobara try karein.";
}
