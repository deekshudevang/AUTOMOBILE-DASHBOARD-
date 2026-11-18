import React, { useState } from 'react';
import {
  FolderKanban,
  GitBranch,
  Plus,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { useVehicleStore } from '../../hooks/useVehicleStore';

export interface ProjectRevision {
  hash: string;
  timestamp: string;
  message: string;
  author: string;
  componentChangesCount: number;
  verifiedManifold: boolean;
}

export interface UiVehicleProject {
  id: string;
  name: string;
  targetVehicleHash: number;
  targetVehicleName: string;
  createdAt: string;
  activeBranch: string;
  revisions: ProjectRevision[];
}

export const ProjectsView: React.FC = () => {
  const { engineeringMode, activeModel, activeFile } = useVehicleStore();

  const [projects, setProjects] = useState<UiVehicleProject[]>([
    {
      id: 'proj_gt3rs_aero_01',
      name: 'Porsche 911 GT3 RS Aero Optimisation',
      targetVehicleHash: 706080074,
      targetVehicleName: 'Porsche 911 GT3 RS (992, 2022)',
      createdAt: '2026-11-15T09:30:00Z',
      activeBranch: 'main',
      revisions: [
        {
          hash: 'a1f89c02',
          timestamp: '2026-11-15T09:30:00Z',
          message: 'Initial project fork from reference GT3 RS',
          author: 'Automotive Lab Student',
          componentChangesCount: 0,
          verifiedManifold: true
        },
        {
          hash: 'b4e72d19',
          timestamp: '2026-11-16T14:15:00Z',
          message: 'Increased rear wing angle of attack to 12.5 deg',
          author: 'Automotive Lab Student',
          componentChangesCount: 1,
          verifiedManifold: true
        },
        {
          hash: 'c89a03f4',
          timestamp: '2026-11-17T11:45:00Z',
          message: 'Added dual rear diffuser strakes and optimized throat',
          author: 'Automotive Lab Student',
          componentChangesCount: 2,
          verifiedManifold: true
        }
      ]
    },
    {
      id: 'proj_bmw_m4_gt3',
      name: 'BMW M4 GT3 Endurance Package',
      targetVehicleHash: 3994326574,
      targetVehicleName: 'BMW M4 GT3 (G82, 2022)',
      createdAt: '2026-11-17T16:00:00Z',
      activeBranch: 'main',
      revisions: [
        {
          hash: 'd2e99011',
          timestamp: '2026-11-17T16:00:00Z',
          message: 'Baseline geometry setup and datum verification',
          author: 'Aero Specialist',
          componentChangesCount: 0,
          verifiedManifold: true
        }
      ]
    }
  ]);

  const [selectedProjectId, setSelectedProjectId] = useState<string>('proj_gt3rs_aero_01');
  const [newProjectName, setNewProjectName] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;
    const newProj: UiVehicleProject = {
      id: `proj_${Date.now()}`,
      name: newProjectName.trim(),
      targetVehicleHash: activeModel?.hash || 706080074,
      targetVehicleName: activeModel?.displayName || activeFile,
      createdAt: new Date().toISOString(),
      activeBranch: 'main',
      revisions: [
        {
          hash: Math.random().toString(16).substring(2, 10),
          timestamp: new Date().toISOString(),
          message: 'Initial commit from current vehicle state',
          author: engineeringMode === 'student' ? 'Student Engineer' : 'Lead Aerodynamicist',
          componentChangesCount: 0,
          verifiedManifold: true
        }
      ]
    };
    setProjects([newProj, ...projects]);
    setSelectedProjectId(newProj.id);
    setNewProjectName('');
    setIsCreating(false);
  };

  return (
    <div className="h-full flex flex-col bg-autoverse-bg text-slate-100 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-autoverse-border">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight">Project Workspace</h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-autoverse-elevated border border-autoverse-border text-autoverse-cyan">
              IMMUTABLE DAG
            </span>
            {engineeringMode === 'student' && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300">
                Student Mode Active
              </span>
            )}
          </div>
          <p className="text-xs text-autoverse-muted mt-1">
            Non-destructive engineering revisions, branching history, and parametric component lineages.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded bg-autoverse-cyan hover:bg-cyan-500 text-slate-950 font-semibold text-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Creation Modal / Inline Form */}
      {isCreating && (
        <div className="mt-4 p-4 rounded bg-autoverse-surface border border-autoverse-borderLight space-y-3">
          <h3 className="text-sm font-semibold text-slate-200">Create New Engineering Project</h3>
          <p className="text-xs text-autoverse-muted">
            Forks current vehicle geometry (<span className="text-slate-300 font-mono">{activeModel?.displayName || activeFile}</span>) into an isolated parametric branch.
          </p>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="e.g. Porsche 911 High-Downforce Sprint Setup"
              value={newProjectName}
              onChange={e => setNewProjectName(e.target.value)}
              className="flex-1 bg-autoverse-elevated border border-autoverse-border rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-autoverse-cyan"
            />
            <button
              onClick={handleCreateProject}
              className="px-4 py-2 rounded bg-autoverse-cyan text-slate-950 font-semibold text-xs hover:bg-cyan-400"
            >
              Fork & Initialize
            </button>
            <button
              onClick={() => setIsCreating(false)}
              className="px-3 py-2 rounded bg-autoverse-elevated text-slate-400 hover:text-slate-200 text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Project Selector List */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-xs font-mono uppercase tracking-wider text-autoverse-muted">
            Active Projects ({projects.length})
          </h2>

          <div className="space-y-2">
            {projects.map(proj => {
              const isSelected = proj.id === selectedProjectId;
              return (
                <div
                  key={proj.id}
                  onClick={() => setSelectedProjectId(proj.id)}
                  className={`p-3.5 rounded cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-autoverse-elevated border-autoverse-cyan/60 shadow-sm'
                      : 'bg-autoverse-surface border-autoverse-border hover:border-autoverse-borderLight'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <FolderKanban className={`w-4 h-4 ${isSelected ? 'text-autoverse-cyan' : 'text-slate-400'}`} />
                      <h3 className="text-xs font-semibold text-slate-100">{proj.name}</h3>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <GitBranch className="w-3 h-3 text-autoverse-cyan" />
                      {proj.activeBranch}
                    </span>
                  </div>

                  <p className="text-[11px] text-autoverse-muted mt-2 truncate">
                    Base: {proj.targetVehicleName}
                  </p>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-autoverse-border/50 text-[10px] text-slate-400 font-mono">
                    <span>{proj.revisions.length} revisions</span>
                    <span>{new Date(proj.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Project Revision History & DAG */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-4 rounded bg-autoverse-surface border border-autoverse-border space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-100">{activeProject.name}</h2>
                <p className="text-xs text-autoverse-muted mt-0.5">
                  Target Vehicle: <span className="text-slate-300 font-medium">{activeProject.targetVehicleName}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-1 rounded bg-autoverse-elevated text-autoverse-cyan border border-autoverse-border">
                  Branch: {activeProject.activeBranch}
                </span>
              </div>
            </div>

            {/* Revision Timeline */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-autoverse-muted">
                Append-Only Revision History
              </h3>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-autoverse-border">
                {activeProject.revisions.map((rev: ProjectRevision, idx: number) => (
                  <div key={rev.hash} className="relative group">
                    {/* DAG Node Indicator */}
                    <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-autoverse-surface border-2 border-autoverse-cyan flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-autoverse-cyan" />
                    </div>

                    <div className="p-3 rounded bg-autoverse-elevated border border-autoverse-border hover:border-autoverse-borderLight transition-colors">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-200">{rev.message}</span>
                        <span className="font-mono text-[11px] text-autoverse-cyan px-1.5 py-0.5 rounded bg-autoverse-overlay border border-autoverse-border">
                          {rev.hash}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {new Date(rev.timestamp).toLocaleString()}
                        </span>
                        <span>Author: {rev.author}</span>
                        {rev.verifiedManifold && (
                          <span className="flex items-center gap-1 text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" />
                            Manifold 2-BRep
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-autoverse-border flex items-center justify-between text-xs">
              <div className="text-autoverse-muted">
                {engineeringMode === 'student' ? (
                  <span>💡 Tip: Revisions cannot be overwritten, guaranteeing complete auditability.</span>
                ) : (
                  <span className="font-mono text-[11px]">Strict linear append-only DAG with SHA-256 geometry digests.</span>
                )}
              </div>
              <button className="px-3 py-1.5 rounded bg-autoverse-elevated hover:bg-autoverse-overlay text-slate-300 border border-autoverse-border text-xs">
                Export Project Bundle (.zip)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
