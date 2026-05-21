import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import type { ActivityCard } from "@/lib/types";
import { timeAgo } from "@/lib/time";
import { StatusPill } from "./StatusPill";
import { CardEditor } from "./CardEditor";

export function ContinueStrip() {
  const recent = useLiveQuery(
    async () => {
      const all = await db.cards.toArray();
      return all
        .filter((c) => c.status !== "done")
        .sort((a, b) => b.lastOpenedAt - a.lastOpenedAt)
        .slice(0, 3);
    },
    [],
    [] as ActivityCard[],
  );
  const [editing, setEditing] = useState<ActivityCard | null>(null);

  const open = async (c: ActivityCard) => {
    await db.cards.update(c.id, { lastOpenedAt: Date.now() });
    setEditing(c);
  };

  if (!recent.length) return null;

  return (
    <section className="mb-12">
      <h2 className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted/60 mb-5">
        Continue where you stopped
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {recent.map((c) => (
          <button
            key={c.id}
            onClick={() => open(c)}
            className="text-left bg-card p-5 rounded-2xl shadow-sm border border-border hover:shadow-md hover:border-ink/10 transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start mb-3">
              <StatusPill status={c.status} />
              <span className="text-[10px] text-ink-muted">{timeAgo(c.lastOpenedAt)}</span>
            </div>
            <h3 className="font-serif text-lg font-medium leading-snug mb-1.5">
              {c.title || <span className="text-ink-muted/50 italic">Untitled</span>}
            </h3>
            {c.note && (
              <p className="text-sm text-ink-muted leading-relaxed line-clamp-2">{c.note}</p>
            )}
          </button>
        ))}
      </div>
      <CardEditor card={editing} open={!!editing} onClose={() => setEditing(null)} />
    </section>
  );
}
