"use client";

import React, { forwardRef } from "react";
import { CHAPTERS } from "./types";

interface ProgressIndicatorProps {
  percentageRef: React.RefObject<HTMLSpanElement | null>;
  trackBarRef: React.RefObject<HTMLDivElement | null>;
  chapterRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
  onChapterClick: (index: number) => void;
}

export const ProgressIndicator = forwardRef<
  HTMLDivElement,
  ProgressIndicatorProps
>(({ percentageRef, trackBarRef, chapterRefs, onChapterClick }, ref) => {
  return (
    <div
      ref={ref}
      className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-6 md:p-10 select-none"
    >
      {/* Top HUD */}
      <header className="flex justify-between items-start w-full">
        <div className="flex flex-col">
          <span className="text-[11px] md:text-xs tracking-[0.3em] font-medium text-white uppercase">
            THE BUILDING
          </span>
          <span className="text-[9px] md:text-[10px] tracking-[0.35em] text-neutral-400 uppercase mt-0.5">
            / RESIDENCES
          </span>
        </div>

        <div className="text-right">
          <span className="text-[9px] md:text-[10px] tracking-[0.25em] text-neutral-400 uppercase hidden sm:block">
            CINEMATIC ARCHITECTURAL EXPERIENCE
          </span>
        </div>
      </header>

      {/* Bottom HUD */}
      <footer className="flex justify-between items-end w-full">
        {/* Chapters list */}
        <nav
          className="flex flex-col gap-2 pointer-events-auto"
          aria-label="Experience Chapters"
        >
          {CHAPTERS.map((chapter, index) => (
            <button
              key={chapter.id}
              ref={(el) => {
                chapterRefs.current[index] = el;
              }}
              onClick={() => onChapterClick(index)}
              className={`flex items-center gap-2.5 text-left text-[10px] md:text-xs tracking-[0.25em] uppercase transition-all duration-300 group cursor-pointer focus:outline-none focus:ring-1 focus:ring-white/40 px-1 py-0.5 rounded-sm ${
                index === 0
                  ? "text-white font-medium translate-x-1"
                  : "text-neutral-500 font-light translate-x-0 hover:text-neutral-300"
              }`}
            >
              <span
                className={`h-[1px] transition-all duration-300 ${
                  index === 0
                    ? "w-3 bg-white"
                    : "w-1 bg-neutral-600 group-hover:w-2 group-hover:bg-neutral-400"
                }`}
              />
              <span>{chapter.label}</span>
            </button>
          ))}
        </nav>

        {/* Master Progress Percentage & Track */}
        <div className="flex flex-col items-end gap-2 pointer-events-auto">
          <span
            ref={percentageRef}
            className="font-mono text-sm md:text-base font-light text-white tracking-widest"
            aria-live="polite"
          >
            00%
          </span>

          {/* Minimal 1px progress track */}
          <div className="w-20 md:w-32 h-[1px] bg-white/15 overflow-hidden">
            <div
              ref={trackBarRef}
              className="h-full bg-white transition-all duration-75 origin-left"
              style={{ width: "0%" }}
            />
          </div>
        </div>
      </footer>
    </div>
  );
});

ProgressIndicator.displayName = "ProgressIndicator";
