import React, { useState } from 'react';
import {
  FolderKanban,
  GitBranch,
  Plus,
  Clock,
  CheckCircle2,
  GitCommit,
  Layers,
  ArrowRight,
  ShieldCheck,
  FileCode,
  Copy,
  Sparkles
} from 'lucide-react';
import { useVehicleStore } from '../../hooks/useVehicleStore';
import { BrandBadge } from '../ui/BrandBadge';

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
  const { engineeringMode, activeModel, activeFile, setActiveView } = useVehicleStore();

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
        },
        {
          hash: 'e5f12a88',
          timestamp: '2026-11-18T10:20:00Z',
          message: 'Front dive plane add-ons and splitter stiffener mount',
          author: 'Aero Specialist',
          componentChangesCount: 3,
          verifiedManifold: true
        }
      ]
    }
  ]);

  const [newProjectName, setNewProjectName] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;
    const newProj: UiVehicleProject = {
      id: `proj_${Date.now()}`,
      name: newProjectName.trim(),
      targetVehicleHash: activeModel?.hash || 0,
      targetVehicleName: activeModel?.displayName || activeFile,
      createdAt: new Date().toISOString(),
      activeBranch: 'main',
      revisions: [
        {
          hash: Math.random().toString(16).substring(2, 10),
          timestamp: new Date().toISOString(),
          message: 'Initial project baseline snapshot',
          author: 'AutoVerse Engineer',
          componentChangesCount: 0,
          verifiedManifold: true
        }
      ]
    };
    setProjects([newProj, ...projects]);
    setNewProjectName('');
    setShowNewModal(false);
  };

  return (
    <div className="h-full flex flex-col bg-gt-obsidian text-zinc-100 overflow-hidden select-none font-sans">
      {/* 1. Header Toolbar */}
      <header className="h-14 px-6 bg-gt-basalt/80 border-b border-gt-border backdrop-blur-xl flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gt-accent/15 border border-gt-accent/30 flex items-center justify-center text-gt-accent">
            <FolderKanban className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-heading font-bold text-white tracking-wide">
                PROJECTS & REVISION WORKSPACES
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/60 border border-gt-border text-gt-accent font-bold">
                {projects.length} ACTIVE PROJECTS
              </span>
            </div>
            <p className="text-[11px] font-mono text-zinc-400">
              Audit revision control • Branching automotive studies • Collaborative engineering snapshots
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gt-accent hover:bg-gt-accent/90 text-white text-xs font-mono font-bold shadow-lg shadow-gt-accent/20 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>NEW PROJECT</span>
        </button>
      </header>

      {/* 2. Main Workstation Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {projects.map(proj => (
            <div
              key={proj.id}
              className="rounded-2xl bg-gt-basalt/60 border border-gt-border p-5 space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Target Vehicle & Branch */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <BrandBadge
                      manufacturer={proj.targetVehicleName.split(' ')[0]}
                      size="sm"
                      showWordmark={false}
                    />
                    <span className="text-xs font-mono text-zinc-400 truncate max-w-[240px]">
                      {proj.targetVehicleName}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/50 border border-gt-border text-[10px] font-mono text-zinc-300">
                    <GitBranch className="w-3 h-3 text-gt-accent" />
                    <span>{proj.activeBranch}</span>
                  </div>
                </div>

                {/* Project Title */}
                <h3 className="text-base font-heading font-bold text-white mb-3">
                  {proj.name}
                </h3>

                {/* Chronological Commit Tree */}
                <div className="space-y-2 border-l-2 border-gt-border pl-4 my-4 font-mono">
                  {proj.revisions.map((rev, idx) => (
                    <div key={rev.hash} className="relative group">
                      {/* Node Bullet */}
                      <div
                        className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 ${
                          idx === proj.revisions.length - 1
                            ? 'bg-gt-accent border-gt-obsidian ring-2 ring-gt-accent/40'
                            : 'bg-zinc-600 border-gt-obsidian'
                        }`}
                      />

                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-zinc-200 group-hover:text-white transition-colors">
                          {rev.message}
                        </span>
                        <span className="text-[10px] text-gt-accent font-bold">{rev.hash}</span>
                      </div>

                      <div className="flex items-center gap-3 text-[10px] text-zinc-500 mt-0.5">
                        <span>{rev.author}</span>
                        <span>•</span>
                        <span>{new Date(rev.timestamp).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="text-emerald-400 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Watertight B-Rep</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="pt-3 border-t border-gt-border flex items-center justify-between gap-3 text-xs font-mono">
                <button
                  onClick={() => setActiveView('studio')}
                  className="flex-1 py-2 rounded-xl bg-gt-accent hover:bg-gt-accent/90 text-white font-bold flex items-center justify-center gap-1.5 shadow-md shadow-gt-accent/15 transition-all cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>OPEN IN STUDIO</span>
                </button>

                <button
                  onClick={() => alert(`Forked branch created from ${proj.name}!`)}
                  className="px-3 py-2 rounded-xl bg-gt-basalt hover:bg-gt-graphite border border-gt-border text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Fork</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Project Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-gt-basalt border border-gt-border rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs font-mono">
            <h3 className="text-sm font-heading font-bold text-white">Create New Engineering Project</h3>
            <input
              type="text"
              value={newProjectName}
              onChange={e => setNewProjectName(e.target.value)}
              placeholder="e.g. Aerodynamic Downforce Optimization Study"
              className="w-full p-2.5 rounded-lg bg-black/50 border border-gt-border text-white font-mono text-xs focus:outline-none focus:border-gt-accent"
              autoFocus
            />
            <div className="flex justify-end gap-2 pt-2 border-t border-gt-border">
              <button
                onClick={() => setShowNewModal(false)}
                className="px-4 py-2 rounded-lg bg-gt-graphite text-zinc-300 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                className="px-4 py-2 rounded-lg bg-gt-accent text-white font-bold cursor-pointer"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
