import type Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { BadGatewayException, Inject, Injectable, UnprocessableEntityException } from "@nestjs/common";
import { ANTHROPIC_CLIENT, CLAUDE_MODEL, fallbackOptions } from "../claude/claude.constants.js";
import { type JobAnalysis, JobAnalysisSchema } from "./job-analysis.schema.js";
import { ANALYSIS_SYSTEM_PROMPT, buildAnalysisPrompt } from "./prompts.js";

@Injectable()
export class AnalysisService {
  constructor(
    @Inject(ANTHROPIC_CLIENT) private readonly client: Anthropic,
    @Inject(CLAUDE_MODEL) private readonly model: string,
  ) {}

  /** Scores resume/job fit, tailors bullets, and drafts a cover note in one structured call. */
  async analyze(resume: string, jobPosting: string): Promise<JobAnalysis> {
    const response = await this.client.beta.messages.parse({
      ...fallbackOptions(),
      model: this.model,
      max_tokens: 16000,
      output_config: {
        effort: "high",
        format: betaZodOutputFormat(JobAnalysisSchema),
      },
      system: ANALYSIS_SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildAnalysisPrompt(resume, jobPosting) }],
    });

    if (response.stop_reason === "refusal") {
      throw new UnprocessableEntityException(
        `Claude declined to analyse this posting${
          response.stop_details?.category ? ` (${response.stop_details.category})` : ""
        }`,
      );
    }
    if (response.stop_reason === "max_tokens") {
      throw new BadGatewayException("Analysis was cut off before it finished; try a shorter posting");
    }
    if (!response.parsed_output) {
      throw new BadGatewayException("Claude returned an analysis that did not match the expected format");
    }
    return response.parsed_output;
  }
}
