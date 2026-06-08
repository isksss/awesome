import fs from "node:fs";
import path from "node:path";
import { listMarkdownFiles, rootDir } from "./lib.mjs";

const files = [
  "README.md",
  "docs/review-policy.md",
  ...listMarkdownFiles().map((file) => path.relative(rootDir, file)),
].filter((file) => fs.existsSync(path.join(rootDir, file)));

const errors = [];
const linkPattern = /\[[^\]]+\]\((?!https?:\/\/|mailto:|#)([^)]+)\)/g;

for (const relativeFile of files) {
  const absoluteFile = path.join(rootDir, relativeFile);
  const raw = fs.readFileSync(absoluteFile, "utf8");
  const baseDir = path.dirname(absoluteFile);

  for (const match of raw.matchAll(linkPattern)) {
    const link = decodeURI(match[1].split("#")[0]);
    if (!link) {
      continue;
    }
    const target = path.resolve(baseDir, link);
    if (!target.startsWith(rootDir) || !fs.existsSync(target)) {
      errors.push(`${relativeFile}: missing internal link ${match[1]}`);
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`checked internal links in ${files.length} files`);
