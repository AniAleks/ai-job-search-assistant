import { Module } from "@nestjs/common";
import { ApplicationsModule } from "../applications/applications.module.js";
import { ResumesModule } from "../resumes/resumes.module.js";
import { AnalysisController } from "./analysis.controller.js";
import { AnalysisService } from "./analysis.service.js";

@Module({
  imports: [ResumesModule, ApplicationsModule],
  controllers: [AnalysisController],
  providers: [AnalysisService],
})
export class AnalysisModule {}
