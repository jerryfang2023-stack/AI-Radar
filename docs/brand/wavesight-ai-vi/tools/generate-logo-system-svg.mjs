import { mkdir, copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const viRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteBrandRoot = path.resolve(viRoot, "../../../01-SiteV2/site/assets/brand");

const c = {
  ink: "#071827",
  deep: "#0B1D2A",
  blue: "#0D355C",
  gray: "#6F7F8F",
  mountain: "#A7ADB4",
  border: "#E5E8EC",
  bg: "#F7F4EF",
  paper: "#FFFFFF",
  gold: "#C8A766",
  mono: "#111318",
};

const style = `
  text { font-family: "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif; }
  .cn { font-family: "STSong", "SimSun", "Noto Serif SC", "Source Han Serif SC", "Songti SC", serif; font-weight: 700; letter-spacing: 1px; }
  .en { font-family: "Montserrat", "Avenir Next", "Avenir", "IBM Plex Sans", sans-serif; font-weight: 500; letter-spacing: 12px; }
  .tagline { font-family: "Noto Serif SC", "Source Han Serif SC", "Songti SC", serif; letter-spacing: 18px; }
`;

function root(viewBox, label, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-label="${label}">
  <title>${label}</title>
  <style>${style}</style>
  ${body}
</svg>
`;
}

function symbol({ x = 0, y = 0, s = 1, dark = false, mono = false, filled = true } = {}) {
  const ink = mono ? c.mono : dark ? c.paper : c.ink;
  const blue = mono ? c.mono : dark ? c.paper : c.blue;
  const secondary = mono ? c.mono : dark ? "rgba(247,244,239,.82)" : c.gray;
  const tertiary = mono ? c.mono : dark ? "rgba(247,244,239,.56)" : c.mountain;
  const gold = mono ? c.mono : c.gold;
  if (filled) {
    return `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M59 88 C132 52, 258 52, 337 88 C246 70, 143 70, 59 88 Z" fill="${gold}" opacity="${mono ? 1 : 0.68}"/>
    <path d="M62 137 C115 113, 156 117, 199 132 C247 149, 295 143, 366 115 C292 153, 246 160, 193 143 C149 128, 111 124, 62 137 Z" fill="${tertiary}" opacity="${mono ? 1 : 0.5}"/>
    <path d="M47 154 C105 129, 153 133, 201 150 C256 170, 313 161, 381 129 C314 175, 254 188, 197 166 C147 147, 102 143, 47 154 Z" fill="${ink}"/>
    <path d="M0 184 C78 148, 136 153, 196 173 C253 192, 310 183, 381 148 C309 195, 250 211, 191 190 C131 169, 75 164, 0 184 Z" fill="${blue}" opacity="${mono ? 1 : 0.98}"/>
    <path d="M64 207 C122 183, 166 187, 214 200 C262 214, 311 205, 368 178 C310 212, 262 225, 211 211 C161 198, 119 194, 64 207 Z" fill="${secondary}" opacity="${mono ? 1 : 0.7}"/>
  </g>`;
  }
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M44 54 C121 20, 264 20, 348 54" stroke="${gold}" stroke-width="3.2" opacity="${mono ? 1 : 0.9}"/>
    <path d="M58 111 C111 88, 151 93, 194 109 C242 126, 291 120, 360 91" stroke="${tertiary}" stroke-width="3.1" opacity="${mono ? 1 : 0.62}"/>
    <path d="M18 138 C88 105, 136 110, 188 128 C242 148, 300 139, 382 101" stroke="${ink}" stroke-width="8.4"/>
    <path d="M0 160 C79 126, 134 131, 191 149 C248 167, 304 158, 378 122" stroke="${blue}" stroke-width="5.8" opacity="${mono ? 1 : 0.95}"/>
    <path d="M55 178 C114 153, 156 157, 206 170 C255 184, 306 175, 360 149" stroke="${secondary}" stroke-width="3.2" opacity="${mono ? 1 : 0.82}"/>
  </g>`;
}

function horizontal({ dark = false } = {}) {
  const text = dark ? c.paper : c.ink;
  return root("0 0 810 298", `观澜AI Wavesight AI 横版 Logo${dark ? " 反白版" : ""}`, `
    ${symbol({ x: 26, y: 55, s: 0.82, dark })}
    <text x="350" y="181" class="cn" font-size="116" fill="${text}">观澜 AI</text>
    <text x="357" y="253" class="en" font-size="36" fill="${text}">WAVESIGHT AI</text>
  `);
}

function stacked({ dark = false } = {}) {
  const text = dark ? c.paper : c.ink;
  return root("0 0 440 330", `观澜AI Wavesight AI 竖版 Logo${dark ? " 深色版" : ""}`, `
    ${symbol({ x: 26, y: -8, s: 1.02, dark })}
    <text x="220" y="250" class="cn" font-size="64" fill="${text}" text-anchor="middle">观澜 AI</text>
    <text x="221" y="296" class="en" font-size="20" fill="${text}" text-anchor="middle">WAVESIGHT AI</text>
  `);
}

function symbolOnly({ dark = false, mono = false } = {}) {
  return root("0 0 390 240", `观澜AI 澜线符号${dark ? " 深色版" : mono ? " 单色版" : ""}`, symbol({ x: 4, y: 10, s: 1, dark, mono }));
}

function darkBackground() {
  return root("0 0 440 300", "观澜AI 深色背景 Logo", `
    <rect x="24" y="24" width="392" height="252" rx="22" fill="${c.ink}"/>
    ${symbol({ x: 50, y: 22, s: 0.9, dark: true })}
    <text x="220" y="218" class="cn" font-size="50" fill="${c.paper}" text-anchor="middle">观澜 AI</text>
    <text x="221" y="258" class="en" font-size="16" fill="${c.paper}" text-anchor="middle">WAVESIGHT AI</text>
  `);
}

function appIcon({ dark = false } = {}) {
  return root("0 0 256 256", `观澜AI App Icon ${dark ? "Dark" : "Light"}`, `
    <rect x="16" y="16" width="224" height="224" rx="44" fill="${dark ? c.ink : c.paper}" stroke="${dark ? "rgba(255,255,255,.12)" : c.border}" stroke-width="2"/>
    ${symbol({ x: 18, y: 42, s: 0.58, dark })}
  `);
}

function coverMark() {
  return root("0 0 900 120", "观澜AI 底部标语线", `
    <line x1="0" y1="60" x2="250" y2="60" stroke="${c.gold}" stroke-width="2"/>
    <text x="450" y="72" class="tagline" font-size="20" fill="${c.ink}" text-anchor="middle">观澜之深 · 识势之远 · 行动之先</text>
    <line x1="650" y1="60" x2="900" y2="60" stroke="${c.gold}" stroke-width="2"/>
  `);
}

const files = {
  "logo-wavesight-horizontal-light.svg": horizontal(),
  "logo-wavesight-horizontal-dark.svg": horizontal({ dark: true }),
  "logo-wavesight-reference-horizontal.svg": horizontal(),
  "logo-wavesight-reference-horizontal-reverse.svg": horizontal({ dark: true }),
  "logo-wavesight-reference-symbol.svg": symbolOnly(),
  "logo-wavesight-stacked-light.svg": stacked(),
  "logo-wavesight-stacked-dark.svg": stacked({ dark: true }),
  "logo-wavesight-symbol-light.svg": symbolOnly(),
  "logo-wavesight-symbol-dark.svg": symbolOnly({ dark: true }),
  "logo-wavesight-monochrome.svg": symbolOnly({ mono: true }),
  "logo-wavesight-dark-background.svg": darkBackground(),
  "app-icon-light.svg": appIcon(),
  "app-icon-dark.svg": appIcon({ dark: true }),
  "brand-footer-motto-line.svg": coverMark(),
};

await mkdir(viRoot, { recursive: true });
await mkdir(siteBrandRoot, { recursive: true });

for (const [name, content] of Object.entries(files)) {
  const file = path.join(viRoot, name);
  await writeFile(file, content, "utf8");
  await copyFile(file, path.join(siteBrandRoot, name));
}

const readme = `# 观澜AI｜Logo SVG 资产

本批 Logo SVG 依据用户提供的 \`reference-images/visual-identity-system.png\` 重新拆解生成，并以源图中“横版组合 / 竖版组合 / 图形标识 / 单色版本 / 深色背景 / App icon”作为正式比例基准。不再使用早先压缩包中的 Logo 文件。

## 文件

| 文件 | 用途 |
|---|---|
| \`logo-wavesight-horizontal-light.svg\` | 浅色背景横版 Logo |
| \`logo-wavesight-horizontal-dark.svg\` | 深色背景横版 Logo |
| \`logo-wavesight-stacked-light.svg\` | 浅色背景竖版 Logo |
| \`logo-wavesight-stacked-dark.svg\` | 深色背景竖版 Logo |
| \`logo-wavesight-symbol-light.svg\` | 浅色背景澜线符号 |
| \`logo-wavesight-symbol-dark.svg\` | 深色背景澜线符号 |
| \`logo-wavesight-monochrome.svg\` | 单色符号 |
| \`logo-wavesight-dark-background.svg\` | 深色底完整 Logo 卡 |
| \`app-icon-light.svg\` | 浅色 App / favicon 图标 |
| \`app-icon-dark.svg\` | 深色 App / favicon 图标 |
| \`brand-footer-motto-line.svg\` | 底部标语线 |

## 结构规范

- 一条香槟金地平线代表视野、判断边界与长期方向。
- 三道主澜线代表变化中的流动、大势方向和商业机会层次；为忠于源图，SVG 可保留一条低对比细辅助水纹，但不得新增新的品牌母题。
- 中文字标为思源宋体类标题气质，英文为 Montserrat Medium 风格宽字距。
- 不添加雷达、眼睛、机器人、科技光圈或新的品牌母题。
`;

await writeFile(path.join(viRoot, "logo-system.md"), readme, "utf8");
await writeFile(path.join(siteBrandRoot, "logo-system.md"), readme, "utf8");

const passthroughFiles = ["brand-tokens.css", "motion-tokens.css", "README.md", "logo-reference-guidelines.md"];

for (const name of passthroughFiles) {
  await copyFile(path.join(viRoot, name), path.join(siteBrandRoot, name));
}

console.log(`Generated ${Object.keys(files).length} logo SVG files and synced ${passthroughFiles.length} brand support files.`);
