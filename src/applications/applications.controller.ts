import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Query } from "@nestjs/common";
import { ObjectIdPipe } from "../common/object-id.pipe.js";
import { ZodValidationPipe } from "../common/zod-validation.pipe.js";
import {
  type ListApplicationsQuery,
  ListApplicationsQuerySchema,
  type UpdateApplicationDto,
  UpdateApplicationSchema,
} from "./application.dto.js";
import { ApplicationsService } from "./applications.service.js";

@Controller("applications")
export class ApplicationsController {
  constructor(private readonly applications: ApplicationsService) {}

  @Get()
  findAll(@Query(new ZodValidationPipe(ListApplicationsQuerySchema)) query: ListApplicationsQuery) {
    return this.applications.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id", ObjectIdPipe) id: string) {
    return this.applications.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id", ObjectIdPipe) id: string,
    @Body(new ZodValidationPipe(UpdateApplicationSchema)) dto: UpdateApplicationDto,
  ) {
    return this.applications.update(id, dto);
  }

  @Delete(":id")
  @HttpCode(204)
  remove(@Param("id", ObjectIdPipe) id: string) {
    return this.applications.remove(id);
  }
}
