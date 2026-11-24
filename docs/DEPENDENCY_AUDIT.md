# AUTOVERSE 3D — Dependency Audit & Tooling Verification

> **Audit Date**: 2026-11-10  
> **Host OS**: Windows 11 (64-bit)  
> **Node.js**: v24.19.0  
> **npm**: v11.4.1  
> **Git**: v2.55.0.windows.3  
> **Target GPU**: NVIDIA GeForce RTX 4060 (8GB VRAM)  

---

## 1. Runtime & Library Dependencies

| Package | Version | Purpose | Offline Safety |
| :--- | :--- | :--- | :--- |
| `react` / `react-dom` | `^18.3.1` | Core UI component framework | Fully Offline |
| `three` | `^0.174.0` | WebGL 3D rendering engine, shaders, geometries | Fully Offline |
| `@react-three/fiber` | `^8.18.0` | Declarative Three.js scene graph for React | Fully Offline |
| `@react-three/drei` | `^9.122.0` | OrbitControls, ContactShadows, Environment shaders | Fully Offline |
| `zustand` | `^5.0.3` | Lightweight, unopinionated reactive state management | Fully Offline |
| `tailwindcss` | `^3.4.17` | Utility-first CSS framework for Unslop design tokens | Fully Offline |
| `lucide-react` | `^0.475.0` | Single-stroke automotive & system icons | Fully Offline |
| `jszip` | `^3.10.1` | In-browser batch ZIP compression for fleet export | Fully Offline |
| `framer-motion` | `^12.4.10` | Restrained UI transitions and tab motion | Fully Offline |
| `clsx` / `tailwind-merge`| `^2.1.1` | Dynamic Tailwind class composition | Fully Offline |

---

## 2. Dev & Test Dependencies

| Tool | Version | Purpose | Status |
| :--- | :--- | :--- | :--- |
| `vite` | `^6.2.0` | Ultra-fast local dev server and Rollup packager | Verified (6.2s build time) |
| `typescript` | `^5.7.3` | Typechecker & compiler (`tsc`) | Verified (0 type errors) |
| `vitest` | `^3.0.7` | Fast local unit & integration test runner | Verified (11/11 tests pass) |
| `postcss` / `autoprefixer` | `^8.5.3` | CSS preprocessing and browser vendor prefixing | Verified |

---

## 3. Offline Architecture Compliance

- **Zero Cloud Dependencies**: The application requires NO external cloud services, telemetry, or remote CDNs after `npm install`.
- **Local Storage / IndexedDB**: User asset bindings and custom models persist locally on the user's workstation.
- **Loopback Backend**: Backend APIs are strictly bound to `127.0.0.1` with SQLite WAL database storage.

