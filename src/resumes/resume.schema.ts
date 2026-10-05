import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument } from "mongoose";

@Schema({ timestamps: true })
export class Resume {
  @Prop({ type: String, required: true, trim: true })
  name!: string;

  /** Plain-text resume content. */
  @Prop({ type: String, required: true })
  content!: string;
}

export type ResumeDocument = HydratedDocument<Resume>;
export const ResumeSchema = SchemaFactory.createForClass(Resume);
