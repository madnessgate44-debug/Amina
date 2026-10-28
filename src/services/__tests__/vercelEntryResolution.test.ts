/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Regression test for the Vercel serverless entry.
 *
 * Vercel transpiles each file separately and runs it as an ES module, so every
 * relative import specifier must carry its final `.js` extension. An extensionless
 * `from '../server'` passes the build but throws ERR_MODULE_NOT_FOUND on the first
 * request, which is why the whole API (including /api/tts) returned nothing while
 * the deployment still showed green.
 *
 * This test does not string-match. It emits the real module graph the way Vercel
 * does, then asks Node to load the entry, and fails if resolution breaks anywhere
 * in the chain. It also walks the chain statically so a new extensionless import
 * anywhere on the server path is caught.
 */

import assert from 'node:assert';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { buildSync } from 'esbuild';

const repoRoot = path.resolve(new URL('../../..', import.meta.url).pathname);

let passed = 0;
const test = (name: string, fn: () => void) => {
  try {
    fn();
    passed++;
    console.log(`✅ [PASS] ${name}`);
  } catch (e: any) {
    console.error(`❌ [FAIL] ${name}: ${e.message}`);
    process.exitCode = 1;
  }
};

/** Every relative import specifier in a file, in source order. */
const relativeImports = (file: string): string[] => {
  const src = readFileSync(path.join(repoRoot, file), 'utf8');
  return [...src.matchAll(/from\s+['"](\.[^'"]*)['"]/g)].map((m) => m[1]);
};

/** `../server.js` -> `server.ts`; the source file the emitted specifier points at. */
const sourceFor = (specifier: string, fromFile: string): string => {
  const withoutExt = specifier.replace(/\.js$/, '');
  const base = path.resolve(path.dirname(path.join(repoRoot, fromFile)), withoutExt);
  return `${base}.ts`;
};

/** Every .ts file reachable from the server entry by relative imports. */
const serverChain = (): string[] => {
  const seen = new Set<string>();
  const queue = ['api/index.ts'];
  while (queue.length) {
    const file = queue.shift()!;
    if (seen.has(file)) continue;
    seen.add(file);
    for (const spec of relativeImports(file)) {
      const target = path.relative(repoRoot, sourceFor(spec, file));
      if (!seen.has(target)) queue.push(target);
    }
  }
  return [...seen];
};

test('1.1 every relative import on the server path ends in .js', () => {
  const offenders: string[] = [];
  for (const file of serverChain()) {
    for (const spec of relativeImports(file)) {
      if (!spec.endsWith('.js')) offenders.push(`${file} -> ${spec}`);
    }
  }
  assert.deepStrictEqual(
    offenders,
    [],
    `extensionless imports break Node ESM on Vercel: ${offenders.join(', ')}`
  );
});

test('1.2 each .js specifier points at a real .ts source file', () => {
  for (const file of serverChain()) {
    for (const spec of relativeImports(file)) {
      const target = sourceFor(spec, file);
      assert.ok(existsSync(target), `${file} imports ${spec} but ${target} does not exist`);
    }
  }
});

test('1.3 the server chain reaches no further extensionless imports', () => {
  // Superseded by 1.1/1.2, which now walk the whole chain transitively. Kept as
  // an explicit assertion on the leaf the original failure was reported against.
  const leaf = 'src/services/i18n/serverTutorVoice.ts';
  assert.ok(existsSync(path.join(repoRoot, leaf)), `${leaf} is missing`);
  for (const spec of relativeImports(leaf)) {
    assert.ok(spec.endsWith('.js'), `${leaf} -> ${spec} is extensionless`);
  }
});

test('2.1 Node can actually load the emitted Vercel entry', () => {
  // Emit the graph exactly the way Vercel does: one file at a time, ESM, no bundling.
  const outDir = mkdtempSync(path.join(repoRoot, '.tmp-vercel-entry-'));
  try {
    buildSync({
      entryPoints: serverChain().map((f) => path.join(repoRoot, f)),
      outdir: outDir,
      outbase: repoRoot,
      platform: 'node',
      format: 'esm',
      target: 'node20',
      bundle: false,
      logLevel: 'silent',
    });

    // Node needs to treat the emitted .js files as ESM and resolve bare packages
    // (express, @google/genai) from the repo's node_modules.
    writeFileSync(path.join(outDir, 'package.json'), '{"type":"module"}');
    symlinkSync(path.join(repoRoot, 'node_modules'), path.join(outDir, 'node_modules'), 'dir');

    const entry = path.join(outDir, 'api/index.js');
    assert.ok(existsSync(entry), 'esbuild did not emit api/index.js');

    // VERCEL=1 keeps server.ts from opening a listening socket during the test.
    const script = `import app from ${JSON.stringify(entry)}; console.log('RESOLVED:' + typeof app);`;
    const out = execFileSync(process.execPath, ['--input-type=module', '-e', script], {
      env: { ...process.env, VERCEL: '1' },
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 60_000,
    });
    assert.ok(out.includes('RESOLVED:function'), `entry did not export the app: ${out}`);
  } finally {
    rmSync(outDir, { recursive: true, force: true });
  }
});

console.log(`\nVERCEL ENTRY RESOLUTION SUITE SUMMARY: ${passed} PASSED, ${process.exitCode ? '1+' : 0} FAILED`);
if (process.exitCode) process.exit(1);
