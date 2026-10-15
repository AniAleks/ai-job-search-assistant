import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module.js";
import { AnthropicExceptionFilter } from "./common/anthropic-exception.filter.js";
import type { Env } from "./config.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService<Env, true>);
  app.enableCors({ origin: config.get("CORS_ORIGINS", { infer: true }) });
  app.useGlobalFilters(new AnthropicExceptionFilter());
  app.enableShutdownHooks();
  const port = config.get("PORT", { infer: true });
  await app.listen(port, "0.0.0.0");
}

void bootstrap();
