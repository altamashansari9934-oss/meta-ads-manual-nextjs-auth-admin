import fs from "node:fs";
import path from "node:path";
import ManualFrame from "@/components/ManualFrame";
import AccessHeartbeat from "@/components/AccessHeartbeat";
import { requireApprovedUser } from "@/lib/access";

export const dynamic = "force-dynamic";

export default async function ManualPage() {
  await requireApprovedUser();

  const manualPath = path.join(process.cwd(), "content", "manual.html");
  const manualHtml = fs.readFileSync(manualPath, "utf8");

  return (
    <>
      <AccessHeartbeat />
      <ManualFrame html={manualHtml} />
    </>
  );
}
