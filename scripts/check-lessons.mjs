import { getLessons, requiredFields } from "./lib.mjs";

const lessons = getLessons();
const errors = [];
const seenOrders = new Set();

if (lessons.length < 26) {
  errors.push(`expected at least 26 lessons, found ${lessons.length}`);
}

for (const lesson of lessons) {
  const { data, relativePath, slideCount } = lesson;

  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === "") {
      errors.push(`${relativePath}: missing frontmatter field "${field}"`);
    }
  }

  if (data.marp !== true) {
    errors.push(`${relativePath}: marp must be true`);
  }

  if (data.size !== "16:9") {
    errors.push(`${relativePath}: size must be 16:9`);
  }

  if (data.visibility !== "public") {
    errors.push(`${relativePath}: visibility must be public`);
  }

  if (data.status !== "complete") {
    errors.push(`${relativePath}: status must be complete`);
  }

  if (!Array.isArray(data.sources) || data.sources.length < 2) {
    errors.push(`${relativePath}: sources must contain at least 2 entries`);
  }

  if (data.chapter !== "fundamentals" && !lesson.content.includes("```mermaid")) {
    errors.push(`${relativePath}: must include at least one Mermaid diagram`);
  }

  if (slideCount < 12) {
    errors.push(`${relativePath}: slide count must be at least 12, found ${slideCount}`);
  }

  const orderKey = `${data.chapter}:${data.order}`;
  if (seenOrders.has(orderKey)) {
    errors.push(`${relativePath}: duplicate chapter/order ${orderKey}`);
  }
  seenOrders.add(orderKey);
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`checked ${lessons.length} lessons`);
