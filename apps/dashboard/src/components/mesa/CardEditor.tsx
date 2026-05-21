import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { db, newId } from "@/lib/db";
import type { ActivityCard, CardStatus, ChecklistItem } from "@/lib/types";
import { STATUS_LABEL } from "@/lib/types";
import { timeAgo } from "@/lib/time";
import { Trash2, X, Plus } from "lucide-react";

interface Props {
  card: ActivityCard | null;
  open: boolean;
  onClose: () => void;
}

const STATUSES: CardStatus[] = ["active", "stuck", "draft", "idea", "done"];

export function CardEditor({ card, open, onClose }: Props) {
  const [draft, setDraft] = useState<ActivityCard | null>(card);

  useEffect(() => {
    setDraft(card);
  }, [card]);

  if (!draft) return null;

  const save = async (patch: Partial<ActivityCard>) => {
    const next = { ...draft, ...patch, updatedAt: Date.now() };
    setDraft(next);
    await db.cards.put(next);
  };

  const addItem = () =>
    save({ checklist: [...draft.checklist, { id: newId(), text: "", done: false }] });

  const updateItem = (id: string, patch: Partial<ChecklistItem>) =>
    save({
      checklist: draft.checklist.map((i) => (i.id === id ? { ...i, ...patch } : i)),
    });

  const removeItem = (id: string) =>
    save({ checklist: draft.checklist.filter((i) => i.id !== id) });

  const remove = async () => {
    await db.cards.delete(draft.id);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xl bg-card border-border p-0 gap-0 overflow-hidden">
        <DialogTitle className="sr-only">Edit card</DialogTitle>
        <div className="p-6 pb-4 border-b border-border/60">
          <input
            value={draft.title}
            onChange={(e) => save({ title: e.target.value })}
            placeholder="Untitled"
            className="w-full font-serif text-2xl font-medium bg-transparent outline-none placeholder:text-ink-muted/40"
          />
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => save({ status: s })}
                className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                  draft.status === s
                    ? "bg-ink text-page"
                    : "bg-ink/5 text-ink-muted hover:bg-ink/10"
                }`}
              >
                {STATUS_LABEL[s]}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          <textarea
            value={draft.note}
            onChange={(e) => save({ note: e.target.value })}
            placeholder="A thought, a context, a where-you-stopped…"
            rows={3}
            className="w-full bg-stone-soft/60 rounded-xl p-4 text-sm leading-relaxed outline-none resize-none placeholder:text-ink-muted/50 focus:ring-2 focus:ring-sage/30"
          />

          <div>
            <div className="text-[10px] uppercase tracking-widest text-ink-muted/70 font-semibold mb-3">
              Checklist
            </div>
            <div className="space-y-1">
              {draft.checklist.map((item) => (
                <div key={item.id} className="group flex items-center gap-3 py-1">
                  <button
                    onClick={() => updateItem(item.id, { done: !item.done })}
                    className={`shrink-0 size-4 rounded border-2 transition-colors cursor-pointer ${
                      item.done ? "bg-sage border-sage" : "border-ink/20 hover:border-sage"
                    }`}
                    aria-label="Toggle"
                  />
                  <input
                    value={item.text}
                    onChange={(e) => updateItem(item.id, { text: e.target.value })}
                    placeholder="…"
                    className={`flex-1 bg-transparent text-sm outline-none ${
                      item.done ? "line-through text-ink-muted" : ""
                    }`}
                  />
                  <button
                    onClick={() => removeItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-ink-muted hover:text-ink cursor-pointer"
                    aria-label="Remove"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              ))}
              <button
                onClick={addItem}
                className="mt-2 flex items-center gap-2 text-xs text-ink-muted hover:text-ink transition-colors cursor-pointer"
              >
                <Plus className="size-3.5" />
                Add item
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border/60 flex items-center justify-between bg-stone-soft/30">
          <span className="text-[10px] uppercase tracking-widest text-ink-muted/60">
            Updated {timeAgo(draft.updatedAt)}
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={remove}
              className="flex items-center gap-1.5 text-xs text-ink-muted hover:text-destructive transition-colors cursor-pointer"
            >
              <Trash2 className="size-3.5" />
              Remove
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-ink text-page rounded-full text-xs font-semibold hover:bg-ink/85 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
