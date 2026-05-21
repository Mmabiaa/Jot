import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { db, newId } from "@/lib/db";
import type { ActivityCard } from "@/lib/types";
import { ActivityCardView } from "./ActivityCardView";
import { CardEditor } from "./CardEditor";

export function DeskGrid() {
  const cards = useLiveQuery(
    async () => (await db.cards.toArray()).sort((a, b) => a.order - b.order),
    [],
    [] as ActivityCard[],
  );
  const [editing, setEditing] = useState<ActivityCard | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const onDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = cards.findIndex((c) => c.id === active.id);
    const newIdx = cards.findIndex((c) => c.id === over.id);
    if (oldIdx < 0 || newIdx < 0) return;
    const next = arrayMove(cards, oldIdx, newIdx);
    await db.transaction("rw", db.cards, async () => {
      await Promise.all(next.map((c, i) => db.cards.update(c.id, { order: i })));
    });
  };

  const open = async (c: ActivityCard) => {
    await db.cards.update(c.id, { lastOpenedAt: Date.now() });
    setEditing(c);
  };

  const addCard = async () => {
    const now = Date.now();
    const card: ActivityCard = {
      id: newId(),
      title: "",
      note: "",
      status: "draft",
      checklist: [],
      createdAt: now,
      updatedAt: now,
      lastOpenedAt: now,
      order: cards.length,
    };
    await db.cards.add(card);
    setEditing(card);
  };

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={cards.map((c) => c.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {cards.map((c) => (
              <ActivityCardView key={c.id} card={c} onOpen={open} />
            ))}
            <button
              onClick={addCard}
              className="group min-h-[180px] rounded-2xl border border-dashed border-ink/15 hover:border-sage flex flex-col items-center justify-center gap-2 text-ink-muted hover:text-sage transition-colors cursor-pointer"
            >
              <Plus className="size-5" strokeWidth={1.5} />
              <span className="text-[10px] uppercase tracking-widest font-semibold">
                Add card
              </span>
            </button>
          </div>
        </SortableContext>
      </DndContext>

      <CardEditor card={editing} open={!!editing} onClose={() => setEditing(null)} />
    </>
  );
}
