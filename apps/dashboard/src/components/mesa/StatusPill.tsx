import type { CardStatus } from "@/lib/types";
import { STATUS_LABEL } from "@/lib/types";

const STYLES: Record<CardStatus, string> = {
  active: "bg-sage/15 text-sage",
  stuck: "bg-clay/20 text-clay",
  draft: "bg-ink/5 text-ink-muted",
  idea: "bg-amber-200/40 text-amber-800",
  done: "bg-ink/5 text-ink-muted line-through",
};

export function StatusPill({ status }: { status: CardStatus }) {
  return (
    <span
      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${STYLES[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
