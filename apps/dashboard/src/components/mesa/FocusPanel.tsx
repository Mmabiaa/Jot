import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, newId } from "@/lib/db";
import type { FocusItem } from "@/lib/types";
import { Plus, X } from "lucide-react";

export function FocusPanel() {
  const items = useLiveQuery(
    async () => (await db.focus.toArray()).sort((a, b) => a.createdAt - b.createdAt),
    [],
    [] as FocusItem[],
  );
  const [draft, setDraft] = useState("");
  const [bucket, setBucket] = useState<"now" | "later">("now");

  const add = async () => {
    if (!draft.trim()) return;
    await db.focus.add({
      id: newId(),
      text: draft.trim(),
      bucket,
      done: false,
      createdAt: Date.now(),
    });
    setDraft("");
  };

  const toggle = (i: FocusItem) => db.focus.update(i.id, { done: !i.done });
  const remove = (id: string) => db.focus.delete(id);

  const now = items.filter((i) => i.bucket === "now");
  const later = items.filter((i) => i.bucket === "later");

  const renderGroup = (label: string, list: FocusItem[]) => (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-widest text-sage mb-3">
        {label}
      </div>
      {list.length === 0 ? (
        <p className="text-xs text-ink-muted/60 italic mb-3">Nothing yet.</p>
      ) : (
        <ul className="space-y-2 mb-3">
          {list.map((i) => (
            <li key={i.id} className="group flex items-start gap-2.5">
              <button
                onClick={() => toggle(i)}
                className={`mt-0.5 shrink-0 size-3.5 rounded-sm border transition-colors cursor-pointer ${
                  i.done ? "bg-sage border-sage" : "border-ink/25 hover:border-sage"
                }`}
                aria-label="Toggle"
              />
              <span
                className={`flex-1 text-sm leading-snug ${
                  i.done ? "line-through text-ink-muted" : "text-ink"
                }`}
              >
                {i.text}
              </span>
              <button
                onClick={() => remove(i.id)}
                className="opacity-0 group-hover:opacity-100 text-ink-muted hover:text-ink transition cursor-pointer"
                aria-label="Remove"
              >
                <X className="size-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <section className="bg-[#fdfcfb] border border-[#e8e4e1] rounded-2xl p-6 shadow-[inset_0_1px_3px_rgba(0,0,0,0.02),0_1px_2px_rgba(0,0,0,0.05)] h-full flex flex-col">
      <div className="flex items-baseline justify-between mb-5">
        <h2 className="font-serif text-lg font-medium text-ink/90">Today</h2>
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-sage/80">
          Clarity Lives Here
        </span>
      </div>

      <div className="space-y-6 flex-1">
        {renderGroup("Now", now)}
        {renderGroup("Later", later)}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          add();
        }}
        className="mt-5 pt-4 border-t border-border/60 flex items-center gap-2"
      >
        <div className="flex rounded-full bg-stone-soft p-0.5 text-[10px] uppercase tracking-wider font-semibold">
          {(["now", "later"] as const).map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBucket(b)}
              className={`px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                bucket === b ? "bg-ink text-page" : "text-ink-muted"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="One small intention…"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-ink-muted/50"
        />
        <button
          type="submit"
          className="size-7 rounded-full bg-ink text-page grid place-items-center hover:bg-ink/85 transition-colors cursor-pointer"
          aria-label="Add"
        >
          <Plus className="size-3.5" />
        </button>
      </form>
    </section>
  );
}
