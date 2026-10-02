import fs from "node:fs";
import path from "node:path";
import ManualFrame from "@/components/ManualFrame";
import AccessHeartbeat from "@/components/AccessHeartbeat";
import { requireApprovedUser } from "@/lib/access";
import { prepareManualDocument } from "@/lib/prepareManualDocument";

export const dynamic = "force-dynamic";

export default async function ManualPage() {
  await requireApprovedUser();

  const manualPath = path.join(process.cwd(), "content", "manual.html");
  const manualFragment = fs.readFileSync(manualPath, "utf8");
  const manualHtml = prepareManualDocument(manualFragment);

  return (
    <>
      <AccessHeartbeat />
      <ManualFrame html={manualHtml} />
    </>
  );
}
