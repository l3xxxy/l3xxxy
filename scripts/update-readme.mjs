// Refreshes the katelabs line in README.md from the live About page (headline count and date).
// Leaves the README untouched if the page or the pattern is unavailable.
import fs from 'node:fs';

const README = 'README.md';
const START = '<!-- katelabs-stats:start -->';
const END = '<!-- katelabs-stats:end -->';

const res = await fetch('https://katelabs.io/en/about', { headers: { 'User-Agent': 'l3xxxy-profile-readme' } });
if (!res.ok) { console.log(`about page: HTTP ${res.status}, README unchanged`); process.exit(0); }
const html = await res.text();
const text = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
// "Collecting since 4 October 2024. 238,412 headlines scored as of 27 October 2026."
const m = text.match(/Collecting since ([^.]+)\. ([\d,]+) headlines scored as of ([^.]+)\./);
if (!m) { console.log('pattern not found, README unchanged'); process.exit(0); }
const line = `Collecting since ${m[1]}; ${m[2]} headlines scored as of ${m[3]}.`;

const readme = fs.readFileSync(README, 'utf8');
const next = readme.replace(new RegExp(`${START}[\\s\\S]*?${END}`), `${START}${line}${END}`);
if (next === readme) { console.log('no change'); process.exit(0); }
fs.writeFileSync(README, next);
console.log(`updated: ${line}`);
