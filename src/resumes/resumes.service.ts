import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { Model } from "mongoose";
import type { CreateResumeDto } from "./resume.dto.js";
import { Resume, type ResumeDocument } from "./resume.schema.js";

@Injectable()
export class ResumesService {
  constructor(@InjectModel(Resume.name) private readonly resumes: Model<Resume>) {}

  create(dto: CreateResumeDto): Promise<ResumeDocument> {
    return this.resumes.create(dto);
  }

  findAll(): Promise<ResumeDocument[]> {
    return this.resumes.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<ResumeDocument> {
    const resume = await this.resumes.findById(id).exec();
    if (!resume) throw new NotFoundException(`Resume ${id} not found`);
    return resume;
  }

  async remove(id: string): Promise<void> {
    const result = await this.resumes.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Resume ${id} not found`);
  }
}
