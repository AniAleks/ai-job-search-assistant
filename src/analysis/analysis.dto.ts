import { z } from "zod";

export const AnalyzeJobSchema = z.object({
  resumeId: z.string().regex(/^[a-f\d]{24}$/i, "resumeId must be a valid id"),
  jobPosting: z.string().trim().min(100, "Paste the full job posting").max(50_000),
});
export type AnalyzeJobDto = z.infer<typeof AnalyzeJobSchema>;
