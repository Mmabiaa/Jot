import { useEffect, useRef, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, newId } from "@/lib/db";
import type { BrainDumpNote } from "@/lib/types";
import { timeAgo } from "@/lib/time";
import { ChevronUp, X, Pencil } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function BrainDumpBar() {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const allNotes = useLiveQuery(
    async () => (await db.notes.toArray()).filter((n) => !n.archived).sort((a, b) => b.createdAt - a.createdAt),
    [],
    [] as BrainDumpNote[],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "j") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!value.trim()) return;
    await db.notes.add({
      id: newId(),
      text: value.trim(),
      createdAt: Date.now(),
      archived: false,
    });
    setValue("");
  };

  const dismiss = (id: string) => db.notes.update(id, { archived: true });


  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-40">
      <AnimatePresence>
        {open && allNotes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="mb-3 bg-card border border-border shadow-2xl rounded-2xl p-4 max-h-72 overflow-y-auto"
          >
            <div className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted/60 mb-3 flex items-center justify-between">
              <span>Recent thoughts</span>
              <span>{allNotes.length}</span>
            </div>
            <ul className="space-y-2">
              {allNotes.slice(0, 20).map((n) => (
                <li
                  key={n.id}
                  className="group flex items-start gap-3 p-2.5 rounded-lg hover:bg-stone-soft/60 transition-colors"
                >
                  <span className="mt-1.5 size-1 rounded-full bg-sage shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-relaxed text-ink">{n.text}</p>
                    <span className="text-[10px] text-ink-muted/70 mt-0.5 block">
                      {timeAgo(n.createdAt)}
                    </span>
                  </div>
                  <button
                    onClick={() => dismiss(n.id)}
                    className="opacity-0 group-hover:opacity-100 text-ink-muted hover:text-ink transition cursor-pointer"
                    aria-label="Dismiss"
                  >
                    <X className="size-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <form
        onSubmit={submit}
        className="bg-card/90 backdrop-blur-xl border border-border shadow-2xl rounded-full p-2 flex items-center gap-2"
      >
        <div className="size-10 rounded-full bg-stone-soft grid place-items-center text-ink-muted shrink-0">
          <Pencil className="size-4" strokeWidth={1.5} />
        </div>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Dump a thought…"
          className="flex-1 bg-transparent border-none text-sm outline-none px-1 placeholder:text-ink-muted/50"
        />
        <div className="hidden sm:flex items-center gap-1.5 pr-1">
          <kbd className="bg-ink/5 px-1.5 py-0.5 rounded text-[10px] font-sans text-ink-muted">⌘</kbd>
          <kbd className="bg-ink/5 px-1.5 py-0.5 rounded text-[10px] font-sans text-ink-muted">J</kbd>
        </div>
        <div className="w-px h-5 bg-border" />
        {allNotes.length > 0 && (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className={`size-9 rounded-full grid place-items-center transition-colors cursor-pointer ${
              open ? "bg-ink text-page" : "bg-stone-soft text-ink-muted hover:text-ink"
            }`}
            aria-label="Toggle notes"
          >
            <ChevronUp
              className={`size-4 transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>
        )}
        <button
          type="submit"
          className="px-4 h-9 rounded-full bg-sage text-white text-xs font-semibold uppercase tracking-wider hover:bg-sage/90 transition-colors cursor-pointer"
        >
          Capture
        </button>
      </form>
      <p className="text-center mt-2.5 text-[10px] text-ink-muted/50 uppercase tracking-widest font-medium">
        Everything stays in your browser
      </p>
    </div>
  );
}
