import type { ApplicationStatus } from "../api/types";

const LABELS: Record<ApplicationStatus, string> = {
  saved: "Saved",
  applied: "Applied",
  interviewing: "Interviewing",
  offer: "Offer",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return <span className={`badge badge-${status}`}>{LABELS[status]}</span>;
}
