import Anthropic from "@anthropic-ai/sdk";
import { Global, Logger, Module, type OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Env } from "../config.js";
import { ANTHROPIC_CLIENT, CLAUDE_MODEL } from "./claude.constants.js";

@Global()
@Module({
  providers: [
    {
      provide: ANTHROPIC_CLIENT,
      // Resolves credentials from ANTHROPIC_API_KEY / ANTHROPIC_AUTH_TOKEN / an `ant auth login` profile.
      useFactory: () => new Anthropic(),
    },
    {
      provide: CLAUDE_MODEL,
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) => config.get("CLAUDE_MODEL", { infer: true }),
    },
  ],
  exports: [ANTHROPIC_CLIENT, CLAUDE_MODEL],
})
export class ClaudeModule implements OnModuleInit {
  onModuleInit() {
    if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
      new Logger(ClaudeModule.name).warn(
        "ANTHROPIC_API_KEY is not set; AI endpoints will fail unless an `ant auth login` profile is configured",
      );
    }
  }
}
