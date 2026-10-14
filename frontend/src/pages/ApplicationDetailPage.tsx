import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteApplication, getApplication, updateApplication } from "../api/client";
import { ErrorMessage, Loading } from "../components/StateMessage";
import { StatusBadge } from "../components/StatusBadge";
import { APPLICATION_STATUSES, type Application, type ApplicationStatus } from "../api/types";

export function ApplicationDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState<Application | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<unknown>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getApplication(id).then(setApplication).catch(setError);
  }, [id]);

  const handleStatusChange = async (status: ApplicationStatus) => {
    setSaving(true);
    setSaveError(null);
    try {
      setApplication(await updateApplication(id, { status }));
    } catch (err) {
      setSaveError(err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddNote = async (e: FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    setSaving(true);
    setSaveError(null);
    try {
      setApplication(await updateApplication(id, { note }));
      setNote("");
    } catch (err) {
      setSaveError(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this application?")) return;
    await deleteApplication(id);
    navigate("/applications");
  };

  const copyCoverNote = () => {
    if (!application) return;
    navigator.clipboard.writeText(application.coverNote);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (error) {
    return (
      <div className="page">
        <ErrorMessage error={error} />
        <Link to="/applications">Back to applications</Link>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="page">
        <Loading />
      </div>
    );
  }

  return (
    <div className="page">
      <Link to="/applications" className="back-link">
        ← All applications
      </Link>

      <div className="page-header">
        <h1>
          {application.title} · {application.company}
        </h1>
        <StatusBadge status={application.status} />
      </div>

      <div className="card">
        <h2>Fit — {application.fit.score}/100</h2>
        <p>{application.fit.summary}</p>
        <div className="fit-columns">
          <div>
            <h3>Matched</h3>
            <ul>
              {application.fit.matchedRequirements.map((req) => (
                <li key={req}>{req}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Gaps</h3>
            <ul>
              {application.fit.gaps.map((gap) => (
                <li key={gap}>{gap}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Tailored bullets</h2>
        {application.tailoredBullets.map((bullet, i) => (
          <div key={i} className="bullet">
            <p className="bullet-original">{bullet.original}</p>
            <p className="bullet-tailored">{bullet.tailored}</p>
            <p className="muted">{bullet.rationale}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Cover note</h2>
          <button className="btn-secondary" onClick={copyCoverNote}>
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <p className="cover-note">{application.coverNote}</p>
      </div>

      <div className="card">
        <h2>Status</h2>
        <div className="status-actions">
          {APPLICATION_STATUSES.map((s) => (
            <button
              key={s}
              className={s === application.status ? "btn-status btn-status-active" : "btn-status"}
              disabled={saving || s === application.status}
              onClick={() => handleStatusChange(s)}
            >
              {s}
            </button>
          ))}
        </div>
        {saveError ? <ErrorMessage error={saveError} /> : null}
      </div>

      <div className="card">
        <h2>Notes</h2>
        <ul className="notes">
          {application.notes.map((n, i) => (
            <li key={i}>
              <span className="muted">{new Date(n.at).toLocaleString()}</span> — {n.text}
            </li>
          ))}
        </ul>
        <form className="form-inline" onSubmit={handleAddNote}>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note, e.g. interview scheduled Friday"
          />
          <button type="submit" disabled={saving}>
            Add
          </button>
        </form>
      </div>

      <button className="btn-danger" onClick={handleDelete}>
        Delete application
      </button>
    </div>
  );
}
