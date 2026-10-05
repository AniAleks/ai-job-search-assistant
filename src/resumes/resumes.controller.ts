import { Body, Controller, Delete, Get, HttpCode, Param, Post } from "@nestjs/common";
import { ObjectIdPipe } from "../common/object-id.pipe.js";
import { ZodValidationPipe } from "../common/zod-validation.pipe.js";
import { type CreateResumeDto, CreateResumeSchema } from "./resume.dto.js";
import { ResumesService } from "./resumes.service.js";

@Controller("resumes")
export class ResumesController {
  constructor(private readonly resumes: ResumesService) {}

  @Post()
  create(@Body(new ZodValidationPipe(CreateResumeSchema)) dto: CreateResumeDto) {
    return this.resumes.create(dto);
  }

  @Get()
  findAll() {
    return this.resumes.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ObjectIdPipe) id: string) {
    return this.resumes.findOne(id);
  }

  @Delete(":id")
  @HttpCode(204)
  remove(@Param("id", ObjectIdPipe) id: string) {
    return this.resumes.remove(id);
  }
}
