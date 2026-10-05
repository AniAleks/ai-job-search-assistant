import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AnalysisModule } from "./analysis/analysis.module.js";
import { ApplicationsModule } from "./applications/applications.module.js";
import { AssistantModule } from "./assistant/assistant.module.js";
import { ClaudeModule } from "./claude/claude.module.js";
import { type Env, validateEnv } from "./config.js";
import { HealthController } from "./health.controller.js";
import { ResumesModule } from "./resumes/resumes.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) => ({ uri: config.get("MONGODB_URI", { infer: true }) }),
    }),
    ClaudeModule,
    ResumesModule,
    ApplicationsModule,
    AnalysisModule,
    AssistantModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
