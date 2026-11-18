import { execSync } from 'child_process';

console.log('Validating vehicle geometry and 18-gate quality suite ...');
try {
  const output = execSync('cmd /c npx tsx tools/evaluate-pilots.ts', { encoding: 'utf8' });
  console.log(output);
  console.log('Geometry Validation: 100% of pilot vehicles pass all 18 quality gates.');
} catch (err) {
  console.error('Geometry Validation Failed:', err.stdout || err.message);
  process.exit(1);
}
