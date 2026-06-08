import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export const rootDir = process.cwd();
export const docsDir = path.join(rootDir, "docs");

export const requiredFields = [
  "marp",
  "title",
  "size",
  "chapter",
  "order",
  "audience",
  "updated",
  "status",
  "visibility",
  "sources",
];

export function listMarkdownFiles(dir = docsDir) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return listMarkdownFiles(fullPath);
      }
      return entry.isFile() &&
        entry.name.endsWith(".md") &&
        !path.relative(rootDir, fullPath).startsWith("docs/process/")
        ? [fullPath]
        : [];
    })
    .sort();
}

export function readLesson(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = matter(raw);
  const relativePath = path.relative(rootDir, filePath);
  const basename = path.basename(filePath, ".md");
  const slideCount = parsed.content
    .split(/\n---\n/g)
    .map((slide) => slide.trim())
    .filter(Boolean).length;

  return {
    filePath,
    relativePath,
    basename,
    data: parsed.data,
    content: parsed.content,
    slideCount,
  };
}

export function getLessons() {
  return listMarkdownFiles().map(readLesson).sort((a, b) => {
    const chapter = String(a.data.chapter).localeCompare(String(b.data.chapter));
    if (chapter !== 0) {
      return chapter;
    }
    return Number(a.data.order) - Number(b.data.order);
  });
}

export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
