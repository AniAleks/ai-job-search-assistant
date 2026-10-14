import { useEffect, useState, type FormEvent } from "react";
import { createResume, deleteResume, listResumes } from "../api/client";
import { ErrorMessage, Loading } from "../components/StateMessage";
import type { Resume } from "../api/types";

export function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[] | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<unknown>(null);

  const refresh = () => {
    listResumes()
      .then(setResumes)
      .catch(setError);
  };

  useEffect(refresh, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      await createResume({ name, content });
      setName("");
      setContent("");
      refresh();
    } catch (err) {
      setFormError(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this resume?")) return;
    await deleteResume(id);
    refresh();
  };

  return (
    <div className="page">
      <h1>Resumes</h1>

      <form className="card form" onSubmit={handleSubmit}>
        <h2>Add a resume</h2>
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Main" required />
        </label>
        <label>
          Content
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste the full resume text…"
            rows={8}
            required
          />
        </label>
        {formError ? <ErrorMessage error={formError} /> : null}
        <button type="submit" disabled={submitting}>
          {submitting ? "Saving…" : "Save resume"}
        </button>
      </form>

      <div className="card">
        <h2>Saved resumes</h2>
        {error ? <ErrorMessage error={error} /> : null}
        {!resumes && !error ? <Loading /> : null}
        {resumes?.length === 0 ? <p className="state-message">No resumes yet — add one above.</p> : null}
        <ul className="list">
          {resumes?.map((resume) => (
            <li key={resume._id} className="list-item">
              <div>
                <strong>{resume.name}</strong>
                <p className="muted">{resume.content.slice(0, 140)}…</p>
              </div>
              <button className="btn-secondary" onClick={() => handleDelete(resume._id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
