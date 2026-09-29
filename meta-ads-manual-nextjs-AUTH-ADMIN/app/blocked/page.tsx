import AuthShell from "@/components/AuthShell";

export default function Page() {
  return (
    <AuthShell
      title="Account blocked"
      message="Is account ko admin ne block kiya hai. Manual content access available nahi hai."
      tone="danger"
    />
  );
}
