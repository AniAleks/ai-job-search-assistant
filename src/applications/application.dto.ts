import { z } from "zod";
import { APPLICATION_STATUSES } from "./application.schema.js";

export const ListApplicationsQuerySchema = z.object({
  status: z.enum(APPLICATION_STATUSES).optional(),
});
export type ListApplicationsQuery = z.infer<typeof ListApplicationsQuerySchema>;

export const UpdateApplicationSchema = z
  .object({
    status: z.enum(APPLICATION_STATUSES).optional(),
    note: z.string().trim().min(1).max(2000).optional(),
  })
  .refine((v) => v.status !== undefined || v.note !== undefined, {
    message: "Provide a status and/or a note",
  });
export type UpdateApplicationDto = z.infer<typeof UpdateApplicationSchema>;
