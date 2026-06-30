import fs from 'node:fs';
const required = ['main.js','preload.js','src/index.html','.github/workflows/build-macos.yml','package.json'];
for (const f of required) {
  if (!fs.existsSync(f)) throw new Error(`Missing required file: ${f}`);
}
const pkg = JSON.parse(fs.readFileSync('package.json','utf8'));
if (!pkg.build?.mac?.target) throw new Error('mac build target missing');
const html = fs.readFileSync('src/index.html','utf8');
for (const token of ['Upload plan','Align plan','Mark plots','Ranking']) {
  if (!html.includes(token)) throw new Error(`UI token missing: ${token}`);
}
console.log('Project verification passed.');
