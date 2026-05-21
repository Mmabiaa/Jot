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
      className="group bg-card p-5 rounded-2xl shadow-sm border border-border hover:shadow-md hover:border-ink/10 transition-all cursor-pointer flex flex-col min-h-[180px]"
    >
      <div className="flex justify-between items-start mb-3">
        <StatusPill status={card.status} />
        <span className="text-[10px] text-ink-muted">{timeAgo(card.lastOpenedAt)}</span>
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
              className="h-full bg-sage transition-all"
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
