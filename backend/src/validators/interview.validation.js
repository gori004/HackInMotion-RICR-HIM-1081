import { z } from "zod";

export const startInterviewSchema = z.object({
  resumeId: z.string().optional(),
  jobDescriptionId: z.string().optional(),
  questions: z
    .array(
      z.object({
        question: z.string().min(1),
        type: z.enum(["technical", "behavioral"]),
      })
    )
    .min(1, "At least one question is required."),
});

export const submitAnswerSchema = z.object({
  sessionId: z.string().min(1, "sessionId is required."),
  questionIndex: z.number().int().min(0),
  answer: z.string().min(1, "Answer cannot be empty."),
  feedback: z
    .object({
      clarity: z.number().min(0).max(10).optional(),
      relevance: z.number().min(0).max(10).optional(),
      completeness: z.number().min(0).max(10).optional(),
      comment: z.string().optional(),
    })
    .optional(),
});

export const completeInterviewSchema = z.object({
  sessionId: z.string().min(1, "sessionId is required."),
  overallSummary: z
    .object({
      averageScore: z.number().min(0).max(10).optional(),
      strengths: z.array(z.string()).optional(),
      areasToImprove: z.array(z.string()).optional(),
    })
    .optional(),
});