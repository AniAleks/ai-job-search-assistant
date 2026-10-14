# Job Search Assistant — Frontend

React (Vite + TypeScript) UI for the API in the repo root.

```bash
cp .env.example .env   # VITE_API_BASE_URL, defaults to http://localhost:3000
npm install
npm run dev             # http://localhost:5173
```

| Page | Route | Purpose |
|---|---|---|
| Resumes | `/` | Save and delete resumes |
| Analyze | `/analyze` | Pick a resume, paste a posting, run the analysis |
| Applications | `/applications` | List and filter tracked applications |
| Application detail | `/applications/:id` | Fit, tailored bullets, cover note, status, notes |
| Assistant | `/assistant` | Chat with the tool-using assistant |

Other scripts: `npm run build` (typecheck + production build), `npm run lint` (oxlint), `npm run preview`.
