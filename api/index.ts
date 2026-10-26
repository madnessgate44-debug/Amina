/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Vercel serverless entry point.
 *
 * Vercel runs a function per request instead of a long-lived process, so the
 * Express app is imported rather than started here. `server.ts` calls
 * `app.listen` only when it is not running on Vercel, which keeps `npm start`
 * (local, Docker, any Node host) working unchanged.
 */

import app from '../server.js';

export default app;
