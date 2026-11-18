import fs from 'fs';
import path from 'path';

const VEHICLES_DIR = path.resolve('public/vehicles');
let total = 0;
let passed = 0;
const errors = [];

function checkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      checkDir(fullPath);
    } else if (entry.name.endsWith('.json') && !entry.name.includes('INDEX') && entry.name !== 'index.json') {
      total++;
      try {
        const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
        const hasId = data.vehicle?.id || data.asset_id || data.model !== undefined;
        if (!hasId) {
          errors.push(`${entry.name}: missing vehicle ID or model hash`);
        } else {
          passed++;
        }
      } catch (e) {
        errors.push(`${entry.name}: JSON parse failure - ${e.message}`);
      }
    }
  }
}

console.log('Validating vehicle inventory in public/vehicles ...');
checkDir(VEHICLES_DIR);

console.log(`Vehicle Validation: ${passed}/${total} files valid.`);
if (errors.length > 0) {
  console.error('Validation Errors:', errors);
  process.exit(1);
} else {
  console.log('All vehicle definitions structurally validated.');
}
