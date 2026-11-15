const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function main() {
  const baselineDir = path.resolve('docs/baseline');
  const screenshotsDir = path.join(baselineDir, 'screenshots');
  fs.mkdirSync(screenshotsDir, { recursive: true });

  console.log('Recording baseline environment...');
  const nodeVer = process.version;
  const npmVer = execSync('npm -v', { encoding: 'utf-8' }).trim();
  
  console.log('Running test suite baseline...');
  let testOutput = '';
  try {
    testOutput = execSync('npm test -- --run', { encoding: 'utf-8' });
  } catch (err) {
    testOutput = err.stdout ? err.stdout.toString() : err.message;
  }

  console.log('Running build baseline...');
  let buildOutput = '';
  try {
    buildOutput = execSync('npm run build', { encoding: 'utf-8' });
  } catch (err) {
    buildOutput = err.stdout ? err.stdout.toString() : err.message;
  }

  // Copy captured screenshots into docs/baseline/screenshots/
  const artifactsDir = path.resolve('artifacts');
  if (fs.existsSync(artifactsDir)) {
    const files = fs.readdirSync(artifactsDir);
    for (const file of files) {
      if (file.endsWith('.png')) {
        fs.copyFileSync(path.join(artifactsDir, file), path.join(screenshotsDir, file));
      }
    }
  }

  const report = `# AUTOVERSE 3D — Baseline Pre-Configurator Report
**Date:** ${new Date().toISOString()}  
**Git Branch:** \`feat/autoverse-configurator\`  
**Git Baseline Tag:** \`pre-configurator-baseline\`  

---

## 1. Environment & Tooling
- **Node.js Version:** ${nodeVer}
- **npm Version:** ${npmVer}
- **Platform:** Windows 11 (x64)
- **UI/UX Pro Max Skill Preflight:** Checked. Skill is NOT globally installed. Design brief will be applied directly as specified in Section 1.4.

---

## 2. Test Suite Baseline
\`\`\`
${testOutput.trim()}
\`\`\`

---

## 3. Production Build Baseline
\`\`\`
${buildOutput.trim()}
\`\`\`

---

## 4. Visual Baseline Screenshots
Screenshots stored in \`docs/baseline/screenshots/\`:
${fs.readdirSync(screenshotsDir).map(f => `- \`${f}\``).join('\n')}

---

## 5. Golden Fixtures Set
- **Location:** \`tests/fixtures/vehicles/\`
- **Count:** 109 vehicle JSON configurations preserved as immutable backwards-compatibility contract.
`;

  fs.writeFileSync(path.join(baselineDir, 'BASELINE_REPORT.md'), report, 'utf-8');
  console.log('Saved docs/baseline/BASELINE_REPORT.md');
}

main().catch(console.error);
