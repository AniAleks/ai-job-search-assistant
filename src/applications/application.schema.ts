import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { type HydratedDocument, Types } from "mongoose";

export const APPLICATION_STATUSES = [
  "saved",
  "applied",
  "interviewing",
  "offer",
  "rejected",
  "withdrawn",
] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

@Schema({ _id: false })
export class Fit {
  @Prop({ type: Number, required: true, min: 0, max: 100 })
  score!: number;

  @Prop({ type: String, required: true })
  summary!: string;

  @Prop({ type: [String], default: [] })
  matchedRequirements!: string[];

  @Prop({ type: [String], default: [] })
  gaps!: string[];
}

@Schema({ _id: false })
export class TailoredBullet {
  @Prop({ type: String, required: true })
  original!: string;

  @Prop({ type: String, required: true })
  tailored!: string;

  @Prop({ type: String, required: true })
  rationale!: string;
}

@Schema({ _id: false, timestamps: { createdAt: "at", updatedAt: false } })
export class Note {
  @Prop({ type: String, required: true })
  text!: string;

  at?: Date;
}

@Schema({ timestamps: true })
export class Application {
  @Prop({ type: String, required: true, trim: true })
  company!: string;

  @Prop({ type: String, required: true, trim: true })
  title!: string;

  @Prop({ type: String, required: true })
  jobPosting!: string;

  @Prop({ type: Types.ObjectId, ref: "Resume", required: true })
  resumeId!: Types.ObjectId;

  @Prop({ type: String, enum: APPLICATION_STATUSES, default: "saved", index: true })
  status!: ApplicationStatus;

  @Prop({ type: Date })
  appliedAt?: Date;

  @Prop({ type: SchemaFactory.createForClass(Fit), required: true })
  fit!: Fit;

  @Prop({ type: [SchemaFactory.createForClass(TailoredBullet)], default: [] })
  tailoredBullets!: TailoredBullet[];

  @Prop({ type: String, required: true })
  coverNote!: string;

  @Prop({ type: [SchemaFactory.createForClass(Note)], default: [] })
  notes!: Note[];
}

export type ApplicationDocument = HydratedDocument<Application>;
export const ApplicationSchema = SchemaFactory.createForClass(Application);
