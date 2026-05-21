import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import type { BrainDumpNote } from "@/lib/types";
import { timeAgo } from "@/lib/time";
import { X } from "lucide-react";

export function ThoughtList() {
  const allNotes = useLiveQuery(
    async () => (await db.notes.toArray()).filter((n) => !n.archived).sort((a, b) => b.createdAt - a.createdAt),
    [],
    [] as BrainDumpNote[],
  );

  const dismiss = (id: string) => db.notes.update(id, { archived: true });

  if (!allNotes || allNotes.length === 0) return null;

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted/60">
          Recent Thoughts
        </h2>
        <div className="h-px flex-1 bg-border mx-6" />
        <span className="text-[10px] uppercase tracking-widest text-ink-muted/60">
          {allNotes.length} thoughts
        </span>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {allNotes.slice(0, 12).map((n) => (
          <li
            key={n.id}
            className="group flex flex-col gap-2 p-4 rounded-2xl bg-card border border-border hover:border-sage/30 transition-all shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="mt-1.5 size-1.5 rounded-full bg-sage shrink-0" />
              <button
                onClick={() => dismiss(n.id)}
                className="opacity-0 group-hover:opacity-100 text-ink-muted hover:text-ink transition cursor-pointer"
                aria-label="Dismiss"
              >
                <X className="size-3.5" />
              </button>
            </div>
            <p className="text-sm leading-relaxed text-ink flex-1">{n.text}</p>
            <span className="text-[10px] text-ink-muted/70 mt-2 block font-medium uppercase tracking-wider">
              {timeAgo(n.createdAt)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
