export interface Resume {
  _id: string;
  name: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export const APPLICATION_STATUSES = [
  "saved",
  "applied",
  "interviewing",
  "offer",
  "rejected",
  "withdrawn",
] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export interface Fit {
  score: number;
  summary: string;
  matchedRequirements: string[];
  gaps: string[];
}

export interface TailoredBullet {
  original: string;
  tailored: string;
  rationale: string;
}

export interface Note {
  text: string;
  at: string;
}

export interface Application {
  _id: string;
  company: string;
  title: string;
  jobPosting: string;
  resumeId: string;
  status: ApplicationStatus;
  appliedAt: string | null;
  fit: Fit;
  tailoredBullets: TailoredBullet[];
  coverNote: string;
  notes: Note[];
  createdAt: string;
  updatedAt: string;
}
