import type Anthropic from "@anthropic-ai/sdk";
import { BadGatewayException, Inject, Injectable, UnprocessableEntityException } from "@nestjs/common";
import { ApplicationsService } from "../applications/applications.service.js";
import { ANTHROPIC_CLIENT, CLAUDE_MODEL, fallbackOptions } from "../claude/claude.constants.js";
import { buildApplicationTools } from "./application-tools.js";

const SYSTEM_PROMPT = `You are the user's job search assistant. You can look up and update their application tracker with the tools provided.

Use the tools to answer questions about their applications rather than guessing. When the user reports progress on an application (applied, interview scheduled, offer, rejection), update it. If more than one application could match what they describe, ask which one they mean instead of picking. Keep replies short and concrete.`;

@Injectable()
export class AssistantService {
  constructor(
    @Inject(ANTHROPIC_CLIENT) private readonly client: Anthropic,
    @Inject(CLAUDE_MODEL) private readonly model: string,
    private readonly applications: ApplicationsService,
  ) {}

  async chat(message: string): Promise<{ reply: string }> {
    const finalMessage = await this.client.beta.messages.toolRunner({
      ...fallbackOptions(),
      model: this.model,
      max_tokens: 16000,
      max_iterations: 10,
      output_config: { effort: "medium" },
      system: SYSTEM_PROMPT,
      tools: [...buildApplicationTools(this.applications)],
      messages: [{ role: "user", content: message }],
    });

    if (finalMessage.stop_reason === "refusal") {
      throw new UnprocessableEntityException("Claude declined this request");
    }
    const reply = finalMessage.content
      .flatMap((block) => (block.type === "text" ? [block.text] : []))
      .join("\n")
      .trim();
    if (!reply) throw new BadGatewayException("The assistant did not produce a reply");
    return { reply };
  }
}
