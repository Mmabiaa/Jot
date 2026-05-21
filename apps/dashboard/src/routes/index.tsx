import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { seedIfEmpty } from "@/lib/db";
import { todayLabel } from "@/lib/time";
import { ContinueStrip } from "@/components/mesa/ContinueStrip";
import { DeskGrid } from "@/components/mesa/DeskGrid";
import { FocusPanel } from "@/components/mesa/FocusPanel";
import { BrainDumpBar } from "@/components/mesa/BrainDumpBar";
import deskStill from "@/assets/desk-still.jpg";

export const Route = createFileRoute("/")({
  component: Jot,
  head: () => ({
    meta: [
      { title: "Jot — A calm desk for your projects" },
      {
        name: "description",
        content:
          "Jot is a calm, local-first personal workspace. Movable cards, brain dump, and continue-where-you-stopped — no login, no team, no noise.",
      },
      { property: "og:title", content: "Jot — A calm desk for your projects" },
      {
        property: "og:description",
        content:
          "A calm, local-first personal workspace. No login, no team, no noise.",
      },
    ],
  }),
});

function Jot() {
  useEffect(() => {
    seedIfEmpty();
  }, []);

  return (
    <div className="min-h-screen bg-page text-ink">
      <header className="max-w-7xl mx-auto px-6 sm:px-8 pt-10 pb-8 flex items-end justify-between gap-6 flex-wrap">
        <div>
          <h1 className="font-serif text-4xl font-medium tracking-tight">Jot</h1>
          <p className="text-ink-muted text-xs sm:text-sm mt-1.5 uppercase tracking-[0.18em] font-medium">
            A quiet desk &middot; {todayLabel()}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-ink-muted">
          <span className="size-1.5 rounded-full bg-sage" />
          <span className="font-medium tracking-wide">Local only</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 sm:px-8 pb-40">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
        >
          <ContinueStrip />
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
          className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 mb-10"
        >
          <div className="order-2 lg:order-1">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted/60">
                On the desk
              </h2>
              <div className="h-px flex-1 bg-border mx-6" />
              <span className="text-[10px] uppercase tracking-widest text-ink-muted/60">
                Drag to rearrange
              </span>
            </div>
            <DeskGrid />
          </div>

          <aside className="order-1 lg:order-2 space-y-5">
            <FocusPanel />
            <figure className="rounded-2xl overflow-hidden border border-border shadow-sm">
              <img
                src={deskStill}
                alt="A quiet desk with a notebook, stone, and tea"
                width={1280}
                height={896}
                loading="lazy"
                className="w-full h-44 object-cover"
              />
            </figure>
          </aside>
        </motion.section>
      </main>

      <BrainDumpBar />
    </div>
  );
}
