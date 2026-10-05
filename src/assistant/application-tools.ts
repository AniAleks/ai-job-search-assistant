import { betaZodTool } from "@anthropic-ai/sdk/helpers/beta/zod";
import { isValidObjectId } from "mongoose";
import { z } from "zod";
import { APPLICATION_STATUSES, type ApplicationDocument } from "../applications/application.schema.js";
import type { ApplicationsService } from "../applications/applications.service.js";

const summarize = (a: ApplicationDocument) => ({
  id: a.id as string,
  company: a.company,
  title: a.title,
  status: a.status,
  fitScore: a.fit.score,
  appliedAt: a.appliedAt ?? null,
  updatedAt: (a as unknown as { updatedAt?: Date }).updatedAt ?? null,
});

const requireId = (id: string) => {
  if (!isValidObjectId(id)) throw new Error(`"${id}" is not a valid application id`);
};

/** Tools that let Claude read and update the user's application tracker. */
export function buildApplicationTools(applications: ApplicationsService) {
  return [
    betaZodTool({
      name: "list_applications",
      description:
        "List the user's tracked job applications, most recently updated first. Returns id, company, title, status, fit score and dates for each.",
      inputSchema: z.object({
        status: z.enum(APPLICATION_STATUSES).optional().describe("Only return applications with this status"),
      }),
      run: async ({ status }) => JSON.stringify((await applications.findAll({ status })).map(summarize)),
    }),
    betaZodTool({
      name: "get_application",
      description:
        "Get full details of one application: fit assessment, tailored resume bullets, cover note, notes and the job posting.",
      inputSchema: z.object({ id: z.string().describe("Application id from list_applications") }),
      run: async ({ id }) => {
        requireId(id);
        const a = await applications.findOne(id);
        return JSON.stringify({
          ...summarize(a),
          fit: a.fit,
          tailoredBullets: a.tailoredBullets,
          coverNote: a.coverNote,
          notes: a.notes,
          jobPosting: a.jobPosting,
        });
      },
    }),
    betaZodTool({
      name: "update_application",
      description:
        "Change an application's status and/or append a note to it. Use when the user reports progress, e.g. they applied, got an interview, or were rejected.",
      inputSchema: z.object({
        id: z.string().describe("Application id from list_applications"),
        status: z.enum(APPLICATION_STATUSES).optional(),
        note: z.string().optional().describe("Short note to append, e.g. interview date or contact name"),
      }),
      run: async ({ id, status, note }) => {
        requireId(id);
        if (!status && !note) throw new Error("Provide a status and/or a note");
        return JSON.stringify(summarize(await applications.update(id, { status, note })));
      },
    }),
  ] as const;
}
