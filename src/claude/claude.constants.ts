import type Anthropic from "@anthropic-ai/sdk";

export const ANTHROPIC_CLIENT = Symbol("ANTHROPIC_CLIENT");
export const CLAUDE_MODEL = Symbol("CLAUDE_MODEL");

/**
 * Server-side refusal fallback: if the primary model declines a request, the API
 * re-runs it on a suitable fallback model inside the same call.
 */
export function fallbackOptions(): Pick<Anthropic.Beta.MessageCreateParams, "betas" | "fallbacks"> {
  return { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" };
}
