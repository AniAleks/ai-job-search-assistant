import { z } from "zod";

/** The structured output Claude returns for a resume + job posting pair. */
export const JobAnalysisSchema = z.object({
  company: z.string().describe('Hiring company name as stated in the posting, or "Unknown"'),
  title: z.string().describe("Job title as stated in the posting"),
  fit: z.object({
    score: z
      .number()
      .int()
      .min(0)
      .max(100)
      .describe("Overall fit from 0 (no overlap) to 100 (meets every requirement)"),
    summary: z.string().describe("Two or three sentences explaining the score"),
    matchedRequirements: z
      .array(z.string())
      .describe("Requirements from the posting that the resume clearly demonstrates"),
    gaps: z
      .array(z.string())
      .describe("Requirements from the posting the resume does not show, most important first"),
  }),
  tailoredBullets: z
    .array(
      z.object({
        original: z.string().describe("The bullet exactly as written in the resume"),
        tailored: z.string().describe("Rewritten bullet aimed at this posting"),
        rationale: z.string().describe("Which posting requirement this targets and why"),
      }),
    )
    .describe("The resume bullets most worth rewriting for this job, strongest first"),
  coverNote: z.string().describe("A short cover note (120-180 words), ready to send"),
});

export type JobAnalysis = z.infer<typeof JobAnalysisSchema>;
