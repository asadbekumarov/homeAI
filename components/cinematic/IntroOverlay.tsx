"use client";

import React, { forwardRef } from "react";

interface IntroOverlayProps {
  onExploreClick?: () => void;
}

export const IntroOverlay = forwardRef<HTMLDivElement, IntroOverlayProps>(
  ({ onExploreClick }, ref) => {
    return (
      <div
        ref={ref}
        style={{ willChange: "opacity" }}
        className="absolute inset-0 flex flex-col justify-between items-center py-12 md:py-20 px-6 z-20 pointer-events-auto transition-opacity duration-150"
      >
        {/* Top Spacer */}
        <div className="h-6" />

        {/* Center Content */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto px-4">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-neutral-400 font-light mb-4">
            Architectural Presentation
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-[0.2em] md:tracking-[0.25em] text-white uppercase leading-tight select-none">
            DISCOVER THE BUILDING
          </h1>
          <p className="mt-4 sm:mt-6 text-xs sm:text-sm md:text-base text-neutral-300/90 font-light tracking-wide max-w-md select-none">
            A cinematic journey from construction to your future home.
          </p>
        </div>

        {/* Bottom Scroll Indicator */}
        <button
          onClick={onExploreClick}
          className="flex flex-col items-center gap-3 cursor-pointer group focus:outline-none focus:ring-1 focus:ring-white/40 rounded-sm p-2 transition-transform duration-300"
          aria-label="Scroll down to explore the building"
        >
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-neutral-400 group-hover:text-white transition-colors duration-300 select-none">
            SCROLL TO EXPLORE
          </span>
          <div className="w-[1px] h-8 bg-neutral-700 relative overflow-hidden">
            <div className="w-full h-1/2 bg-white animate-bounce" />
          </div>
        </button>
      </div>
    );
  }
);

IntroOverlay.displayName = "IntroOverlay";
