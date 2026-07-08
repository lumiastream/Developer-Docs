import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import { socialPages } from "./social-pages.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const outputDir = join(root, "static/img/social");
const logoPath = join(root, "static/img/logo.png");
const logoData = readFileSync(logoPath, "base64");

mkdirSync(outputDir, { recursive: true });

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function wrapText(value, maxLength = 42) {
  const words = value.split(" ");
  const lines = [];
  let line = "";

  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxLength && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }

  if (line) {
    lines.push(line);
  }

  return lines.slice(0, 3);
}

function titleSize(title) {
  if (title.length > 18) return 50;
  if (title.length > 14) return 54;
  return 62;
}

function template(page) {
  const descriptionLines = wrapText(page.description);
  const codeLines = page.code.slice(0, 4);
  const fontSize = titleSize(page.imageTitle);
  const urlText = `dev.lumiastream.com${page.route}`;

  return `<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop stop-color="#141018"/>
      <stop offset="0.52" stop-color="#1A121B"/>
      <stop offset="1" stop-color="#100D12"/>
    </linearGradient>
    <linearGradient id="brand" x1="74" y1="74" x2="640" y2="552" gradientUnits="userSpaceOnUse">
      <stop stop-color="#FF3598"/>
      <stop offset="0.48" stop-color="#FF4076"/>
      <stop offset="1" stop-color="#FF5436"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="24" stdDeviation="30" flood-color="#000000" flood-opacity="0.45"/>
    </filter>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <path d="M70 98H556L419 532H-67L70 98Z" fill="url(#brand)" opacity="0.11"/>
  <path d="M760 72H1256L1128 436H632L760 72Z" fill="#FFFFFF" opacity="0.035"/>
  <path d="M0 520H1200V630H0V520Z" fill="#0E0B0F" opacity="0.58"/>

  <g filter="url(#shadow)">
    <image href="data:image/png;base64,${logoData}" x="82" y="76" width="132" height="132" preserveAspectRatio="xMidYMid meet"/>
  </g>

  <text x="242" y="128" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="700">Lumia Stream</text>
  <text x="242" y="169" fill="#F2B7C8" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="500">Developer Documentation</text>

  <text x="86" y="300" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="800">${escapeXml(page.imageTitle)}</text>
  ${descriptionLines.map((line, index) => `<text x="91" y="${352 + index * 36}" fill="#F0DDE5" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="500">${escapeXml(line)}</text>`).join("\n  ")}

  <g filter="url(#shadow)">
    <rect x="735" y="164" width="367" height="306" rx="22" fill="#130F16" stroke="#3A2731"/>
    <rect x="735" y="164" width="367" height="58" rx="22" fill="#1E151C"/>
    <circle cx="770" cy="194" r="7" fill="#FF5436"/>
    <circle cx="795" cy="194" r="7" fill="#FF4076"/>
    <circle cx="820" cy="194" r="7" fill="#FF3598"/>
    <text x="858" y="202" fill="#F1B7C9" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700">lumia-stream docs</text>

    ${codeLines.map((line, index) => `<text x="773" y="${269 + index * 47}" fill="${["#FF9FC5", "#FF7294", "#FF9B87", "#F0DDE5"][index]}" font-family="SFMono-Regular, Menlo, Consolas, monospace" font-size="24">${escapeXml(line)}</text>`).join("\n    ")}
  </g>

  <path d="M735 512H1103" stroke="#FFFFFF" stroke-opacity="0.12"/>
  <text x="735" y="550" fill="#F4E8ED" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700">${escapeXml(urlText)}</text>
</svg>
`;
}

const generatedImages = new Set();

for (const page of socialPages) {
  if (generatedImages.has(page.image)) continue;

  const svgName = page.image.replace(/\.png$/, ".svg");
  const svgPath = join(outputDir, svgName);
  const pngPath = join(outputDir, page.image);

  writeFileSync(svgPath, template(page));

  const result = spawnSync("rsvg-convert", ["-w", "1200", "-h", "630", svgPath, "-o", pngPath], {
    encoding: "utf8",
  });

  if (result.error) {
    throw new Error(`Unable to run rsvg-convert for ${basename(pngPath)}: ${result.error.message}`);
  }

  if (result.status !== 0) {
    throw new Error(`rsvg-convert failed for ${basename(pngPath)}:\n${result.stderr}`);
  }

  if (!existsSync(pngPath)) {
    throw new Error(`Expected ${pngPath} to be generated.`);
  }

  generatedImages.add(page.image);
}

console.log(`Generated ${generatedImages.size} social preview images.`);
