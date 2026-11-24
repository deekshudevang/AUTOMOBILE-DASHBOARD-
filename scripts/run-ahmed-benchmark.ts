import { OpenFoamCaseGenerator, DEFAULT_CASE_CONFIG_25, DEFAULT_CASE_CONFIG_35 } from '../src/simulation/openfoam/caseGenerator';
import { AhmedBenchmarkRunner } from '../src/simulation/benchmarks/ahmedBenchmarkRunner';

async function main() {
  console.log('[PROVENANCE: ANALYTIC] ================================================================');
  console.log('[PROVENANCE: ANALYTIC]   AUTOVERSE 3D — AERODYNAMIC VERTICAL SLICE BENCHMARK SUITE     ');
  console.log('[PROVENANCE: ANALYTIC]   Target: Canonical Ahmed Reference Body (SAE 840300)          ');
  console.log('[PROVENANCE: ANALYTIC] ================================================================');

  console.log('[PROVENANCE: ANALYTIC] [1/4] Generating OpenFOAM Case Tree for Ahmed 25° Slant...');
  const case25 = OpenFoamCaseGenerator.generateCase(DEFAULT_CASE_CONFIG_25);
  console.log(`[PROVENANCE: ANALYTIC]   ✓ Generated ${case25.filesGenerated.length} case files in: ${case25.caseDir}`);
  console.log(`[PROVENANCE: ANALYTIC]   ✓ Frontal area: ${case25.geometryMetrics.frontalAreaM2} m² | STL: constant/triSurface/ahmed_body.stl`);

  console.log('[PROVENANCE: ANALYTIC] [2/4] Generating OpenFOAM Case Tree for Ahmed 35° Slant...');
  const case35 = OpenFoamCaseGenerator.generateCase(DEFAULT_CASE_CONFIG_35);
  console.log(`[PROVENANCE: ANALYTIC]   ✓ Generated ${case35.filesGenerated.length} case files in: ${case35.caseDir}`);
  console.log(`[PROVENANCE: ANALYTIC]   ✓ Frontal area: ${case35.geometryMetrics.frontalAreaM2} m² | STL: constant/triSurface/ahmed_body.stl`);

  console.log('[PROVENANCE: ANALYTIC] [3/4] Running Aerodynamic Validation & Comparator...');
  const res25 = AhmedBenchmarkRunner.runBenchmark(25.0);
  const res35 = AhmedBenchmarkRunner.runBenchmark(35.0);

  console.log('[PROVENANCE: ANALYTIC] --- BENCHMARK RESULTS COMPARISON MATRIX ---');
  console.log(`[PROVENANCE: ${res25.provenance}] Ahmed 25° Slant:`);
  console.log(`[PROVENANCE: ${res25.provenance}]   - Calculated Cd:     ${res25.calculatedCd.toFixed(3)} [Provenance: ${res25.provenance}]`);
  console.log(`[PROVENANCE: ${res25.provenance}]   - Literature Cd:     ${res25.literatureCd.toFixed(3)} (SAE 840300)`);
  console.log(`[PROVENANCE: ${res25.provenance}]   - Discrepancy:       ${res25.percentageError.toFixed(2)}% (Absolute: ${res25.absoluteError.toFixed(3)})`);
  console.log(`[PROVENANCE: ${res25.provenance}]   - Tolerance Gate:    ${res25.withinToleranceBand ? 'PASSED (Within 6% band)' : 'FAILED'}`);

  console.log(`[PROVENANCE: ${res35.provenance}] Ahmed 35° Slant:`);
  console.log(`[PROVENANCE: ${res35.provenance}]   - Calculated Cd:     ${res35.calculatedCd.toFixed(3)} [Provenance: ${res35.provenance}]`);
  console.log(`[PROVENANCE: ${res35.provenance}]   - Literature Cd:     ${res35.literatureCd.toFixed(3)} (SAE 840300)`);
  console.log(`[PROVENANCE: ${res35.provenance}]   - Discrepancy:       ${res35.percentageError.toFixed(2)}% (Absolute: ${res35.absoluteError.toFixed(3)})`);
  console.log(`[PROVENANCE: ${res35.provenance}]   - Tolerance Gate:    ${res35.withinToleranceBand ? 'PASSED (Within 6% band)' : 'FAILED'}`);

  const trendValid = res25.calculatedCd > res35.calculatedCd;
  console.log(`[PROVENANCE: ANALYTIC] Aerodynamic Trend Assertion (Cd_25 > Cd_35):`);
  console.log(`[PROVENANCE: ANALYTIC]   - Delta Cd:          ${(res25.calculatedCd - res35.calculatedCd).toFixed(3)}`);
  console.log(`[PROVENANCE: ANALYTIC]   - Physical Effect:   Attached trailing C-pillar vortices at 25° produce higher drag than separated 35° wake.`);
  console.log(`[PROVENANCE: ANALYTIC]   - Trend Status:      ${trendValid ? 'ANALYTICALLY CONSISTENT' : 'FAILED'}`);

  console.log('[PROVENANCE: ANALYTIC] [4/4] Emitting Formal Validation Report...');
  AhmedBenchmarkRunner.generateValidationReport();
  console.log('[PROVENANCE: ANALYTIC]   ✓ Authored: docs/CFD_VALIDATION_REPORT.md');

  if (!res25.withinToleranceBand || !res35.withinToleranceBand || !trendValid) {
    console.error('[PROVENANCE: ANALYTIC] ❌ Benchmark exit criteria NOT met.');
    process.exit(1);
  }

  console.log('[PROVENANCE: ANALYTIC] ================================================================');
  console.log('[PROVENANCE: ANALYTIC]   ✓ AHMED BENCHMARK PASSED (ANALYTIC ESTIMATES WITHIN TOLERANCE)');
  console.log('[PROVENANCE: ANALYTIC] ================================================================');
}

main().catch(err => {
  console.error('[PROVENANCE: ANALYTIC] Benchmark execution error:', err);
  process.exit(1);
});
