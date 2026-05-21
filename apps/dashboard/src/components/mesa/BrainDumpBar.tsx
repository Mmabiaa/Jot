import { useEffect, useRef, useState } from "react";
import { db, newId } from "@/lib/db";
import { Pencil } from "lucide-react";

export function BrainDumpBar() {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-40">
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
