import fs from 'fs';
import path from 'path';

const SEARCH_DIRS = ['public/vehicles', 'public/vehicle-assets', 'src/data', 'docs'];
let totalChecked = 0;
const errors = [];

function checkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.git') {
      checkDir(fullPath);
    } else if (entry.name.endsWith('.json')) {
      totalChecked++;
      try {
        JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      } catch (err) {
        errors.push(`${fullPath}: ${err.message}`);
      }
    }
  }
}

console.log('Validating repository JSON syntax integrity ...');
SEARCH_DIRS.forEach(checkDir);

console.log(`Validated ${totalChecked} JSON files.`);
if (errors.length > 0) {
  console.error('Syntax validation failed for:', errors);
  process.exit(1);
} else {
  console.log('100% of JSON files are syntax-valid.');
}
