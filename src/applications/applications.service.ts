import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { type Model, Types } from "mongoose";
import type { JobAnalysis } from "../analysis/job-analysis.schema.js";
import type { ListApplicationsQuery, UpdateApplicationDto } from "./application.dto.js";
import { Application, type ApplicationDocument } from "./application.schema.js";

export interface CreateApplicationInput {
  resumeId: string;
  jobPosting: string;
  analysis: JobAnalysis;
}

@Injectable()
export class ApplicationsService {
  constructor(@InjectModel(Application.name) private readonly applications: Model<Application>) {}

  create({ resumeId, jobPosting, analysis }: CreateApplicationInput): Promise<ApplicationDocument> {
    return this.applications.create({
      resumeId: new Types.ObjectId(resumeId),
      jobPosting,
      company: analysis.company,
      title: analysis.title,
      fit: analysis.fit,
      tailoredBullets: analysis.tailoredBullets,
      coverNote: analysis.coverNote,
    });
  }

  findAll(query: ListApplicationsQuery = {}): Promise<ApplicationDocument[]> {
    const filter = query.status ? { status: query.status } : {};
    return this.applications.find(filter).sort({ updatedAt: -1 }).exec();
  }

  async findOne(id: string): Promise<ApplicationDocument> {
    const application = await this.applications.findById(id).exec();
    if (!application) throw new NotFoundException(`Application ${id} not found`);
    return application;
  }

  async update(id: string, dto: UpdateApplicationDto): Promise<ApplicationDocument> {
    const application = await this.findOne(id);
    if (dto.status && dto.status !== application.status) {
      application.status = dto.status;
      if (dto.status === "applied" && !application.appliedAt) {
        application.appliedAt = new Date();
      }
    }
    if (dto.note) {
      application.notes.push({ text: dto.note });
    }
    return application.save();
  }

  async remove(id: string): Promise<void> {
    const result = await this.applications.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Application ${id} not found`);
  }
}
