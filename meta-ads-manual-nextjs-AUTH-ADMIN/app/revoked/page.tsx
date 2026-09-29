import AuthShell from "@/components/AuthShell";

export default function Page() {
  return (
    <AuthShell
      title="Access revoked"
      message="Aapka Meta Ads Manual access admin ne revoke kar diya hai. Dobara access ke liye admin se contact karein."
      tone="danger"
    />
  );
}
