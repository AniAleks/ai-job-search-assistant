import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module.js";
import { AnthropicExceptionFilter } from "./common/anthropic-exception.filter.js";
import type { Env } from "./config.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AnthropicExceptionFilter());
  app.enableShutdownHooks();
  const port = app.get(ConfigService<Env, true>).get("PORT", { infer: true });
  await app.listen(port);
}

void bootstrap();
