import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listApplications } from "../api/client";
import { ErrorMessage, Loading } from "../components/StateMessage";
import { StatusBadge } from "../components/StatusBadge";
import { APPLICATION_STATUSES, type Application, type ApplicationStatus } from "../api/types";

export function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[] | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [status, setStatus] = useState<ApplicationStatus | "">("");

  useEffect(() => {
    setApplications(null);
    listApplications(status || undefined)
      .then(setApplications)
      .catch(setError);
  }, [status]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Applications</h1>
        <label className="filter">
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value as ApplicationStatus | "")}>
            <option value="">All</option>
            {APPLICATION_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error ? <ErrorMessage error={error} /> : null}
      {!applications && !error ? <Loading /> : null}
      {applications?.length === 0 ? (
        <p className="state-message">
          No applications yet — <Link to="/analyze">analyze a job posting</Link> to create one.
        </p>
      ) : null}

      <ul className="list">
        {applications?.map((app) => (
          <li key={app._id} className="list-item">
            <Link to={`/applications/${app._id}`} className="list-item-main">
              <strong>
                {app.title} · {app.company}
              </strong>
              <p className="muted">Fit score: {app.fit.score}/100</p>
            </Link>
            <StatusBadge status={app.status} />
          </li>
        ))}
      </ul>
    </div>
  );
}
