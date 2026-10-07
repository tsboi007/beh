import { Badge } from "@/components/ui";
import { STATUS_LABEL } from "@/lib/utils";

const TONE = { pending: "amber", confirmed: "blue", done: "green", cancelled: "red" } as const;

export function StatusBadge({ status }: { status: string }) {
  return <Badge tone={TONE[status as keyof typeof TONE] ?? "gray"}>{STATUS_LABEL[status] ?? status}</Badge>;
}
