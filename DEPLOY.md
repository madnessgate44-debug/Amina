# Deploying Miss Noor

Miss Noor is a Node app (Express + Vite). It serves the built frontend from
`dist/` and the AI routes from `server.ts`. It runs **without** a `GEMINI_API_KEY`
in a truthful degraded mode: lessons, curriculum, mastery, saving and the whole
learner flow work; only the live AI text is replaced by local fallbacks.

## Option A — Render (recommended, one click from the repo)

The repo already contains `render.yaml`, a Render Blueprint.

1. Sign in to <https://dashboard.render.com>.
2. **New → Blueprint**.
3. Connect the GitHub repository `madnessgate44-debug/Amina` and pick the `main`
   branch. Render reads `render.yaml` and shows one web service named `amina`.
4. When prompted for environment variables, set:
   - `GEMINI_API_KEY` — your Google AI Studio key (optional; leave blank to run in
     degraded mode).
   - `GEMINI_MODEL` — optional, e.g. `gemini-2.0-flash`.
5. **Apply**. The first build takes a few minutes.
6. Copy the service URL (for example `https://amina.onrender.com`).

Health check: `GET /api/health` returns `{"status":"ok",...}`.

### Make the URL official
Set the repository variable so the keep-warm workflow and smoke test know where
the app lives:

```bash
gh variable set APP_URL --body "https://amina.onrender.com"
```

### Keep it warm
`.github/workflows/keep-warm.yml` pings `/api/health` every 10 minutes. On the
Render free plan the app sleeps after ~15 minutes idle, so the first click can
still take 30–60 seconds; the app shows a "Miss Noor is waking up…" splash
during that time.

## Option B — Docker

```bash
docker build -t miss-noor .
docker run -p 3000:3000 -e GEMINI_API_KEY=... miss-noor
# open http://localhost:3000
```

Without `-e GEMINI_API_KEY` the container still runs in degraded mode.

## Option C — local

```bash
npm ci --legacy-peer-deps
npm run build
PORT=3000 npm start
# open http://localhost:3000
```

## Verifying a deploy

```bash
node scripts/smoke.mjs https://amina.onrender.com
```

This checks the shell, every asset referenced by `index.html`, `/api/health`,
and that the AI routes answer gracefully without a key. It exits non-zero on a
hard failure, so it can gate a deploy.

## Notes

- **Do not** deploy GitHub Pages as the main app. `deploy-pages.yml` is manual
  only and serves static files; the AI routes need `server.ts` (see the comment
  at the top of that workflow).
- The owner's printed books are never committed and never served from a route.
  Book import is client-side only; see `docs/SOURCES.md`.
