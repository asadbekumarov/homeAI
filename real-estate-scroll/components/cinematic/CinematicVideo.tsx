"use client";

import React from "react";
import { VIDEO_SRC } from "./types";

interface CinematicVideoProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onLoadedMetadata: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
  onCanPlay: () => void;
  onProgress: () => void;
}

export const CinematicVideo: React.FC<CinematicVideoProps> = ({
  videoRef,
  onLoadedMetadata,
  onCanPlay,
  onProgress,
}) => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#050505] flex items-center justify-center">
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        aria-label="Featured residence architectural presentation"
        onLoadedMetadata={onLoadedMetadata}
        onCanPlay={onCanPlay}
        onProgress={onProgress}
        className="w-full h-full object-contain pointer-events-none select-none max-w-full max-h-full"
      />
    </div>
  );
};
