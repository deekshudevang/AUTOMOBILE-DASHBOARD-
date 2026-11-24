import React from 'react';
import { Loader2 } from 'lucide-react';

interface EngineeringModuleLoaderProps {
  label?: string;
  moduleName?: string;
}

export const EngineeringModuleLoader: React.FC<EngineeringModuleLoaderProps> = ({
  label = 'Loading Engineering Module',
  moduleName
}) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[400px] bg-autoverse-bg text-slate-300 p-8 select-none">
      <div className="flex items-center space-x-3 mb-3">
        <Loader2 className="w-5 h-5 animate-spin text-[#00F0FF]" />
        <span className="text-sm font-mono tracking-wider text-slate-200 font-semibold uppercase">
          {label}
        </span>
      </div>
      {moduleName && (
        <div className="text-xs font-mono text-cyan-400/80 mb-2">
          TARGET: {moduleName}
        </div>
      )}
      <div className="text-[11px] font-mono text-slate-500 tracking-wide uppercase">
        AUTOVERSE CAD/CFD KERNEL // STREAMING CODE CHUNK
      </div>
    </div>
  );
};
