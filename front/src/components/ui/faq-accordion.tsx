"use client";

import { useState } from "react";

interface FaqEntry {
  question: string;
  answer: string;
}

export function FaqAccordion({ items }: { items: FaqEntry[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <div
            key={index}
            className={`rounded-xl border overflow-hidden transition-colors duration-200 ${
              open
                ? "border-primary bg-canvas-soft"
                : "border-border bg-canvas-soft hover:border-border-strong"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : index)}
              aria-expanded={open}
              className="w-full flex items-center justify-between gap-6 px-6 py-5 text-left"
            >
              <span className="text-heading text-ink">{item.question}</span>
              <span
                className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg leading-none transition-all duration-200 ${
                  open
                    ? "rotate-45 bg-primary text-on-primary"
                    : "bg-canvas-muted text-ink-muted"
                }`}
              >
                +
              </span>
            </button>
            {open && (
              <div className="px-6 pb-6">
                <p className="text-body text-ink-muted">{item.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
