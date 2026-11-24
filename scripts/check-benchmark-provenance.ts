import fs from 'fs';
import path from 'path';

/**
 * CI Provenance Integrity Checker
 * Fails if docs/CFD_VALIDATION_REPORT.md or docs/DRIVAER_VALIDATION_REPORT.md
 * contain 'VERIFIED' while provenance is ANALYTIC.
 */

const filesToCheck = [
  'docs/CFD_VALIDATION_REPORT.md',
  'docs/DRIVAER_VALIDATION_REPORT.md'
];

let failed = false;

for (const relPath of filesToCheck) {
  const fullPath = path.resolve(process.cwd(), relPath);
  if (!fs.existsSync(fullPath)) {
    console.warn(`[WARN] File does not exist yet: ${relPath}`);
    continue;
  }

  const content = fs.readFileSync(fullPath, 'utf-8');
  const isAnalytic = content.includes('ANALYTIC');
  // Check for forbidden claims when provenance is ANALYTIC
  const forbiddenRegex = /\b(VERIFIED)\b/gi;
  const matches = content.match(forbiddenRegex);

  if (isAnalytic && matches && matches.length > 0) {
    console.error(`❌ PROVENANCE INTEGRITY FAILURE: ${relPath}`);
    console.error(`   The report provenance is ANALYTIC, but contains prohibited label(s): ${JSON.stringify(matches)}`);
    failed = true;
  } else {
    console.log(`✓ [Provenance Verified] ${relPath} passed integrity check (ANALYTIC with no false VERIFIED claims).`);
  }
}

if (failed) {
  console.error('\nCI benchmark provenance check failed. Re-run benchmark generators with honest labels.');
  process.exit(1);
} else {
  console.log('\nAll benchmark reports passed honest provenance check.');
  process.exit(0);
}
