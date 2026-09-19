export interface Chapter {
  id: number;
  code: string;
  label: string;
  title: string;
  src: string;
  startProgress: number;
  endProgress: number;
}

export const CHAPTERS: Chapter[] = [
  {
    id: 0,
    code: "01",
    label: "01 — CONSTRUCTION",
    title: "CONSTRUCTION",
    src: "/videos/01-construction.mp4",
    startProgress: 0.0,
    endProgress: 0.25,
  },
  {
    id: 1,
    code: "02",
    label: "02 — ENTRANCE",
    title: "ENTRANCE",
    src: "/videos/02-entrance.mp4",
    startProgress: 0.25,
    endProgress: 0.50,
  },
  {
    id: 2,
    code: "03",
    label: "03 — EXPLORE",
    title: "EXPLORE",
    src: "/videos/03-corridor.mp4",
    startProgress: 0.50,
    endProgress: 0.75,
  },
  {
    id: 3,
    code: "04",
    label: "04 — YOUR APARTMENT",
    title: "YOUR APARTMENT",
    src: "/videos/04-apartment.mp4",
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
