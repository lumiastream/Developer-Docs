import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { siteUrl, socialImageUrl, socialPages } from "./social-pages.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function getAttribute(tag, name) {
  const match = tag.match(new RegExp(`${name}=["']([^"']+)["']`, "i"));
  return match ? decodeHtml(match[1]) : "";
}

function getMeta(html, selectorName, selectorValue) {
  const tags = html.match(/<meta\s+[^>]*>/gi) ?? [];
  const tag = tags.find((candidate) => getAttribute(candidate, selectorName) === selectorValue);
  return tag ? getAttribute(tag, "content") : "";
}

function getCanonical(html) {
  const links = html.match(/<link\s+[^>]*>/gi) ?? [];
  const tag = links.find((candidate) => getAttribute(candidate, "rel") === "canonical");
  return tag ? getAttribute(tag, "href") : "";
}

function pageHtmlPath(route) {
  return join(root, "build", route.replace(/^\//, ""), "index.html");
}

function assertEqual(page, name, actual, expected) {
  if (actual !== expected) {
    throw new Error(`${page.id} ${name} expected "${expected}" but found "${actual || "(missing)"}"`);
  }
}

function assertIncludes(page, name, actual, expected) {
  if (!actual.includes(expected)) {
    throw new Error(`${page.id} ${name} expected to include "${expected}" but found "${actual || "(missing)"}"`);
  }
}

for (const page of socialPages) {
  const html = readFileSync(pageHtmlPath(page.route), "utf8");
  const expectedUrl = `${siteUrl}${page.route}`;
  const expectedImage = socialImageUrl(page);
  const title = decodeHtml(html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] ?? "");

  assertIncludes(page, "title", title, page.title);
  assertIncludes(page, "og:title", getMeta(html, "property", "og:title"), page.title);
  assertEqual(page, "og:description", getMeta(html, "property", "og:description"), page.description);
  assertEqual(page, "og:image", getMeta(html, "property", "og:image"), expectedImage);
  assertEqual(page, "twitter:image", getMeta(html, "name", "twitter:image"), expectedImage);
  assertEqual(page, "og:url", getMeta(html, "property", "og:url"), expectedUrl);
  assertEqual(page, "canonical", getCanonical(html), expectedUrl);
}

console.log(`Social preview metadata looks correct for ${socialPages.length} pages.`);
