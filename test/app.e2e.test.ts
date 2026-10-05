import type { INestApplication } from "@nestjs/common";
import { getConnectionToken } from "@nestjs/mongoose";
import { Test } from "@nestjs/testing";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { AppModule } from "../src/app.module.js";
import { ANTHROPIC_CLIENT } from "../src/claude/claude.constants.js";
import { buildApplicationTools } from "../src/assistant/application-tools.js";
import { ApplicationsService } from "../src/applications/applications.service.js";
import { ANALYSIS, JOB_POSTING, RESUME_TEXT } from "./fixtures.js";

describe("API (e2e)", () => {
  let mongo: MongoMemoryServer | undefined;
  let app: INestApplication;
  const parse = vi.fn().mockResolvedValue({ stop_reason: "end_turn", parsed_output: ANALYSIS });

  beforeAll(async () => {
    // Use an existing MongoDB when MONGODB_TEST_URI is set; otherwise spin one up in memory.
    const baseUri = process.env.MONGODB_TEST_URI ?? (mongo = await MongoMemoryServer.create()).getUri();
    const url = new URL(baseUri);
    url.pathname = `/job-search-test-${Date.now()}`;
    process.env.MONGODB_URI = url.toString();
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(ANTHROPIC_CLIENT)
      .useValue({ beta: { messages: { parse } } })
      .compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app?.get(getConnectionToken()).dropDatabase();
    await app?.close();
    await mongo?.stop();
  });

  it("stores a resume, analyses a posting and tracks the application", async () => {
    const server = app.getHttpServer();

    const resume = await request(server).post("/resumes").send({ name: "Main", content: RESUME_TEXT }).expect(201);

    const created = await request(server)
      .post("/analyses")
      .send({ resumeId: resume.body._id, jobPosting: JOB_POSTING })
      .expect(201);
    expect(created.body).toMatchObject({ company: "Acme Corp", status: "saved", fit: { score: 78 } });

    const updated = await request(server)
      .patch(`/applications/${created.body._id}`)
      .send({ status: "applied", note: "Sent via referral" })
      .expect(200);
    expect(updated.body.status).toBe("applied");
    expect(updated.body.appliedAt).toBeTruthy();
    expect(updated.body.notes[0].text).toBe("Sent via referral");

    const applied = await request(server).get("/applications?status=applied").expect(200);
    expect(applied.body).toHaveLength(1);
  });

  it("validates input", async () => {
    const server = app.getHttpServer();
    await request(server).post("/analyses").send({ resumeId: "nope", jobPosting: "short" }).expect(400);
    await request(server).get("/applications/not-an-id").expect(400);
    await request(server).get("/applications?status=bogus").expect(400);
  });

  it("exposes assistant tools that read and update the tracker", async () => {
    const [list, get, update] = buildApplicationTools(app.get(ApplicationsService));

    const listed = JSON.parse((await list.run({})) as string);
    expect(listed[0]).toMatchObject({ company: "Acme Corp", status: "applied" });

    const updated = JSON.parse(
      (await update.run({ id: listed[0].id, status: "interviewing" })) as string,
    );
    expect(updated.status).toBe("interviewing");

    await expect(get.run({ id: "bad" })).rejects.toThrow(/not a valid/);
  });
});
