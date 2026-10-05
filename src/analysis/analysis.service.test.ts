import type Anthropic from "@anthropic-ai/sdk";
import { BadGatewayException, UnprocessableEntityException } from "@nestjs/common";
import { describe, expect, it, vi } from "vitest";
import { ANALYSIS, JOB_POSTING, RESUME_TEXT } from "../../test/fixtures.js";
import { AnalysisService } from "./analysis.service.js";

function serviceReturning(response: Record<string, unknown>) {
  const parse = vi.fn().mockResolvedValue(response);
  const client = { beta: { messages: { parse } } } as unknown as Anthropic;
  return { service: new AnalysisService(client, "claude-opus-5-5"), parse };
}

describe("AnalysisService", () => {
  it("sends resume and posting to Claude with a structured output format", async () => {
    const { service, parse } = serviceReturning({ stop_reason: "end_turn", parsed_output: ANALYSIS });

    await expect(service.analyze(RESUME_TEXT, JOB_POSTING)).resolves.toEqual(ANALYSIS);

    const params = parse.mock.calls[0]![0];
    expect(params.model).toBe("claude-opus-5-5");
    expect(params.output_config.format.type).toBe("json_schema");
    expect(params.fallbacks).toBe("default");
    expect(params.messages[0].content).toContain("<resume>");
    expect(params.messages[0].content).toContain(JOB_POSTING);
  });

  it("reports a refusal as 422", async () => {
    const { service } = serviceReturning({
      stop_reason: "refusal",
      stop_details: { type: "refusal", category: "cyber" },
      parsed_output: null,
    });
    await expect(service.analyze(RESUME_TEXT, JOB_POSTING)).rejects.toBeInstanceOf(UnprocessableEntityException);
  });

  it("reports truncated or unparseable output as 502", async () => {
    await expect(
      serviceReturning({ stop_reason: "max_tokens", parsed_output: null }).service.analyze(RESUME_TEXT, JOB_POSTING),
    ).rejects.toBeInstanceOf(BadGatewayException);
    await expect(
      serviceReturning({ stop_reason: "end_turn", parsed_output: null }).service.analyze(RESUME_TEXT, JOB_POSTING),
    ).rejects.toBeInstanceOf(BadGatewayException);
  });
});
