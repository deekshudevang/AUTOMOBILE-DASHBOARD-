import React from 'react';

export type ProvenanceType = 'CFD' | 'ANALYTIC' | 'ILLUSTRATIVE';

export interface AeroProvenanceHUDProps {
  provenance: ProvenanceType;
  runId?: string;
  solver?: string;
  cellCount?: number;
  isConverged?: boolean;
  citation?: string;
  assumptions?: string[];
  cd?: number;
  cl?: number;
  speedKmh?: number;
}

export const AeroProvenanceHUD: React.FC<AeroProvenanceHUDProps> = ({
  provenance,
  runId,
  solver = 'OpenFOAM v2406 (simpleFoam)',
  cellCount,
  isConverged = true,
  citation,
  assumptions = [],
  cd,
  cl,
  speedKmh = 200
}) => {
  return (
    <div className="absolute top-4 right-4 z-50 flex flex-col gap-2 max-w-sm font-mono text-xs">
      {/* Primary Badge */}
      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900/90 backdrop-blur border border-slate-700/80 shadow-2xl text-slate-100">
        <span
          className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[11px] ${
            provenance === 'CFD'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : provenance === 'ANALYTIC'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
              : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
          }`}
        >
          [{provenance}]
        </span>
        <div className="flex flex-col">
          <span className="font-semibold text-slate-200">
            {provenance === 'CFD'
              ? 'Numerical RANS Solution'
              : provenance === 'ANALYTIC'
              ? 'Closed-Form Estimate'
              : 'Illustrative Visual Mode'}
          </span>
          <span className="text-[10px] text-slate-400">
            {provenance === 'CFD'
              ? `${solver} · Run ${runId || 'N/A'}`
              : provenance === 'ANALYTIC'
              ? citation || 'Thin-Airfoil & Empirical Drag Build-up'
              : 'Decorative rendering — no physical validity'}
          </span>
        </div>
      </div>

      {/* Aerodynamic Quantities Display */}
      {(cd !== undefined || cl !== undefined) && (
        <div className="grid grid-cols-2 gap-2 p-2 rounded-lg bg-slate-900/80 backdrop-blur border border-slate-800 text-slate-200">
          <div>
            <span className="text-[10px] text-slate-400 block">Drag Coeff (Cd)</span>
            <span className="text-sm font-bold text-slate-100">
              {cd !== undefined ? cd.toFixed(3) : '—'}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Lift Coeff (Cl)</span>
            <span className={`text-sm font-bold ${cl && cl < 0 ? 'text-emerald-400' : 'text-slate-100'}`}>
              {cl !== undefined ? cl.toFixed(3) : '—'}
            </span>
          </div>
        </div>
      )}

      {/* Provenance Disclosures */}
      {provenance === 'ILLUSTRATIVE' && (
        <div className="p-2 rounded bg-amber-950/40 border border-amber-600/30 text-[10px] text-amber-200/90 leading-tight">
          ⚠️ <strong>Non-Engineering Disclosure:</strong> Visual representation only. Does not reflect verified CFD or wind tunnel aerodynamic data.
        </div>
      )}

      {provenance === 'CFD' && !isConverged && (
        <div className="p-2 rounded bg-rose-950/40 border border-rose-600/30 text-[10px] text-rose-300 leading-tight">
          ⚠️ <strong>Unconverged Solver Run:</strong> Residuals or force standard deviation exceeded stability threshold. Results tagged UNRELIABLE.
        </div>
      )}

      {provenance === 'ANALYTIC' && assumptions.length > 0 && (
        <div className="p-2 rounded bg-slate-900/60 border border-slate-800 text-[10px] text-slate-400 leading-tight">
          <span className="font-semibold text-slate-300 block mb-1">CITED ASSUMPTIONS:</span>
          <ul className="list-disc pl-3 space-y-0.5">
            {assumptions.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
