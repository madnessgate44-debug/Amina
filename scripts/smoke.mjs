#!/usr/bin/env node
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Deployment smoke test for Miss Noor.
 *
 * Usage:  node scripts/smoke.mjs [baseUrl]
 *         npm run smoke -- https://amina.onrender.com
 *
 * Checks, in order:
 *   1. GET /                        -> 200 and an HTML shell
 *   2. every script/css asset referenced by index.html -> 200
 *   3. GET /api/health              -> 200 with status "ok"
 *   4. AI routes without a key      -> graceful degraded response (not a 500)
 *
 * Exits non-zero on the first hard failure so CI or a human can gate a deploy.
 * No dependencies: uses global fetch (Node 18+).
 */

const BASE = (process.argv[2] || process.env.SMOKE_BASE || 'http://127.0.0.1:12000').replace(/\/$/, '');

let passed = 0;
let failed = 0;

function ok(msg) {
  console.log(`✅ ${msg}`);
  passed++;
}
function bad(msg) {
  console.error(`❌ ${msg}`);
  failed++;
}

async function get(path, expectJson = false) {
  const url = BASE + path;
  try {
    const res = await fetch(url, { redirect: 'follow' });
    let body = '';
    if (expectJson) {
      body = await res.text();
    }
    return { status: res.status, body, url };
  } catch (e) {
    return { status: 0, body: '', url, error: e.message };
  }
}

async function main() {
  console.log(`Smoke test against ${BASE}\n`);

  // 1. Shell
  const root = await get('/');
  if (root.status === 200) {
    ok(`GET / -> 200`);
  } else {
    bad(`GET / -> ${root.status || root.error}`);
    console.log('\nAborting: the app shell is not reachable.');
    process.exit(1);
  }

  // 2. Assets referenced by index.html
  let html = '';
  try {
    html = await (await fetch(BASE + '/')).text();
  } catch (e) {
    bad(`could not read index.html body: ${e.message}`);
  }
  const assetPaths = new Set();
  for (const m of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const p = m[1];
    if (/^https?:\/\//.test(p) || p.startsWith('data:') || p.startsWith('#')) continue;
    if (/\.(js|mjs|css)(\?|$)/.test(p)) assetPaths.add(p.startsWith('/') ? p : '/' + p);
  }
  if (assetPaths.size === 0) {
    bad('index.html references no script/css assets (build may be broken)');
  } else {
    for (const p of assetPaths) {
      const r = await get(p);
      if (r.status === 200) ok(`asset ${p} -> 200`);
      else bad(`asset ${p} -> ${r.status || r.error}`);
    }
  }

  // 3. Health
  const health = await get('/api/health', true);
  if (health.status === 200) {
    let parsed = null;
    try {
      parsed = JSON.parse(health.body);
    } catch {
      /* handled below */
    }
    if (parsed && parsed.status === 'ok') {
      ok(`GET /api/health -> 200 status=ok (hasApiKey=${parsed.hasApiKey})`);
    } else {
      bad(`GET /api/health -> 200 but unexpected body: ${health.body.slice(0, 120)}`);
    }
  } else {
    bad(`GET /api/health -> ${health.status || health.error}`);
  }

  // 4. AI routes degrade gracefully without a key (never a 500).
  //    These are the real POST routes. With no GEMINI_API_KEY they must return
  //    a truthful local fallback, not an error.
  const aiProbes = [
    { path: '/api/chat', body: { message: 'hello' } },
    { path: '/api/tutor-explain', body: { lessonId: 'x', question: 'hello' } },
    { path: '/api/tutor-reply', body: { text: 'hello' } },
  ];
  for (const probe of aiProbes) {
    try {
      const res = await fetch(BASE + probe.path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(probe.body),
      });
      const text = await res.text();
      if (res.status >= 500) {
        bad(`POST ${probe.path} -> ${res.status} (degraded mode must not 500)`);
      } else if (res.status === 200) {
        let degraded = null;
        try {
          const j = JSON.parse(text);
          degraded = j.degraded === true || j.source === 'local_companion_fallback';
        } catch {
          /* non-JSON 200 is still a live response */
        }
        ok(`POST ${probe.path} -> 200${degraded ? ' (degraded fallback)' : ''}`);
      } else {
        ok(`POST ${probe.path} -> ${res.status} (route mounted, no server error)`);
      }
    } catch (e) {
      bad(`POST ${probe.path} -> no response (${e.message})`);
    }
  }

  console.log(`\n=== SMOKE SUMMARY: ${passed} passed, ${failed} failed ===`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
