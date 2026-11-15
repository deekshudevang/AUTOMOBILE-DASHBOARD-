# AUTOVERSE 3D — Engineering Decision Log (`docs/DECISIONS.md`)

This log records significant architectural, design, and engineering decisions throughout the AutoVerse 3D development cycle.

---

## Decision 001: Skill Preflight & Design System Fallback
- **Date:** 2026-11-15
- **Status:** Approved
- **Context:** Section 1.4 requires checking for the globally installed `UI/UX Pro Max` skill before Phase 2 and 12. If unavailable, state so honestly in `TASK.md` and apply the automotive design brief directly without claiming fictitious skill usage.
- **Decision:** Confirmed via environment skill inventory that `UI/UX Pro Max` is not installed in the agent environment. Proceeding with direct application of the automotive design system brief (minimalist luxury, deep graphite, electric cyan `#00F0FF` accents, strict WCAG 2.2 AA contrast, engineering monospace tabular metrics, and Unslop standards).
- **Alternatives Considered:**
  1. Fabricate tool invocation (Rejected: violates Section 0 non-negotiable honesty rule).
  2. Block execution (Rejected: prompt explicitly provided a direct fallback instruction).

---

## Decision 002: Golden Fixture Baseline Protection
- **Date:** 2026-11-15
- **Status:** Approved
- **Context:** Section 1.1 Non-negotiable 1 mandates that existing vehicle JSON files and backwards compatibility be preserved.
- **Decision:** Copied all 109 legacy vehicle configurations into `tests/fixtures/vehicles/`. Created automated test validation ensuring all golden fixtures parse and load without regressions.
- **Alternatives Considered:**
  1. Overwrite legacy files with Schema 2.0 (Rejected: destroys backward-compatibility).
  2. Maintain separate incompatible loaders (Rejected: unified loader with schemaVersion detection is cleaner and more maintainable).

---

## Decision 003: Single Source of Truth Configuration State & Command Pattern
- **Date:** 2026-11-15
- **Status:** Approved
- **Context:** Phase 3 requires that the scene be a pure function of `(vehicle definition, configuration)` with a serializable `VehicleConfiguration` object and command-based edits so undo/redo, save, export, and slider coalescing work seamlessly.
- **Decision:** Implemented a unified Zustand configuration state that processes updates through command dispatches, coalesces slider drags into single history entries, and separates UI transient state (camera preset, drawer open, active tab) from 3D vehicle configuration.
- **Alternatives Considered:**
  1. Component-local React state (Rejected: causes desynchronization between 3D canvas and inspector).
  2. Direct Three.js mesh mutation without state backing (Rejected: prevents serialization, undo/redo, and comparison).
