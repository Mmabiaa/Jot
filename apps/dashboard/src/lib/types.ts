export type CardStatus = "active" | "stuck" | "draft" | "idea" | "done";

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface ActivityCard {
  id: string;
  title: string;
  note: string;
  status: CardStatus;
  checklist: ChecklistItem[];
  createdAt: number;
  updatedAt: number;
  lastOpenedAt: number;
  order: number;
}

export interface BrainDumpNote {
  id: string;
  text: string;
  createdAt: number;
  archived: boolean;
}

export interface FocusItem {
  id: string;
  text: string;
  bucket: "now" | "later";
  done: boolean;
  createdAt: number;
}

export const STATUS_LABEL: Record<CardStatus, string> = {
  active: "Active",
  stuck: "Stuck",
  draft: "Draft",
  idea: "Idea",
  done: "Done",
};
