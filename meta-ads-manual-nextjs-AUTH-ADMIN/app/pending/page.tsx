import AuthShell from "@/components/AuthShell";

export default function Page() {
  return (
    <AuthShell
      title="Approval pending"
      message="Aapka account create ho chuka hai, lekin manual access abhi admin approval ka wait kar raha hai."
      tone="warning"
    />
  );
}
