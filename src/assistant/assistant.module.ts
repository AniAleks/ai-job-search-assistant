import { Module } from "@nestjs/common";
import { ApplicationsModule } from "../applications/applications.module.js";
import { AssistantController } from "./assistant.controller.js";
import { AssistantService } from "./assistant.service.js";

@Module({
  imports: [ApplicationsModule],
  controllers: [AssistantController],
  providers: [AssistantService],
})
export class AssistantModule {}
