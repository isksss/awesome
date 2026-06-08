import fs from "node:fs";
import path from "node:path";
import { escapeHtml, getLessons, rootDir } from "./lib.mjs";

const outDir = path.join(rootDir, "dist/site");
fs.mkdirSync(outDir, { recursive: true });

function copyDir(source, target) {
  fs.mkdirSync(target, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);
    if (entry.isDirectory()) {
      copyDir(sourcePath, targetPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

const lessons = getLessons();
const chapters = Map.groupBy(lessons, (lesson) => lesson.data.chapter);

const chapterHtml = [...chapters.entries()]
  .map(([chapter, items]) => {
    const cards = items
      .map((lesson) => {
        const title = escapeHtml(lesson.data.title);
        const audience = escapeHtml(lesson.data.audience);
        const updated = escapeHtml(lesson.data.updated);
        const chapter = escapeHtml(lesson.data.chapter);
        const basename = escapeHtml(lesson.basename);
        return `<li>
          <strong>${title}</strong>
          <span>${audience} / updated ${updated}</span>
          <a href="./slides/${chapter}/${basename}.html">HTML</a>
          <a href="./pdf/${chapter}/${basename}.pdf">PDF</a>
          <a href="./${escapeHtml(lesson.relativePath)}">Markdown</a>
        </li>`;
      })
      .join("\n");
    return `<section><h2>${escapeHtml(chapter)}</h2><ol>${cards}</ol></section>`;
  })
  .join("\n");

const html = `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Web Application Practice Materials</title>
  <style>
    :root { color-scheme: light; font-family: system-ui, sans-serif; }
    body { margin: 0; color: #1f2937; background: #f8fafc; }
    header { padding: 48px 24px 24px; background: #ffffff; border-bottom: 1px solid #dbe3ee; }
    main { max-width: 1040px; margin: 0 auto; padding: 32px 24px 56px; }
    h1 { margin: 0 0 12px; font-size: 2rem; }
    p { line-height: 1.7; }
    section { margin: 28px 0; }
    ol { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px; padding: 0; list-style: none; }
    li { background: #ffffff; border: 1px solid #dbe3ee; border-radius: 8px; padding: 16px; }
    li strong, li span { display: block; margin-bottom: 8px; }
    li span { color: #526070; font-size: 0.9rem; }
    a { color: #0f5b99; margin-right: 12px; }
  </style>
</head>
<body>
  <header>
    <main>
      <h1>Web Application Practice Materials</h1>
      <p>Java/Spring、Security、Network、DB をつなげて学ぶ公開教材です。Markdown を主ソースにし、HTML / PDF を Marp で生成します。</p>
    </main>
  </header>
  <main>
    ${chapterHtml}
  </main>
</body>
</html>
`;

fs.writeFileSync(path.join(outDir, "index.html"), html);
copyDir(path.join(rootDir, "content"), path.join(outDir, "content"));
console.log(`generated ${path.relative(rootDir, path.join(outDir, "index.html"))}`);
