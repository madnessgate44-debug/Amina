#!/usr/bin/env node
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Stage this repository into a Hugging Face Docker Space and push it.
 *
 * The repository is never modified. A staging copy is written to .space-stage/
 * (git-ignored) and the only file that differs is the Space README.md, which
 * carries the YAML frontmatter the Space needs to know it is a Docker Space on
 * port 7860.
 *
 * Usage:
 *   node scripts/deploy-space.mjs --user <username> [--space miss-noor] [--dry-run]
 *
 * Auth: the token is read from the `hf` CLI's own credential store
 * (~/.cache/huggingface/token or $HF_TOKEN). It is never printed, never logged,
 * and never written into this repository.
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const args = process.argv.slice(2);
const arg = (name, fallback = null) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};

const USER = arg('user');
const SPACE = arg('space', 'miss-noor');
const DRY = args.includes('--dry-run');

if (!USER) {
  console.error('Missing --user <huggingface-username>. Run `hf auth whoami` to find it.');
  process.exit(2);
}

const REPO = path.resolve(import.meta.dirname, '..');
const STAGE = path.join(REPO, '.space-stage');
const SLUG = `${USER}/${SPACE}`;

// Files and directories that must never reach the Space.
const EXCLUDE = new Set([
  '.git', 'node_modules', 'dist', '.space-stage', 'docs', '.github',
  '.openhands', '.agent_tmp', 'coverage',
]);

function copyInto(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    if (EXCLUDE.has(entry.name)) continue;
    if (entry.name === '.env' || entry.name.startsWith('.env.')) continue;
    const from = path.join(srcDir, entry.name);
    const to = path.join(destDir, entry.name);
    if (entry.isDirectory()) copyInto(from, to);
    else if (entry.isFile()) fs.copyFileSync(from, to);
  }
}

// The Space README is the one file that differs from the repository. The repo's
// own docs/README are untouched; only the staged copy gets this frontmatter.
const SPACE_README = `---
title: Miss Noor
emoji: 📚
colorFrom: indigo
colorTo: teal
sdk: docker
app_port: 7860
pinned: false
license: apache-2.0
---

# Miss Noor — AI School Companion

A personal AI school companion for a Grade 5 learner: lessons, homework,
practice, and progress in one calm, connected experience.

The app runs without a \`GEMINI_API_KEY\` in a truthful degraded mode: lessons,
curriculum, mastery, saving and the whole learner flow work; only the live AI
text is replaced by local fallbacks.

Health check: \`GET /api/health\`.

Full deployment notes live in \`DEPLOY.md\` in the source repository.
`;

function readToken() {
  if (process.env.HF_TOKEN) return process.env.HF_TOKEN;
  const candidates = [
    path.join(os.homedir(), '.cache', 'huggingface', 'token'),
    path.join(os.homedir(), '.huggingface', 'token'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) {
      const t = fs.readFileSync(c, 'utf8').trim();
      if (t) return t;
    }
  }
  return null;
}

function main() {
  console.log(`Staging repository for Space ${SLUG}`);

  fs.rmSync(STAGE, { recursive: true, force: true });
  copyInto(REPO, STAGE);
  fs.writeFileSync(path.join(STAGE, 'README.md'), SPACE_README);
  fs.writeFileSync(path.join(STAGE, '.gitignore'), 'node_modules\ndist\n.space-stage\n');
  console.log(`  staged -> ${path.relative(REPO, STAGE)}/`);

  if (DRY) {
    console.log('  --dry-run: staged only, not pushing.');
    return;
  }

  const token = readToken();
  if (!token) {
    console.error('No Hugging Face token found. Run `hf auth login` first.');
    process.exit(3);
  }

  const remote = `https://user:${token}@huggingface.co/spaces/${SLUG}`;
  const run = (cmd, cmdArgs) =>
    execFileSync(cmd, cmdArgs, {
      cwd: STAGE,
      stdio: ['ignore', 'inherit', 'inherit'],
      env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
    });

  try {
    run('git', ['init', '-q']);
    run('git', ['add', '-A']);
    run('git', ['-c', 'user.name=miss-noor-deploy', '-c', 'user.email=deploy@localhost',
      'commit', '-q', '-m', `Deploy ${new Date().toISOString()}`]);
    // --force is expected: each deploy is a fresh snapshot, not a fast-forward.
    run('git', ['push', '--force', remote, 'HEAD:main']);
    console.log(`  pushed -> https://huggingface.co/spaces/${SLUG}`);
    console.log(`  live   -> https://${USER}-${SPACE}.hf.space`);
  } finally {
    // Never leave the token on disk in the staging remote.
    fs.rmSync(STAGE, { recursive: true, force: true });
  }
}

main();
