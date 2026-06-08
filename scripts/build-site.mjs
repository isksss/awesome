import fs from "node:fs";
import path from "node:path";
import { getLessons, rootDir } from "./lib.mjs";

const outDir = path.join(rootDir, "app", "data");
fs.mkdirSync(outDir, { recursive: true });
const publicDocsDir = path.join(rootDir, "public", "docs");

const chapterLabels = {
  fundamentals: "基礎ツール",
  web: "Web",
  security: "Security",
  network: "Network",
  db: "DB",
};

function copyDir(source, target) {
  fs.mkdirSync(target, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);
    if (path.relative(rootDir, sourcePath).startsWith("docs/process")) {
      continue;
    }
    if (entry.isDirectory()) {
      copyDir(sourcePath, targetPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

function firstParagraph(content) {
  const cleaned = content
    .replace(/^---\n[\s\S]*?\n---\n/, "")
    .replace(/^<!--\s*_class:\s*title\s*-->\n*/gm, "")
    .replace(/^---$/gm, "");
  const paragraph = cleaned
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .find((block) => block && !block.startsWith("#") && !block.startsWith("```") && !block.startsWith("- "));
  return paragraph?.replace(/\s+/g, " ").slice(0, 120) ?? "";
}

function routeSlugFor(relativePath) {
  return relativePath.replace(/^docs\//, "").replace(/\.md$/, "");
}

const lessons = getLessons().map((lesson) => {
  const routeSlug = routeSlugFor(lesson.relativePath);
  return {
    slug: lesson.basename,
    routeSlug,
    title: lesson.data.title,
    chapter: lesson.data.chapter,
    chapterLabel: chapterLabels[lesson.data.chapter] ?? lesson.data.chapter,
    order: Number(lesson.data.order),
    audience: lesson.data.audience,
    updated: lesson.data.updated,
    summary: firstParagraph(lesson.content),
    slideCount: lesson.slideCount,
    markdownPath: `/lessons/${routeSlug}/`,
    slidePath: `/slides/${routeSlug}/`,
    rawPath: `/docs/${routeSlug}.md`,
    sourcePath: lesson.relativePath,
  };
});

const groups = [...Map.groupBy(lessons, (lesson) => lesson.chapter).entries()].map(
  ([key, items]) => ({
    key,
    label: chapterLabels[key] ?? key,
    items,
  }),
);

const site = {
  stats: {
    lessonCount: lessons.length,
  },
  groups,
  lessons,
};

fs.writeFileSync(path.join(outDir, "site.json"), JSON.stringify(site, null, 2));
fs.writeFileSync(
  path.join(outDir, "routes.json"),
  JSON.stringify(
    lessons.flatMap((lesson) => [lesson.markdownPath, lesson.slidePath]),
    null,
    2,
  ),
);
fs.rmSync(publicDocsDir, { recursive: true, force: true });
copyDir(path.join(rootDir, "docs"), publicDocsDir);
console.log(`generated ${path.relative(rootDir, path.join(outDir, "site.json"))}`);
console.log(`published Markdown under ${path.relative(rootDir, publicDocsDir)}`);
