import { z } from "zod";

export const ResumeExtractionSchema = z.object({
  hardSkills: z.array(z.string()).default([]),
  softSkills: z.array(z.string()).default([]),
  experience: z.array(
    z.object({
      title: z.string().optional(),
      years: z.number().optional(),
    })
  ).default([]),
  education: z.array(z.string()).default([]),
});

export const JDExtractionSchema = z.object({
  mustHaveSkills: z.array(z.string()).default([]),
  niceToHaveSkills: z.array(z.string()).default([]),
  responsibilities: z.array(z.string()).default([]),
  seniorityLevel: z.enum(["entry", "mid", "senior", "lead"]).default("mid"),
});