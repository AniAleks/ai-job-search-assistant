# AI Job Search Assistant

Paste a job posting and the assistant will:

- **Score your fit** for the role, listing the requirements you match and the gaps
- **Tailor your resume bullets** to the posting, without inventing experience
- **Write a short cover note** for the specific company and role
- **Track the application** through `saved → applied → interviewing → offer / rejected / withdrawn`

There is also a chat endpoint where you can ask about your applications or update them in plain language ("I got an interview at Acme on Friday").

**Stack:** NestJS 12, MongoDB (Mongoose), the Claude API (structured outputs and tool use) and TypeScript. It ships as a Docker image, ready to deploy on AWS.

## How it uses Claude

| Feature | Endpoint | Claude feature |
|---|---|---|
| Fit score, tailored bullets, cover note | `POST /analyses` | **Structured outputs.** One call returns JSON that is validated against a Zod schema (`src/analysis/job-analysis.schema.ts`). |
| Chat over your applications | `POST /assistant` | **Tool use.** The SDK tool runner lets Claude call `list_applications`, `get_application` and `update_application` (`src/assistant/application-tools.ts`). |

Both endpoints use `claude-opus-5-5` by default (override with `CLAUDE_MODEL`). They also turn on server-side refusal fallbacks, and they return 422 or 502 when Claude refuses or its output is unusable.

## Getting started

```bash
cp .env.example .env          # then set ANTHROPIC_API_KEY
docker run -d -p 27017:27017 mongo:8   # or point MONGODB_URI at Atlas / DocumentDB
npm install
npm run dev                   # http://localhost:3000
```

Other scripts:

| Script | What it does |
|---|---|
| `npm run build` | Compile to `dist/` |
| `npm start` | Run the compiled app |
| `npm test` | Run the tests (see below) |
| `npm run typecheck` | Type-check without building |

The tests mock Claude, so they never call the real API. The end-to-end test uses `MONGODB_TEST_URI` if it is set, and otherwise downloads and starts an in-memory MongoDB.

## API

```bash
# 1. Save your resume (plain text)
curl -X POST localhost:3000/resumes -H 'content-type: application/json' \
  -d '{"name": "Main", "content": "..."}'

# 2. Analyse a posting: scores fit, tailors bullets, writes a cover note, starts tracking it
curl -X POST localhost:3000/analyses -H 'content-type: application/json' \
  -d '{"resumeId": "<id>", "jobPosting": "..."}'

# 3. Track progress
curl localhost:3000/applications?status=saved
curl -X PATCH localhost:3000/applications/<id> -H 'content-type: application/json' \
  -d '{"status": "applied", "note": "Referred by Sam"}'

# 4. Or just ask
curl -X POST localhost:3000/assistant -H 'content-type: application/json' \
  -d '{"message": "Which applications am I still waiting to hear back on?"}'
```

| Method | Path | Purpose |
|---|---|---|
| `POST` / `GET` | `/resumes` | Create / list resumes |
| `GET` / `DELETE` | `/resumes/:id` | Get / delete a resume |
| `POST` | `/analyses` | Analyse a posting against a resume and create an application |
| `GET` | `/applications?status=` | List applications |
| `GET` / `PATCH` / `DELETE` | `/applications/:id` | Get / update (status, note) / delete an application |
| `POST` | `/assistant` | Chat with the tool-using assistant |
| `GET` | `/health` | Health check |

## Project layout

```
src/
  analysis/      Fit scoring, tailored bullets, cover note (structured outputs)
  assistant/     Chat assistant with tracker tools (tool use)
  applications/  Application tracker (Mongo)
  resumes/       Resume storage (Mongo)
  claude/        Anthropic client and model configuration
  common/        Validation pipes, Claude error mapping
```
