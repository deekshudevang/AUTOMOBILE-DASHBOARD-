# AutoVerse — Security & Data Protection Policy (`SECURITY.md`)

---

## 1. Untrusted Asset & Geometry Ingestion

AutoVerse treats all imported 3D models (STEP, STL, OBJ, GLB) and project JSON packages as **untrusted input**.

### 1.1 Input Sanitization Rules (`src/security/sanitizer.ts`)
1. **Path Traversal Prevention:** Blocks all directory traversal patterns (`../`, `..\`), absolute drive letters (`C:\`), root roots (`/etc`), and null bytes (`\0`).
2. **Payload Size Ceilings:**
   - Project JSON packages: Maximum **25 MB**.
   - Mesh / CAD geometry files: Maximum **100 MB**.
3. **Executable File Rejection:** Forbids upload of executable or script files (`.exe`, `.bat`, `.cmd`, `.sh`, `.ps1`, `.py`, `.js`, etc.).
4. **Shell Injection Prevention:** OpenFOAM case parameters are strictly validated against numeric and alphanumeric regex templates (`/^[a-zA-Z0-9_\.\-\+\s\(\)]+$/`). Unvalidated interpolation into shell commands or dictionary files is prohibited.

---

## 2. Solver Sandboxing & Resource Limits

1. **Thread Capping:** Solver processes are clamped to **12 threads** to protect host OS stability.
2. **Memory Capping:** Container memory allocation is capped at **10.0 GB**.
3. **Non-Root Execution:** OpenFOAM workers execute as non-privileged non-root users inside isolated container boundaries with disabled network access.
