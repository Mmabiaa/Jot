import Dexie, { type Table } from "dexie";
import type { ActivityCard, BrainDumpNote, FocusItem } from "./types";

class MesaDB extends Dexie {
  cards!: Table<ActivityCard, string>;
  notes!: Table<BrainDumpNote, string>;
  focus!: Table<FocusItem, string>;

  constructor() {
    super("mesa");
    this.version(1).stores({
      cards: "id, updatedAt, lastOpenedAt, status, order",
      notes: "id, createdAt, archived",
      focus: "id, bucket, createdAt",
    });
  }
}

export const db = new MesaDB();

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);

export async function seedIfEmpty() {
  const count = await db.cards.count();
  if (count > 0) return;

  const now = Date.now();
  await db.cards.bulkAdd([
    {
      id: uid(),
      title: "Welcome to your desk",
      note: "This is your space. Drag cards around. Tap to edit. Nothing leaves your browser.",
      status: "active",
      checklist: [],
      createdAt: now,
      updatedAt: now,
      lastOpenedAt: now,
      order: 0,
    },
    {
      id: uid(),
      title: "Reading list",
      note: "A few things waiting for a quiet afternoon.",
      status: "idea",
      checklist: [
        { id: uid(), text: "Pattern Language — Alexander", done: false },
        { id: uid(), text: "Technopoly — Postman", done: false },
        { id: uid(), text: "The Timeless Way of Building", done: true },
      ],
      createdAt: now - 86400000,
      updatedAt: now - 3600000,
      lastOpenedAt: now - 3600000,
      order: 1,
    },
    {
      id: uid(),
      title: "Garden irrigation",
      note: "Waiting on soil sensors before testing the schedule.",
      status: "stuck",
      checklist: [],
      createdAt: now - 172800000,
      updatedAt: now - 7200000,
      lastOpenedAt: now - 7200000,
      order: 2,
    },
  ]);

  await db.focus.bulkAdd([
    { id: uid(), text: "Deep work — one quiet thing", bucket: "now", done: false, createdAt: now },
    { id: uid(), text: "Read a chapter", bucket: "later", done: false, createdAt: now },
  ]);
}

export function newId() {
  return uid();
}
