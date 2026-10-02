import fs from "node:fs";
import path from "node:path";
import ManualApp from "@/components/ManualApp";
import AccessHeartbeat from "@/components/AccessHeartbeat";
import { requireApprovedUser } from "@/lib/access";
import "../manual.css";

export const dynamic = "force-dynamic";

const KEYS = [
  "audience_full","audience_quick","lead_testing","lead_diagnosis",
  "ecommerce_testing","ecommerce_diagnosis","scaling_framework",
  "scaling_quick","budget_full","budget_quick"
];

export default async function ManualPage() {
  await requireApprovedUser();
  const panels: Record<string,string> = {};
  for (const key of KEYS) {
    panels[key] = fs.readFileSync(path.join(process.cwd(),"content","panels",`${key}.html`),"utf8");
  }
  return <><AccessHeartbeat/><ManualApp panels={panels}/></>;
}
