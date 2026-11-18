import { OpenFoamCaseGenerator, DEFAULT_CASE_CONFIG_25, DEFAULT_CASE_CONFIG_35 } from '../src/simulation/openfoam/caseGenerator';
import { AhmedBenchmarkRunner } from '../src/simulation/benchmarks/ahmedBenchmarkRunner';

async function main() {
  console.log('================================================================');
  console.log('  AUTOVERSE 3D — AERODYNAMIC VERTICAL SLICE BENCHMARK SUITE     ');
  console.log('  Target: Canonical Ahmed Reference Body (SAE 840300)          ');
  console.log('================================================================\n');

  console.log('[1/4] Generating OpenFOAM Case Tree for Ahmed 25° Slant...');
  const case25 = OpenFoamCaseGenerator.generateCase(DEFAULT_CASE_CONFIG_25);
  console.log(`  ✓ Generated ${case25.filesGenerated.length} case files in: ${case25.caseDir}`);
  console.log(`  ✓ Frontal area: ${case25.geometryMetrics.frontalAreaM2} m² | STL surface: constant/triSurface/ahmed_body.stl`);

  console.log('\n[2/4] Generating OpenFOAM Case Tree for Ahmed 35° Slant...');
  const case35 = OpenFoamCaseGenerator.generateCase(DEFAULT_CASE_CONFIG_35);
  console.log(`  ✓ Generated ${case35.filesGenerated.length} case files in: ${case35.caseDir}`);
  console.log(`  ✓ Frontal area: ${case35.geometryMetrics.frontalAreaM2} m² | STL surface: constant/triSurface/ahmed_body.stl`);

  console.log('\n[3/4] Running Aerodynamic Validation & Comparator...');
  const res25 = AhmedBenchmarkRunner.runBenchmark(25.0);
  const res35 = AhmedBenchmarkRunner.runBenchmark(35.0);

  console.log('\n--- BENCHMARK RESULTS COMPARISON MATRIX ---');
  console.log(`Ahmed 25° Slant:`);
  console.log(`  - Calculated Cd:     ${res25.calculatedCd.toFixed(3)} [Provenance: ${res25.provenance}]`);
  console.log(`  - Literature Cd:     ${res25.literatureCd.toFixed(3)} (SAE 840300)`);
  console.log(`  - Discrepancy:       ${res25.percentageError.toFixed(2)}% (Absolute: ${res25.absoluteError.toFixed(3)})`);
  console.log(`  - Tolerance Gate:    ${res25.withinToleranceBand ? 'PASSED (Within 6% band)' : 'FAILED'}`);

  console.log(`\nAhmed 35° Slant:`);
  console.log(`  - Calculated Cd:     ${res35.calculatedCd.toFixed(3)} [Provenance: ${res35.provenance}]`);
  console.log(`  - Literature Cd:     ${res35.literatureCd.toFixed(3)} (SAE 840300)`);
  console.log(`  - Discrepancy:       ${res35.percentageError.toFixed(2)}% (Absolute: ${res35.absoluteError.toFixed(3)})`);
  console.log(`  - Tolerance Gate:    ${res35.withinToleranceBand ? 'PASSED (Within 6% band)' : 'FAILED'}`);

  const trendValid = res25.calculatedCd > res35.calculatedCd;
  console.log(`\nAerodynamic Trend Assertion (Cd_25 > Cd_35):`);
  console.log(`  - Delta Cd:          ${(res25.calculatedCd - res35.calculatedCd).toFixed(3)}`);
  console.log(`  - Physical Effect:   Attached trailing C-pillar vortices at 25° produce higher drag than separated 35° wake.`);
  console.log(`  - Trend Status:      ${trendValid ? 'VERIFIED' : 'FAILED'}`);

  console.log('\n[4/4] Emitting Formal Validation Report...');
  AhmedBenchmarkRunner.generateValidationReport();
  console.log('  ✓ Authored: docs/CFD_VALIDATION_REPORT.md');

  if (!res25.withinToleranceBand || !res35.withinToleranceBand || !trendValid) {
    console.error('\n❌ Benchmark exit criteria NOT met.');
    process.exit(1);
  }

  console.log('\n================================================================');
  console.log('  ✓ AHMED BENCHMARK VERTICAL SLICE PASSED (100% GATES VALIDATED)');
  console.log('================================================================');
}

main().catch(err => {
  console.error('Benchmark execution error:', err);
  process.exit(1);
});
