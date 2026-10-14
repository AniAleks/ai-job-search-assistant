import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { analyzeJob, listResumes } from "../api/client";
import { ErrorMessage, Loading } from "../components/StateMessage";
import type { Resume } from "../api/types";

export function AnalyzePage() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[] | null>(null);
  const [resumesError, setResumesError] = useState<unknown>(null);
  const [resumeId, setResumeId] = useState("");
  const [jobPosting, setJobPosting] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    listResumes()
      .then((data) => {
        setResumes(data);
        if (data.length > 0) setResumeId(data[0]._id);
      })
      .catch(setResumesError);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const application = await analyzeJob({ resumeId, jobPosting });
      navigate(`/applications/${application._id}`);
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (resumesError) {
    return (
      <div className="page">
        <h1>Analyze a job posting</h1>
        <ErrorMessage error={resumesError} />
      </div>
    );
  }

  if (!resumes) {
    return (
      <div className="page">
        <h1>Analyze a job posting</h1>
        <Loading />
      </div>
    );
  }

  if (resumes.length === 0) {
    return (
      <div className="page">
        <h1>Analyze a job posting</h1>
        <p className="state-message">You need to add a resume first.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Analyze a job posting</h1>
      <form className="card form" onSubmit={handleSubmit}>
        <label>
          Resume
          <select value={resumeId} onChange={(e) => setResumeId(e.target.value)}>
            {resumes.map((resume) => (
              <option key={resume._id} value={resume._id}>
                {resume.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Job posting
          <textarea
            value={jobPosting}
            onChange={(e) => setJobPosting(e.target.value)}
            placeholder="Paste the full job posting…"
            rows={12}
            required
            minLength={100}
          />
        </label>
        {error ? <ErrorMessage error={error} /> : null}
        <button type="submit" disabled={submitting}>
          {submitting ? "Analyzing…" : "Analyze"}
        </button>
        {submitting ? <p className="muted">This calls Claude and usually takes a few seconds.</p> : null}
      </form>
    </div>
  );
}
