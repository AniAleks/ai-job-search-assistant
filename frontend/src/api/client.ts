import type { Application, ApplicationStatus, Resume } from "./types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });

  if (res.status === 204) return undefined as T;

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const message = body?.message ?? `Request failed with status ${res.status}`;
    throw new ApiError(Array.isArray(message) ? message.join(", ") : message, res.status);
  }
  return body as T;
}

// Resumes
export const listResumes = () => request<Resume[]>("/resumes");
export const getResume = (id: string) => request<Resume>(`/resumes/${id}`);
export const createResume = (dto: { name: string; content: string }) =>
  request<Resume>("/resumes", { method: "POST", body: JSON.stringify(dto) });
export const deleteResume = (id: string) => request<void>(`/resumes/${id}`, { method: "DELETE" });

// Analysis
export const analyzeJob = (dto: { resumeId: string; jobPosting: string }) =>
  request<Application>("/analyses", { method: "POST", body: JSON.stringify(dto) });

// Applications
export const listApplications = (status?: ApplicationStatus) =>
  request<Application[]>(`/applications${status ? `?status=${status}` : ""}`);
export const getApplication = (id: string) => request<Application>(`/applications/${id}`);
export const updateApplication = (id: string, dto: { status?: ApplicationStatus; note?: string }) =>
  request<Application>(`/applications/${id}`, { method: "PATCH", body: JSON.stringify(dto) });
export const deleteApplication = (id: string) => request<void>(`/applications/${id}`, { method: "DELETE" });

// Assistant
export const chat = (message: string) =>
  request<{ reply: string }>("/assistant", { method: "POST", body: JSON.stringify({ message }) });
