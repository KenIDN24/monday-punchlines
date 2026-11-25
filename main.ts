// Monday Morning Punchlines — entry program.
// Writes one joke about Monday mornings to /output/entry.txt.
// Sealed gate: UTF-8 text of 1 to 200 characters, not only whitespace.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  'My Monday planner is color-coded: red for urgent, blue for meetings, and a special black page for the 9:04 AM email that just says "per my last email."';

const MAX_CHARS = 200;

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

// Guard: one line, 1-200 characters, not only whitespace.
const chars = [...LINE].length;
if (chars < 1 || chars > MAX_CHARS) {
  fail(`entry is ${chars} chars, outside the 1-${MAX_CHARS} limit`);
}
if (LINE.trim().length === 0) {
  fail("entry is only whitespace");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  fail("entry must be a single line");
}
// Reject control characters (except none are allowed in the entry text).
for (const ch of LINE) {
  const code = ch.codePointAt(0) ?? 0;
  if (code < 0x20 || code === 0x7f) {
    fail(`entry contains a control character U+${code.toString(16).padStart(4, "0")}`);
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE + "\n", "utf8");
// Read-back check: what landed on disk must be exactly the entry text.
const written = readFileSync(outPath, "utf8");
if (written !== LINE + "\n") {
  fail("read-back mismatch: entry.txt does not match the entry text");
}
console.log(`wrote ${chars} chars`);
