"use client";

import React, { useState, useRef, useEffect } from "react";
import { useProject } from "@/context/ProjectContext";
import { ChevronDown, Check, Sparkles } from "lucide-react";

export interface DeveloperSwitcherProps {
  className?: string;
}

export default function DeveloperSwitcher({ className = "" }: DeveloperSwitcherProps) {
  const { currentProject, setProjectSlug, availableProjects } = useProject();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard navigation: Escape key closes menu
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleSelect = (slug: string) => {
    setProjectSlug(slug);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      className={`relative inline-block text-left ${className}`}
    >
      {/* Floating Pitch Badge Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Loyihani tanlash: ${currentProject.projectName}`}
        className="min-h-[44px] flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/75 hover:bg-black/90 backdrop-blur-xl border border-white/20 text-white transition-all shadow-2xl hover:scale-[1.02] active:scale-[0.98] cursor-pointer text-xs font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-accent whitespace-nowrap shrink-0"
      >
        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        <span className="text-white/60 uppercase tracking-widest text-[10px] hidden sm:inline">
          Pitch:
        </span>
        <span className="font-semibold text-white tracking-wide">
          {currentProject.projectName}
        </span>
        <ChevronDown
          size={14}
          className={`text-white/60 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Loyihalar ro'yxati"
          className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0F0E0C]/95 backdrop-blur-2xl border border-white/15 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="px-3 py-2 border-b border-white/10 mb-1 flex items-center justify-between">
            <span className="text-[10px] tracking-wider uppercase text-accent font-semibold flex items-center gap-1.5">
              <Sparkles size={12} />
              Developer Showcase
            </span>
            <span className="text-[10px] text-white/40">
              {availableProjects.length} ta loyiha
            </span>
          </div>

          <div className="space-y-1">
            {availableProjects.map((project) => {
              const isSelected = project.slug === currentProject.slug;
              return (
                <button
                  key={project.slug}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(project.slug)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-accent/20 text-accent font-semibold border border-accent/30"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div className="truncate pr-2">
                    <div className="font-medium text-white truncate">
                      {project.projectName}
                    </div>
                    <div className="text-[10px] text-white/50 truncate">
                      {project.developerName} · {project.location}
                    </div>
                  </div>

                  {isSelected && (
                    <Check size={14} className="text-accent flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
