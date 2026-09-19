"use client";

import React from "react";
import { CHAPTERS } from "./types";

interface CinematicVideoProps {
  videoRefs: React.MutableRefObject<(HTMLVideoElement | null)[]>;
  onLoadedMetadata: (index: number, duration: number) => void;
  onCanPlay: (index: number) => void;
  onSeeked?: (index: number) => void;
}

export const CinematicVideo: React.FC<CinematicVideoProps> = ({
  videoRefs,
  onLoadedMetadata,
  onCanPlay,
  onSeeked,
}) => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#050505]">
      {CHAPTERS.map((chapter, index) => (
        <video
          key={chapter.id}
          ref={(el) => {
            videoRefs.current[index] = el;
          }}
          src={chapter.src}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          aria-label={chapter.title}
          onLoadedMetadata={(e) =>
            onLoadedMetadata(index, e.currentTarget.duration)
          }
          onCanPlay={() => onCanPlay(index)}
          onSeeked={() => onSeeked?.(index)}
          style={{
            opacity: index === 0 ? 1 : 0,
            visibility: index === 0 ? "visible" : "hidden",
            willChange: "opacity",
          }}
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
        />
      ))}
      {/* Subtle cinematic edge falloff to blend seamlessly with #050505 frame */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#050505]/40 via-transparent to-[#050505]/30" />
    </div>
  );
};
