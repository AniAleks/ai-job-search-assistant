import { z } from "zod";

export const CreateResumeSchema = z.object({
  name: z.string().trim().min(1).max(200),
  content: z.string().trim().min(50, "Paste the full resume text").max(50_000),
});
export type CreateResumeDto = z.infer<typeof CreateResumeSchema>;
