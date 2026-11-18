import { DrivAerBenchmarkRunner } from '../src/simulation/benchmarks/drivaerBenchmarkRunner';

console.log('================================================================');
console.log('AutoVerse 3D — Running DrivAer Benchmark Suite (SAE 2012-01-0168)');
console.log('================================================================');

const report = DrivAerBenchmarkRunner.runBenchmark();
const reportPath = DrivAerBenchmarkRunner.writeReport(report);

console.log(`\nGenerated Report: ${reportPath}`);
console.log(`All Configurations Passed: ${report.allPassed}`);
console.log(`Physical Trend Confirmed: ${report.physicalTrendVerified}`);

for (const [cfg, res] of Object.entries(report.results)) {
  console.log(`- ${cfg.toUpperCase()}: Cd=${res.calculatedCd} [${res.provenance}] (Lit: ${res.literatureCd}, Error: ${res.errorPercent}%) -> ${res.passed ? 'PASS' : 'FAIL'}`);
}

if (!report.allPassed) {
  console.error('\nDrivAer Benchmark FAILED tolerance checks!');
  process.exit(1);
} else {
  console.log('\nDrivAer Benchmark PASSED successfully.');
  process.exit(0);
}
