# Deploying Miss Noor

Miss Noor is a Node app (Express + Vite). It serves the built frontend from
`dist/` and the AI routes from `server.ts`. It runs **without** a `GEMINI_API_KEY`
in a truthful degraded mode: lessons, curriculum, mastery, saving and the whole
learner flow work; only the live AI text is replaced by local fallbacks.

**Production target: a free Hugging Face Docker Space.** There is no GitHub
Action that deploys, and no deploy token is stored in this repository.

## Hugging Face Space (the supported target)

- Space: `miss-noor` — SDK **Docker**, hardware **CPU basic (free)**, **public**.
- Live URL: `https://<username>-miss-noor.hf.space`
- The Space listens on **7860** (`app_port` in the Space README frontmatter).
- The container runs as **UID 1000** (`node`), which the base image already provides.

### Why a Space instead of a static host

The app's AI routes need `server.ts`. A static host cannot run them, so GitHub
Pages is not a valid production target — `deploy-pages.yml` is manual-only and
exists for previews of the built client only.

### Environment variables

Set these in the Space settings (**Settings → Variables and secrets**), never in
this repository:

| Name | Required | Notes |
|---|---|---|
| `GEMINI_API_KEY` | No | Without it the app degrades gracefully. Add it to enable live AI text. |
| `GEMINI_MODEL` | No | Defaults to the model named in `server.ts`. |

### Deploying a build

Deployment is a push of a **staged copy** to the Space. The staging copy differs
from the repository in exactly one file: it carries a Space `README.md` with
YAML frontmatter (`sdk: docker`, `app_port: 7860`, `title: Miss Noor`). The
repository's own files are never modified by staging.

```bash
# 1. Authenticate once (device flow; prints a URL and a code)
hf auth login

# 2. Stage and push
node scripts/deploy-space.mjs --user <username>
```

`scripts/deploy-space.mjs` builds the staging directory under `.space-stage/`
(git-ignored), writes the Space README, and pushes to
`https://huggingface.co/spaces/<username>/miss-noor`. It reads the token from the
`hf` CLI's own credential store, so no token is ever printed, logged, or written
into this repository.

**Run it after every merge to `main`.** There is deliberately no GitHub Action
doing this: a deploy token would have to live in GitHub.

### Verifying a deploy

```bash
node scripts/smoke.mjs https://<username>-miss-noor.hf.space
```

This checks the shell, every asset referenced by `index.html`, `/api/health`,
and that the AI routes answer gracefully without a key. It exits non-zero on a
hard failure, so it can gate a deploy. If the live URL is red after a merge,
revert the merge.

### Cold starts

A free Space sleeps when idle, so the first request can take 30–60 seconds.
`index.html` shows a "Miss Noor is waking up…" splash until React mounts.
`.github/workflows/keep-warm.yml` pings `/api/health` every 10 minutes to reduce
how often that happens; set the repository variable it reads:

```bash
gh variable set APP_URL --body "https://<username>-miss-noor.hf.space"
```

## Docker (any other host)

The same image runs anywhere. The server binds `0.0.0.0` and reads `PORT`, so
override the Space default of 7860 freely.

```bash
docker build -t miss-noor .
docker run -p 3000:3000 -e GEMINI_API_KEY=... miss-noor
# open http://localhost:3000
```

Without `-e GEMINI_API_KEY` the container still runs in degraded mode.

## Local

```bash
npm ci --legacy-peer-deps
npm run build
PORT=3000 npm start
# open http://localhost:3000
```

## Notes

- The owner's printed books are never committed and never served from a route.
  Book import is client-side only; see `docs/SOURCES.md`.
