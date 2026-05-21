import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ActivityCard } from "@/lib/types";
import { timeAgo } from "@/lib/time";
import { StatusPill } from "./StatusPill";

interface Props {
  card: ActivityCard;
  onOpen: (c: ActivityCard) => void;
}

export function ActivityCardView({ card, onOpen }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
  });

  const now = Date.now();
  const daysSinceUpdate = Math.floor((now - card.updatedAt) / (1000 * 60 * 60 * 24));
  const isRecentlyTouched = now - card.lastOpenedAt < 1000 * 60 * 60 * 12; // 12 hours
  const isStuck = daysSinceUpdate > 7;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const total = card.checklist.length;
  const done = card.checklist.filter((i) => i.done).length;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onOpen(card)}
      className={`group p-5 rounded-2xl shadow-sm border transition-all cursor-pointer flex flex-col min-h-[180px] ${
        isRecentlyTouched
          ? "bg-card border-sage/20 shadow-md ring-1 ring-sage/5"
          : isStuck
            ? "bg-card/50 border-border/50 grayscale-[0.2] opacity-80"
            : "bg-card border-border hover:border-ink/10 hover:shadow-md"
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <StatusPill status={card.status} />
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-[10px] text-ink-muted font-medium uppercase tracking-wider">
            {timeAgo(card.lastOpenedAt)}
          </span>
          {isStuck && (
            <span className="text-[9px] text-ink-muted/50 font-medium uppercase tracking-widest italic">
              Untouched for {daysSinceUpdate} days
            </span>
          )}
          {isRecentlyTouched && !isDragging && (
            <span className="text-[9px] text-sage font-semibold uppercase tracking-widest animate-pulse">
              Active
            </span>
          )}
        </div>
      </div>
      <h3 className="font-serif text-lg font-medium leading-snug mb-2 text-ink">
        {card.title || <span className="text-ink-muted/50 italic">Untitled</span>}
      </h3>
      {card.note && (
        <p className="text-sm text-ink-muted leading-relaxed line-clamp-3">{card.note}</p>
      )}
      {total > 0 && (
        <div className="mt-auto pt-4 flex items-center gap-2">
          <div className="flex-1 h-1 bg-stone-soft rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${isStuck ? "bg-ink-muted/30" : "bg-sage"}`}
              style={{ width: `${(done / total) * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-ink-muted tabular-nums">
            {done}/{total}
          </span>
        </div>
      )}
    </div>
  );
}
