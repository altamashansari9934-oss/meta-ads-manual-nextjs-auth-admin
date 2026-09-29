import AuthShell from "@/components/AuthShell";

export default function Page() {
  return (
    <AuthShell
      title="Access expired"
      message="Aapke approved access ki validity expire ho gayi hai. Admin access renew kar sakta hai."
      tone="warning"
    />
  );
}
