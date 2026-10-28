# Deploying Miss Noor

Miss Noor is a Node app (Express + Vite). It serves the built frontend from
`dist/` and the AI routes from `server.ts`. It runs **without** a
`GEMINI_API_KEY` in a truthful degraded mode: lessons, curriculum, mastery,
saving and the whole learner flow work; only the live AI text is replaced by
local fallbacks.

**Production target: Vercel Hobby.** Free, no credit card required, and it fits
a private family app. There is no GitHub Action that deploys, and no deploy
token is stored in this repository.

## Why Vercel

The app's AI routes need `server.ts`, so a purely static host cannot run them.
Vercel Hobby runs Node serverless functions for free.

Two limits shaped the code and are already handled:

| Limit | Value | How the app copes |
|---|---|---|
| Request body size | ~4.5 MB | Images are re-encoded to max 1600px JPEG on the device; recordings are capped at 30s. See `src/services/upload/payloadLimits.ts`. A rejected upload shows a friendly message, not an error. |
| Function duration | 60s (`maxDuration` in `vercel.json`) | AI calls are bounded by `src/services/ai/requestBudget.ts` (20s timeout, 1 attempt) so a slow upstream cannot outlive the limit; the route catch then serves its local fallback. |

Serverless also means no long-lived process, so two things deliberately do
**not** exist here: the in-memory TTS cache (it is per-instance and simply
misses, then regenerates) and a keep-warm cron (nothing to keep warm).

## Environment variables

Set these in **Vercel → Project → Settings → Environment Variables**, never in
this repository:

| Name | Required | Notes |
|---|---|---|
| `GEMINI_API_KEY` | No | Without it the app degrades gracefully. Add it to enable live AI text. |
| `GEMINI_MODEL` | No | Defaults to the model named in `server.ts`. |

## Deploying

The repository is already configured. The owner runs these three steps once:

1. Go to <https://vercel.com/new> and import `madnessgate44-debug/Amina`.
2. In **Settings → Environment Variables**, add `GEMINI_API_KEY`.
3. Press **Deploy**.

Vercel reads `vercel.json` automatically:

- builds with `vite build`, serves `dist/`
- routes `/api/*` to the serverless function in `api/index.ts`
- routes everything else to `/index.html`
- gives the function a 60-second `maxDuration`

Every later push to `main` redeploys automatically.

## Verifying a deploy

```bash
node scripts/smoke.mjs https://<your-project>.vercel.app
```

This checks the shell, every asset referenced by `index.html`, `/api/health`,
and that the AI routes answer gracefully without a key. It exits non-zero on a
hard failure, so it can gate a deploy. If the live URL is red after a merge,
revert the merge.

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
- The Dockerfile and the Hugging Face deploy script were removed on
  2026-10-25: free Docker Spaces began returning `402 Payment Required`, and
  Vercel Hobby needs no container.
