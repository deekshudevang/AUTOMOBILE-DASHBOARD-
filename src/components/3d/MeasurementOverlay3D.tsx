import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { useVehicleStore } from '../../hooks/useVehicleStore';
import { X, Ruler } from 'lucide-react';

export const MeasurementOverlay3D: React.FC = () => {
  const { measurementPoints, clearMeasurement, isMeasuring } = useVehicleStore();
  const { p1, p2 } = measurementPoints;

  const v1 = useMemo(() => (p1 ? new THREE.Vector3(...p1) : null), [p1]);
  const v2 = useMemo(() => (p2 ? new THREE.Vector3(...p2) : null), [p2]);

  const stats = useMemo(() => {
    if (!v1 || !v2) return null;
    const distanceM = v1.distanceTo(v2);
    const distanceMm = Math.round(distanceM * 1000);
    const dx = Math.abs(Math.round((v2.x - v1.x) * 1000));
    const dy = Math.abs(Math.round((v2.y - v1.y) * 1000));
    const dz = Math.abs(Math.round((v2.z - v1.z) * 1000));
    const midpoint = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);
    midpoint.y += 0.05; // float slightly above
    return { distanceM, distanceMm, dx, dy, dz, midpoint };
  }, [v1, v2]);

  // Construct line object
  const lineObj = useMemo(() => {
    if (!v1 || !v2) return null;
    const geometry = new THREE.BufferGeometry().setFromPoints([v1, v2]);
    const material = new THREE.LineDashedMaterial({
      color: 0x00f0ff,
      dashSize: 0.05,
      gapSize: 0.02
    });
    const line = new THREE.Line(geometry, material);
    line.computeLineDistances();
    return line;
  }, [v1, v2]);

  if (!v1 && !v2) return null;

  return (
    <group name="measurement_overlay_3d">
      {/* Marker A */}
      {v1 && (
        <mesh position={v1}>
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshBasicMaterial color="#00F0FF" />
          <Html position={[0, 0.04, 0]} center distanceFactor={8}>
            <div className="px-1.5 py-0.5 rounded bg-[#0A0C10]/90 border border-[#00F0FF]/40 text-[#00F0FF] text-[10px] font-mono font-bold whitespace-nowrap shadow-md pointer-events-none">
              Point A
            </div>
          </Html>
        </mesh>
      )}

      {/* Marker B */}
      {v2 && (
        <mesh position={v2}>
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshBasicMaterial color="#00E5A3" />
          <Html position={[0, 0.04, 0]} center distanceFactor={8}>
            <div className="px-1.5 py-0.5 rounded bg-[#0A0C10]/90 border border-[#00E5A3]/40 text-[#00E5A3] text-[10px] font-mono font-bold whitespace-nowrap shadow-md pointer-events-none">
              Point B
            </div>
          </Html>
        </mesh>
      )}

      {/* Connecting Dimension Line */}
      {lineObj && <primitive object={lineObj} />}

      {/* Dimension Readout Badge */}
      {stats && (
        <Html position={stats.midpoint} center distanceFactor={8}>
          <div className="bg-[#0A0C10]/95 backdrop-blur-md border border-[#00F0FF]/60 rounded-lg p-2.5 shadow-2xl text-slate-100 font-mono text-[11px] space-y-1 min-w-[190px]">
            <div className="flex items-center justify-between border-b border-[#222A38] pb-1">
              <span className="flex items-center gap-1 text-[#00F0FF] font-bold text-xs">
                <Ruler className="w-3.5 h-3.5" />
                <span>{stats.distanceMm.toLocaleString()} mm</span>
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearMeasurement();
                }}
                className="p-0.5 rounded hover:bg-[#1A202C] text-slate-400 hover:text-slate-100 transition-colors"
                title="Clear Measurement"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-[10px] text-slate-400 pt-0.5">
              <span>Metric: </span>
              <span className="text-slate-200 font-bold">{stats.distanceM.toFixed(3)} m</span>
            </div>
            <div className="grid grid-cols-3 gap-1 text-[9px] text-slate-400 pt-0.5 border-t border-[#1E2533]">
              <div>ΔX: <span className="text-slate-200">{stats.dx}</span></div>
              <div>ΔY: <span className="text-slate-200">{stats.dy}</span></div>
              <div>ΔZ: <span className="text-slate-200">{stats.dz}</span></div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};
