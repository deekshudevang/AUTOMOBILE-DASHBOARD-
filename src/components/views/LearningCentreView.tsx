import React, { useState } from 'react';
import {
  BookOpen,
  GraduationCap,
  HelpCircle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Wind,
  Layers,
  Cpu,
  Activity
} from 'lucide-react';
import { useVehicleStore } from '../../hooks/useVehicleStore';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Why does an automotive CFD simulation require a moving ground belt rather than a stationary floor?",
    options: [
      "To reduce the computational run time of the Navier-Stokes solver.",
      "To prevent a false boundary layer from forming on the floor, which would choke the underbody diffuser.",
      "To simulate wheel friction on the roadway surface.",
      "To satisfy the 2-manifold topological requirements of the CAD mesh."
    ],
    correctIndex: 1,
    explanation: "In real driving, the car moves through still air over stationary asphalt. In a wind tunnel, air moves over the floor. If the floor is stationary, a viscous boundary layer develops on the floor, altering the effective ground clearance and choking the underbody diffuser."
  },
  {
    id: 2,
    question: "What is the primary difference between G1 and G2 surface continuity across adjoining CAD surface patches?",
    options: [
      "G1 requires matching colors; G2 requires matching materials.",
      "G1 shares common edge points; G2 shares identical face normals.",
      "G1 shares tangent planes (no sharp crease); G2 additionally matches the rate of curvature change, eliminating reflection wobble.",
      "G1 is for 2D sketches; G2 is for 3D solid STEP files."
    ],
    correctIndex: 2,
    explanation: "G0 is positional (touching). G1 is tangent continuity (no angle/crease, but curvature jumps discontinuously). G2 is curvature continuity, meaning the radius of curvature matches across the seam, which is essential for Class-A automotive body reflection quality."
  },
  {
    id: 3,
    question: "In computational fluid dynamics, what is the meaning and role of the non-dimensional wall distance y+?",
    options: [
      "It measures the overall length of the virtual wind tunnel domain.",
      "It represents the normalized distance of the first cell centroid from the wall to determine if the viscous sublayer is properly resolved.",
      "It indicates the percentage error of the drag coefficient compared to wind tunnel measurements.",
      "It tracks the number of prism inflation layers created by snappyHexMesh."
    ],
    correctIndex: 1,
    explanation: "y+ is the non-dimensional wall distance based on friction velocity (u_tau) and kinematic viscosity (nu). A y+ ≈ 1 resolves the laminar sublayer directly, while y+ ≈ 30-100 relies on logarithmic wall functions."
  },
  {
    id: 4,
    question: "Why do high-performance sports cars engineer negative camber gain into their suspension linkage design?",
    options: [
      "To make straight-line cruising more fuel efficient.",
      "To keep the tire contact patch flat on the road as the chassis rolls into a corner.",
      "To reduce brake disc temperature under heavy deceleration.",
      "To increase wheel arch clearance under full steering lock."
    ],
    correctIndex: 1,
    explanation: "When a car takes a corner, centrifugal force causes the body to roll outward. Without camber gain, body roll would tip the tire onto its outer shoulder, shrinking the contact patch. Camber gain tilts the wheel inward as the suspension compresses, maintaining maximum tire grip."
  }
];

export const LearningCentreView: React.FC = () => {
  const { engineeringMode, setEngineeringMode } = useVehicleStore();

  const [activeTab, setActiveTab] = useState<'modules' | 'quiz'>('modules');
  const [selectedModule, setSelectedModule] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState<boolean>(false);

  const modules = [
    {
      title: '1. Fundamentals of Vehicle Aerodynamics',
      icon: Wind,
      summary: 'Ground effect, boundary layer separation, wake vortices, and diffuser pressure recovery.',
      content: `
### Aerodynamic Forces and Moments
Automotive aerodynamics deals with fluid flow over bluff bodies moving in close proximity to the ground. Unlike streamlined aircraft fuselages, road vehicles suffer from massive flow separation at the rear.

1. **Aerodynamic Drag ($F_d$):**
   $$F_d = \\frac{1}{2} \\rho U_\\infty^2 C_d A$$
   Drag opposes vehicle motion and directly dictates top speed and energy consumption. Over 70% of drag is pressure drag caused by wake separation.

2. **Aerodynamic Lift & Downforce ($F_l$):**
   $$F_l = \\frac{1}{2} \\rho U_\\infty^2 C_l A$$
   Negative lift (downforce) increases normal load on tire contact patches without adding physical mass, dramatically improving cornering and braking limits.

3. **Underbody Diffusers and Venturi Effect:**
   The underbody operates as a Venturi nozzle. As the floor narrows, velocity increases and pressure drops (Bernoulli's principle). The diffuser gradually expands this airflow back to ambient pressure, recovering pressure without turbulent flow stall.
      `
    },
    {
      title: '2. Class-A Surfacing & CAD Continuity',
      icon: Layers,
      summary: 'G0 positional, G1 tangency, G2 curvature continuity, and zebra reflection line analysis.',
      content: `
### Mathematical Surface Continuity Hierarchy
In automotive exterior styling, light reflections must flow seamlessly across adjoining panels without visible flaws or sudden breaks.

- **G0 Continuity (Point/Positional):**
  Surface curves touch at the boundary. There are no gaps, but there can be a sharp edge or crease (e.g. where two flat plates meet at 90°).

- **G1 Continuity (Tangent/Angular):**
  Surfaces share a common tangent plane at the seam. There is no sharp crease, but curvature changes abruptly. Light reflections will show a sharp bend across the seam.

- **G2 Continuity (Curvature):**
  Both the tangent plane and the radius of curvature match smoothly across the boundary. Reflection lines (zebra stripes) pass through the boundary without any sharp bends or kinks. This is mandatory for automotive Class-A exterior body styling.
      `
    },
    {
      title: '3. CFD Numerical Methods & Turbulence',
      icon: Cpu,
      summary: 'Navier-Stokes equations, Reynolds averaging, k-ω SST turbulence modeling, and y+ wall treatment.',
      content: `
### The Reynolds-Averaged Navier-Stokes (RANS) Equations
Airflow around a vehicle is highly turbulent (Reynolds numbers $Re > 5 \\times 10^6$). Direct Numerical Simulation (DNS) is computationally impossible, requiring millions of CPU years. We instead use RANS:

$$\\frac{\\partial \\bar{u}_i}{\\partial t} + \\bar{u}_j \\frac{\\partial \\bar{u}_i}{\\partial x_j} = -\\frac{1}{\\rho}\\frac{\\partial \\bar{p}}{\\partial x_i} + \\nu \\nabla^2 \\bar{u}_i - \\frac{\\partial}{\\partial x_j}(\\overline{u_i' u_j'})$$

### The $k$-$\\omega$ Shear Stress Transport (SST) Model
The Menter $k$-$\\omega$ SST model blends two turbulence formulations:
1. Standard $k$-$\\omega$ in the near-wall boundary layer (captures adverse pressure gradient separation).
2. Standard $k$-$\\epsilon$ in the free-stream wake (avoids sensitivity to inlet turbulence numbers).
      `
    },
    {
      title: '4. Multibody Suspension Kinematics',
      icon: Activity,
      summary: 'Double wishbone geometry, camber gain curves, scrub radius, and dynamic contact patch load transfer.',
      content: `
### Suspension Geometry and Tire Mechanics
The suspension controls the physical orientation of the tire contact patch relative to the asphalt under dynamic load.

- **Camber Gain:** The rate at which wheel camber changes per millimeter of vertical suspension bump ($\Delta \\text{deg} / \\text{mm}$).
- **Roll Center:** The instantaneous point in space about which the vehicle body rolls under lateral cornering acceleration. A higher roll center reduces body roll angle but increases jacking forces.
- **Scrub Radius:** The lateral distance between the tire center line and the point where the steering kingpin axis intersects the ground. A small positive scrub radius provides steering feel, while excessive scrub radius causes kickback over road bumps.
      `
    }
  ];

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    if (submittedQuiz) return;
    setUserAnswers({ ...userAnswers, [questionId]: optionIdx });
  };

  const calculateScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach(q => {
      if (userAnswers[q.id] === q.correctIndex) score += 1;
    });
    return score;
  };

  return (
    <div className="h-full flex flex-col bg-autoverse-bg text-slate-100 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-autoverse-border shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight">Student Learning Centre</h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800 text-cyan-300">
              AUTOMOTIVE ENGINEERING CURRICULUM
            </span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300">
              Student Mode Interactive
            </span>
          </div>
          <p className="text-xs text-autoverse-muted mt-1">
            Core automotive engineering theory: Aerodynamics, CAD Class-A Surfacing, CFD Numerical Methods, and Kinematics.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('modules')}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
              activeTab === 'modules'
                ? 'bg-autoverse-cyan text-slate-950'
                : 'bg-autoverse-elevated text-slate-300 hover:text-white'
            }`}
          >
            Theory Modules
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
              activeTab === 'quiz'
                ? 'bg-autoverse-cyan text-slate-950'
                : 'bg-autoverse-elevated text-slate-300 hover:text-white'
            }`}
          >
            Knowledge Check Quiz
          </button>
        </div>
      </div>

      {/* Main Content */}
      {activeTab === 'modules' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Module Selector */}
          <div className="lg:col-span-1 space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-wider text-autoverse-muted">
              Course Modules
            </h2>
            <div className="space-y-2">
              {modules.map((m, idx) => {
                const Icon = m.icon;
                const isSelected = selectedModule === idx;
                return (
                  <div
                    key={m.title}
                    onClick={() => setSelectedModule(idx)}
                    className={`p-3.5 rounded cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-autoverse-elevated border-autoverse-cyan shadow-sm'
                        : 'bg-autoverse-surface border-autoverse-border hover:border-autoverse-borderLight'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-autoverse-cyan' : 'text-slate-400'}`} />
                      <h3 className="text-xs font-bold text-slate-200">{m.title}</h3>
                    </div>
                    <p className="text-[11px] text-autoverse-muted mt-1.5 leading-relaxed line-clamp-2">
                      {m.summary}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Module Reader */}
          <div className="lg:col-span-2 p-6 rounded bg-autoverse-surface border border-autoverse-border overflow-y-auto">
            <h2 className="text-base font-bold text-slate-100 mb-2">
              {modules[selectedModule].title}
            </h2>
            <p className="text-xs text-autoverse-muted mb-4 pb-3 border-b border-autoverse-border">
              {modules[selectedModule].summary}
            </p>
            <div className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
              {modules[selectedModule].content}
            </div>
          </div>
        </div>
      ) : (
        /* Quiz Section */
        <div className="max-w-3xl mx-auto w-full mt-6 space-y-6">
          <div className="flex items-center justify-between p-4 rounded bg-autoverse-surface border border-autoverse-border">
            <div>
              <h2 className="text-sm font-bold text-slate-100">Automotive Engineering Knowledge Check</h2>
              <p className="text-xs text-autoverse-muted mt-0.5">
                Answer all 4 conceptual questions to test your aerodynamic and CAD understanding.
              </p>
            </div>
            {submittedQuiz && (
              <div className="text-right">
                <span className="text-xs font-mono text-slate-400">Your Score:</span>
                <span className="text-lg font-mono font-bold text-autoverse-cyan block">
                  {calculateScore()} / {QUIZ_QUESTIONS.length}
                </span>
              </div>
            )}
          </div>

          {/* Questions */}
          <div className="space-y-4">
            {QUIZ_QUESTIONS.map(q => {
              const selectedOpt = userAnswers[q.id];
              return (
                <div key={q.id} className="p-5 rounded bg-autoverse-surface border border-autoverse-border space-y-3">
                  <h3 className="text-xs font-bold text-slate-200">
                    Question {q.id}: {q.question}
                  </h3>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isChosen = selectedOpt === optIdx;
                      const isCorrect = q.correctIndex === optIdx;

                      let btnStyle = 'bg-autoverse-elevated/40 border-autoverse-border text-slate-300 hover:bg-autoverse-elevated';
                      if (submittedQuiz) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-950/60 border-emerald-700 text-emerald-200 font-medium';
                        } else if (isChosen && !isCorrect) {
                          btnStyle = 'bg-red-950/60 border-red-700 text-red-200';
                        }
                      } else if (isChosen) {
                        btnStyle = 'bg-autoverse-elevated border-autoverse-cyan text-autoverse-cyan font-semibold';
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`w-full p-3 rounded text-left text-xs transition-colors border flex items-start gap-2.5 ${btnStyle}`}
                        >
                          <span className="font-mono text-slate-500 font-bold shrink-0">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation when submitted */}
                  {submittedQuiz && (
                    <div className="p-3 rounded bg-autoverse-elevated border border-autoverse-border text-[11px] text-slate-300 space-y-1">
                      <span className="font-bold text-autoverse-cyan block">Explanation:</span>
                      <p className="leading-relaxed">{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit / Reset Actions */}
          <div className="pt-2 flex justify-end gap-3">
            {!submittedQuiz ? (
              <button
                onClick={() => setSubmittedQuiz(true)}
                disabled={Object.keys(userAnswers).length < QUIZ_QUESTIONS.length}
                className="px-5 py-2.5 rounded bg-autoverse-cyan hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors disabled:opacity-50"
              >
                Submit Answers
              </button>
            ) : (
              <button
                onClick={() => {
                  setUserAnswers({});
                  setSubmittedQuiz(false);
                }}
                className="px-5 py-2.5 rounded bg-autoverse-elevated hover:bg-autoverse-overlay text-slate-200 border border-autoverse-border font-semibold text-xs transition-colors"
              >
                Retake Quiz
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
