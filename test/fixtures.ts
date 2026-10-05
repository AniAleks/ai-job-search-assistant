import type { JobAnalysis } from "../src/analysis/job-analysis.schema.js";

export const RESUME_TEXT = `Jane Doe — Backend Engineer
Experience
- Built an internal HR tool in Node.js that automated onboarding for 300 employees.
- Designed REST APIs backed by MongoDB serving 2M requests per day.
- Mentored two junior developers.`;

export const JOB_POSTING = `Acme Corp is hiring a Senior Backend Engineer (NestJS).
Requirements: 5+ years TypeScript/Node.js, NestJS, MongoDB, AWS, experience building internal tools.
Nice to have: LLM / AI product experience.`;

export const ANALYSIS: JobAnalysis = {
  company: "Acme Corp",
  title: "Senior Backend Engineer",
  fit: {
    score: 78,
    summary: "Strong Node/Mongo backend match; AWS and NestJS are not shown.",
    matchedRequirements: ["Node.js", "MongoDB", "Internal tools"],
    gaps: ["NestJS", "AWS"],
  },
  tailoredBullets: [
    {
      original: "Designed REST APIs backed by MongoDB serving 2M requests per day.",
      tailored: "Designed TypeScript REST APIs on MongoDB handling 2M requests/day.",
      rationale: "Targets the MongoDB and scale requirements.",
    },
  ],
  coverNote: "Hi Acme team — I build internal tools in Node.js...",
};
