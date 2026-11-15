# AUTOVERSE 3D — JSON to 3D Vehicle & Supercar Configurator

[![WebGL](https://img.shields.io/badge/WebGL-2.0-00F0FF?style=for-the-badge&logo=webgl)](https://www.khronos.org/webgl/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r174-000000?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**AUTOVERSE 3D** is a complete, production-grade automotive 3D visualization and customization platform. It imports multiple vehicle JSON configuration files (specifically Cherax Entity GTA-style configurations and generic automotive specs), interprets their mechanical, cosmetic, and tuning properties, maps them to compatible vehicle 3D assets, and renders interactive, photorealistic 3D vehicles in real time.

---

## 🌟 Key Features

### 1. 🏎️ Complete Automotive 3D Engine
- **Photorealistic PBR Materials**: Metallic clearcoat automotive paints, tinted glass with realistic opacity/IOR, alloy rims, rubber tires, and glowing LEDs.
- **Lighting & Neons**: 4-channel independent underglow neon kit (front, back, left, right) with point lights, ground bounce reflection, and xenon headlights.
- **Camera Presets**: Orbit controls, smooth interpolation for Front, Rear, Left, Right, Top, 3/4 Isometric, Interior Cockpit, and Wheel Stance.
- **Turntable & Wireframe Modes**: 360-degree automatic vehicle rotation and wireframe geometry inspection.
- **High-Res Screenshot Studio**: Direct WebGL buffer capture with metadata and download options.

### 2. 🧠 JSON Intelligence & Catalog Discovery
- **108 Vehicle Configurations**: Automatically scanned, validated, and cataloged.
- **74 Unique Model Archetypes**: 100% reverse-mapped from 32-bit Joaat model hashes to their GTA archetype and real-world manufacturer counterpart (BMW, Porsche, Audi, Lamborghini, Ferrari, Toyota, Nissan, Mercedes-Benz, Koenigsegg, Bentley, etc.).
- **Zero Fabrication Guarantee**: If a 3D asset is not mapped for a specific model hash, the system displays an explicit Missing Asset diagnostic state with an immediate 3D asset importer.
- **Duplicate Detection**: Identifies byte-for-byte identical configurations (e.g. `2F2FSUPRA_Retro_Shade.json` and `lulli.json`).

### 3. 🛠️ Complete Customization Suite
- **Body Paint**: Primary & secondary colors using official 160+ GTA V color palette swatches or custom 24-bit sRGB HEX color pickers, plus pearlescent clearcoat shift.
- **Wheel Engine**: 13 wheel categories (Sport, Muscle, Lowrider, SUV, Offroad, Tuner, High End, Bennys, Open Wheel F1, Track), rim finishes, competition drift tyres (white sidewall lettering), and bulletproof tyres.
- **Tuning Modifications (mod0 to mod49)**: Spoilers, front bumpers, rear diffusers, side skirts, quad titanium exhausts, FIA rollcages, vented hoods, carbon roofs, and racing liveries.
- **Cabin & Extras**: Privacy window tint (None, Stock, Light Smoke, Dark Smoke, Limo, Pure Black, Green), interior leather trim, extra0..extra15 toggles, and customized license plate text & styles.

### 4. 🔄 Two-Way Bi-Directional JSON Synchronizer
- **Live Two-Way Sync**: Changing a slider, swatch, or toggle in 3D updates the JSON editor immediately; typing in the JSON editor immediately re-renders the 3D car in real time without cyclical update loops.
- **Side-by-Side Diff Viewer**: Compare any two vehicle files line-by-line with color-coded additions, deletions, and modifications.

### 5. 👥 Multi-Vehicle Comparison Studio
- Simultaneously render 2 to 4 vehicles side-by-side in synchronized 3D viewports.
- Shared camera angle synchronization and comprehensive specification comparison matrix.

### 6. 📁 Modular Asset Manager
- Drag-and-drop importer for `.glb`, `.gltf`, `.obj`, and `.fbx` models.
- Model-to-Hash binding interface to assign custom 3D models to any vehicle identifier.

### 7. 💾 Export Center & History Stack
- Export modified or original JSON files while strictly preserving unknown properties (`_creatorSignature`, `attachments`, custom flags).
- Batch ZIP fleet download of all 108 vehicle configurations.
- Full undo/redo modification timeline with snapshot restore.

---

## 🚀 Quick Start & Installation

### Requirements
- **Node.js**: v18.0 or higher (v20+ recommended)
- **Modern Browser**: Chrome, Edge, Firefox, or Safari with WebGL 2.0 enabled.
- **Recommended GPU**: NVIDIA GeForce RTX 3060/4060 or equivalent for 60 FPS ultra settings.

### Setup Commands
```bash
# Clone or navigate to the project directory
cd c:\Users\deeks\Downloads\cars

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Run Automated Tests
```bash
npm test
```

### Production Build
```bash
npm run build
npm run preview
```

---

## 📂 Project Directory Structure

```
autoverse-3d/
├── public/
│   ├── vehicle-assets/
│   │   ├── manifest.json         # 3D Asset registry mapping models to paths
│   │   └── cars/                 # Categorized 3D models (bmw, porsche, audi, etc.)
│   └── vehicles/                 # 108 original Cherax Entity vehicle JSON files
├── src/
│   ├── components/
│   │   ├── 3d/                   # Three.js / R3F Canvas, PBR Shaders, Wheel & Neon engines
│   │   ├── sidebar/              # 10-module Unslop dark theme navigation sidebar
│   │   ├── dashboard/            # Fleet analytics, KPI metrics, brand distributions
│   │   ├── library/              # Searchable, filterable vehicle grid and list view
│   │   ├── studio/               # Flagship 3D configurator with camera HUD and presets
│   │   ├── customizer/           # Tabbed customization controls (Paint, Wheels, Aero, Neons, etc.)
│   │   ├── comparison/           # 2-4 synchronized 3D viewports comparison studio
│   │   ├── explorer/             # Two-way synchronized JSON editor & diff comparator
│   │   ├── assetManager/         # GLB/GLTF 3D model importer and hash binder
│   │   ├── history/              # Snapshot timeline and undo/redo manager
│   │   ├── export/               # Single & batch ZIP export center
│   │   └── settings/             # Graphics presets, shadows, and performance diagnostics
│   ├── data/
│   │   ├── vehicleDatabase.json  # Catalog database of 108 files & 74 models
│   │   ├── gtaColorPalette.ts    # Official 160+ GTA V automotive color swatches
│   │   ├── modSlotDefinitions.ts # mod0 to mod49 friendly names and categories
│   │   └── wheelCatalog.ts       # Wheel types, tints, and plate styles
│   ├── hooks/
│   │   ├── useVehicleStore.ts    # Main Zustand store with two-way sync
│   │   └── useComparisonStore.ts # Multi-vehicle comparison studio store
│   ├── types/
│   │   └── vehicle.ts            # Complete TypeScript interface definitions
│   └── utils/
│       ├── joaat.ts              # Jenkins One-At-A-Time hash generator
│       ├── colorUtils.ts         # Color resolution and hex/RGB converters
│       └── jsonParser.ts         # Flexible parser, schema validator, and diff engine
├── Vehicles/                     # Preserved original source vehicle JSON files
├── JSON_SCHEMA_REPORT.md         # In-depth JSON intelligence & property frequency report
├── ARCHITECTURE.md               # Technical architecture and rendering pipeline documentation
├── VEHICLE_ASSET_GUIDE.md        # Asset creation and manifest specification
├── MOD_MAPPING_GUIDE.md          # Complete mod slot (mod0..mod49) documentation
├── INSTALLATION.md               # Complete installation and setup guide
└── TEST_REPORT.md                # Automated test execution and validation report
```

---

## 📜 License
Internal Automotive Visualization Engineering Project.

