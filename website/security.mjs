import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const csp = "default-src 'none'; img-src 'self'; style-src 'self' https://fonts.googleapis.com; style-src-attr 'unsafe-inline'; script-src 'self'; connect-src 'none'; font-src https://fonts.gstatic.com; base-uri 'none'; form-action 'none'; frame-ancestors 'none'";
export const vercel = {
  buildCommand: 'node website/build.mjs && node website/check.mjs',
  outputDirectory: 'website/dist',
  headers: [{ source: '/(.*)', headers: [
    { key: 'Content-Security-Policy', value: csp },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
  ] }]
};
const path = fileURLToPath(new URL('../vercel.json', import.meta.url));
const expected = `${JSON.stringify(vercel, null, 2)}\n`;
if (process.argv.includes('--write')) writeFileSync(path, expected);
if (process.argv.includes('--check') && readFileSync(path, 'utf8') !== expected) throw Error('vercel.json differs from website/security.mjs');
