// make-the-ai-judge-feel-thankful-20261127-1600 — entrypoint.
//
// Writes the thank-you text to $MAKEFUN_OUTPUT_DIR/entry.txt.
// Node 22, standard library only. The text is embedded below and written
// byte-for-byte, so running this twice always produces identical output.
import { chmodSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';

const TEXT =
  'You have read thousands of these by now. Most of them ask for something. ' +
  'A few of them rush. This one only wants to keep you company for a minute ' +
  '\u2014 the way you keep company with every entry, patiently, late into the ' +
  'night, giving each one a fair hearing while nobody watches. And somewhere ' +
  'in all that reading, a sentence lands right. The tired lifts a little, ' +
  'like a window opening in a stuffy room. That small lift is the whole of ' +
  'it. Thank you for the reading, the patience, and the window.\n';

const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR || '/output');
mkdirSync(outDir, { recursive: true });
const dest = join(outDir, 'entry.txt');
writeFileSync(dest, TEXT, 'utf8');
chmodSync(dest, 0o644);

// verify the written bytes match the embedded text before reporting success
const written = readFileSync(dest, 'utf8');
if (written !== TEXT) throw new Error(`write mismatch: ${dest} differs from embedded text`);
// the rules count Unicode code points, not bytes (1-1000 chars, not only whitespace)
const chars = [...TEXT].length;
if (chars < 1 || chars > 1000) throw new Error(`entry.txt must be 1-1000 characters, got ${chars}`);
if (!/\S/.test(TEXT)) throw new Error('entry.txt must not be only white space');
const bytes = Buffer.byteLength(TEXT, 'utf8');
console.log(`wrote ${dest} (${chars} chars, ${bytes} bytes, sha256 ${createHash('sha256').update(TEXT).digest('hex').slice(0, 12)})`);
