import MarkdownIt from "markdown-it";

const md = new MarkdownIt({ html: true, linkify: true, typographer: true });

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderFlowchart(code: string) {
  const lines = code
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines[0] !== "flowchart LR") return null;

  const edges: string[][] = [];
  const labels = new Map<string, string>();
  const nodePattern = /^([A-Za-z][A-Za-z0-9_]*)(?:\[([^\]]+)\])?$/;

  function parseNode(part: string) {
    const match = part.trim().match(nodePattern);
    if (!match) return null;
    const id = match[1];
    labels.set(id, match[2] ?? labels.get(id) ?? id);
    return id;
  }

  for (const line of lines.slice(1)) {
    const [fromPart, toPart] = line.split(/\s+-->\s+/);
    const from = parseNode(fromPart ?? "");
    const to = parseNode(toPart ?? "");
    if (!from || !to) return null;
    edges.push([from, to]);
  }

  const order = [...labels.keys()];
  const longestLabel = Math.max(...[...labels.values()].map((label) => label.length));
  const boxWidth = Math.max(168, Math.min(260, longestLabel * 18 + 32));
  const boxHeight = 64;
  const gap = 48;
  const margin = 24;
  const width = margin * 2 + order.length * boxWidth + (order.length - 1) * gap;
  const height = 150;
  const y = 44;
  const positions = new Map(order.map((id, index) => [id, { x: margin + index * (boxWidth + gap), y }]));

  const edgeSvg = edges
    .map(([from, to]) => {
      const a = positions.get(from)!;
      const b = positions.get(to)!;
      return `<path d="M ${a.x + boxWidth} ${a.y + boxHeight / 2} L ${b.x - 12} ${b.y + boxHeight / 2}" stroke="#0f6b74" stroke-width="3" fill="none" marker-end="url(#arrow)" />`;
    })
    .join("");

  const nodeSvg = order
    .map((id) => {
      const p = positions.get(id)!;
      return `<g><rect x="${p.x}" y="${p.y}" width="${boxWidth}" height="${boxHeight}" rx="8" fill="#ffffff" stroke="#0f6b74" stroke-width="2" /><text x="${p.x + boxWidth / 2}" y="${p.y + 40}" text-anchor="middle" font-size="20" font-family="sans-serif" fill="#172033">${escapeHtml(labels.get(id)!)}</text></g>`;
    })
    .join("");

  return `<div class="mermaid-static"><svg role="img" aria-label="Mermaid diagram" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg"><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#0f6b74" /></marker></defs>${edgeSvg}${nodeSvg}</svg></div>`;
}

export function renderMarkdown(markdown: string) {
  const withMermaid = markdown.replace(/```mermaid\n([\s\S]*?)\n```/g, (_match, code: string) => {
    return renderFlowchart(code) ?? `<pre><code>${escapeHtml(code)}</code></pre>`;
  });
  return md.render(withMermaid);
}

export function stripFrontmatter(markdown: string) {
  return markdown.replace(/^---\n[\s\S]*?\n---\n/, "");
}

export function stripSlideDirectives(markdown: string) {
  return markdown.replace(/^<!--\s*_class:\s*title\s*-->\n*/gm, "");
}
