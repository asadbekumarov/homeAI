import { z } from "zod";
import { BuildingSchema } from "./building";

export const ProjectChapterSchema = z.object({
  code: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  target: z.number().min(0).max(1),
});

export type ProjectChapter = z.infer<typeof ProjectChapterSchema>;

export const ProjectConfigSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  developerName: z.string().min(1),
  projectName: z.string().min(1),
  tagline: z.string().min(1),
  location: z.string().min(1),
  address: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  telegram: z.string().optional(),
  whatsapp: z.string().optional(),
  heroVideoUrl: z.string().min(1),
  theaterVideoUrl: z.string().optional(),
  posterUrl: z.string().min(1),
  badgeText: z.string().optional(),
  accentColor: z.string().optional(),
  chapters: z.array(ProjectChapterSchema).min(1),
  building: BuildingSchema,
  stats: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
    })
  ).optional(),
});

export type ProjectConfig = z.infer<typeof ProjectConfigSchema>;
