import { DrivAerBenchmarkRunner } from '../src/simulation/benchmarks/drivaerBenchmarkRunner';

console.log('[PROVENANCE: ANALYTIC] ================================================================');
console.log('[PROVENANCE: ANALYTIC] AutoVerse 3D — Running DrivAer Benchmark Suite (SAE 2012-01-0168)');
console.log('[PROVENANCE: ANALYTIC] ================================================================');

const report = DrivAerBenchmarkRunner.runBenchmark();
const reportPath = DrivAerBenchmarkRunner.writeReport(report);

console.log(`[PROVENANCE: ${report.provenance}] Generated Report: ${reportPath}`);
console.log(`[PROVENANCE: ${report.provenance}] All Configurations Passed: ${report.allPassed}`);
console.log(`[PROVENANCE: ${report.provenance}] Physical Trend Confirmed: ${report.physicalTrendVerified}`);

for (const [cfg, res] of Object.entries(report.results)) {
  console.log(`[PROVENANCE: ${res.provenance}] - ${cfg.toUpperCase()}: Cd=${res.calculatedCd} [${res.provenance}] (Lit: ${res.literatureCd}, Error: ${res.errorPercent}%) -> ${res.passed ? 'PASS' : 'FAIL'}`);
}

if (!report.allPassed) {
  console.error('[PROVENANCE: ANALYTIC] \nDrivAer Benchmark FAILED tolerance checks!');
  process.exit(1);
} else {
  console.log('[PROVENANCE: ANALYTIC] \nDrivAer Benchmark PASSED successfully.');
  process.exit(0);
}
