export function Loading() {
  return <p className="state-message">Loading…</p>;
}

export function ErrorMessage({ error }: { error: unknown }) {
  const message = error instanceof Error ? error.message : "Something went wrong";
  return <p className="state-message state-error">{message}</p>;
}
