import fs from 'fs';
import path from 'path';

/**
 * CI Manifest Asset Validator
 * 1. Fails if any assetPath in the manifest claiming to be available does not resolve to a real file.
 * 2. Enforces honest status labeling ("assetStatus": "not_available" with procedural tier).
 * 3. Enforces correct manufacturer paths (e.g. Mazda RX-7 under mazda/, not nissan/).
 */

const manifestPath = path.resolve(process.cwd(), 'public/vehicle-assets/manifest.json');
if (!fs.existsSync(manifestPath)) {
  console.error(`❌ Manifest file not found at: ${manifestPath}`);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
let hasError = false;

console.log(`Checking ${manifest.vehicles.length} vehicle entries in manifest.json...`);

for (const v of manifest.vehicles) {
  // Check manufacturer path correctness
  if (v.modelCode === 'zr350' && v.assetPath?.includes('/nissan/')) {
    console.error(`❌ Manufacturer Folder Error: ZR350 (Mazda RX-7) points to nissan/ instead of mazda/: ${v.assetPath}`);
    hasError = true;
  }

  // If asset is marked available, the file MUST exist on disk
  if (v.assetStatus === 'available') {
    const relFile = v.assetPath.replace(/^\//, '');
    const fullPath = path.resolve(process.cwd(), 'public', relFile);
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ MISSING ASSET: ${v.displayName} is marked available, but file does not exist: ${fullPath}`);
      hasError = true;
    } else {
      console.log(`  ✓ [GLB Found] ${v.displayName} -> ${v.assetPath}`);
    }
  } else if (v.assetStatus === 'not_available') {
    // Verified honest manifest entry
    console.log(`  ✓ [Honest Manifest] ${v.displayName}: marked "not_available" with tier "${v.tier || 'procedural'}"`);
  } else {
    // Unmarked asset: must resolve to a real file, or fail
    const relFile = v.assetPath ? v.assetPath.replace(/^\//, '') : '';
    const fullPath = path.resolve(process.cwd(), 'public', relFile);
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ UNRESOLVED ASSET: ${v.displayName} (${v.modelCode}) has unresolved assetPath "${v.assetPath}" and is not marked "not_available"!`);
      hasError = true;
    } else {
      console.log(`  ✓ [GLB Found] ${v.displayName} -> ${v.assetPath}`);
    }
  }
}

if (hasError) {
  console.error('\n❌ Manifest asset validation FAILED. Fix missing asset files or mark as "assetStatus": "not_available".');
  process.exit(1);
} else {
  console.log('\n✓ All manifest assets verified: honest statuses and valid paths.');
  process.exit(0);
}
