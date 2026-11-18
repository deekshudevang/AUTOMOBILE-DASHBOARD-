import { execSync } from 'child_process';

console.log('Validating vehicle customization engine and invariant preservation ...');
try {
  const output = execSync('npx vitest run tests/geometry-invariants.test.ts tests/wheel-rules.test.ts', { encoding: 'utf8' });
  console.log(output);
  console.log('Customization Validation: Wheel rules, geometry invariants, and material overrides verified.');
} catch (err) {
  console.error('Customization Validation Failed:', err.stdout || err.message);
  process.exit(1);
}
