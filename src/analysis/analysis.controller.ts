import { Body, Controller, Post } from "@nestjs/common";
import { ApplicationsService } from "../applications/applications.service.js";
import { ZodValidationPipe } from "../common/zod-validation.pipe.js";
import { ResumesService } from "../resumes/resumes.service.js";
import { type AnalyzeJobDto, AnalyzeJobSchema } from "./analysis.dto.js";
import { AnalysisService } from "./analysis.service.js";

@Controller("analyses")
export class AnalysisController {
  constructor(
    private readonly analysis: AnalysisService,
    private readonly resumes: ResumesService,
    private readonly applications: ApplicationsService,
  ) {}

  /** Analyse a posting against a stored resume and start tracking it as an application. */
  @Post()
  async analyze(@Body(new ZodValidationPipe(AnalyzeJobSchema)) dto: AnalyzeJobDto) {
    const resume = await this.resumes.findOne(dto.resumeId);
    const result = await this.analysis.analyze(resume.content, dto.jobPosting);
    return this.applications.create({ resumeId: dto.resumeId, jobPosting: dto.jobPosting, analysis: result });
  }
}
