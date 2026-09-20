export interface Chapter {
  id: number;
  code: string;
  label: string;
  title: string;
  description: string;
  startProgress: number;
  endProgress: number;
}

export const VIDEO_SRC = "/video/video_2026-09-20_06-17-10.mp4";

export const CHAPTERS: Chapter[] = [
  {
    id: 0,
    code: "01",
    label: "01 — CONSTRUCTION",
    title: "CONSTRUCTION",
    description: "Architectural structure from ground foundation to exterior completion.",
    startProgress: 0.0,
    endProgress: 0.25,
  },
  {
    id: 1,
    code: "02",
    label: "02 — ENTRANCE",
    title: "ENTRANCE",
    description: "Exterior arrival transition into the double-height grand lobby.",
    startProgress: 0.25,
    endProgress: 0.50,
  },
  {
    id: 2,
    code: "03",
    label: "03 — EXPLORE",
    title: "EXPLORE",
    description: "Corridors and architectural circulation connecting residential spaces.",
    startProgress: 0.50,
    endProgress: 0.75,
  },
  {
    id: 3,
    code: "04",
    label: "04 — YOUR APARTMENT",
    title: "YOUR APARTMENT",
    description: "Featured residence interior space with continuous architectural perspective.",
    startProgress: 0.75,
    endProgress: 1.0,
  },
];

export interface InquiryFormData {
  name: string;
  phone: string;
  email: string;
  message: string;
}
