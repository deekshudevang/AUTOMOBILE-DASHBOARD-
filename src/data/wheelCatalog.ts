export interface WheelTypeOption {
  id: number;
  name: string;
  category: string;
  description: string;
}

export const WHEEL_TYPES: WheelTypeOption[] = [
  { id: 0, name: "Sport", category: "Sport", description: "Lightweight multi-spoke high performance alloy wheels" },
  { id: 1, name: "Muscle", category: "Muscle", description: "Deep dish steelies, mag 5-spokes, classic muscle wheels" },
  { id: 2, name: "Lowrider", category: "Classic", description: "Chrome multi-wire laced spokes with knockoff center caps" },
  { id: 3, name: "SUV", category: "Truck / SUV", description: "Heavy duty oversized multi-terrain SUV alloys" },
  { id: 4, name: "Offroad", category: "Offroad", description: "Beadlock rugged steel wheels with aggressive mud terrain sidewalls" },
  { id: 5, name: "Tuner", category: "JDM / Tuner", description: "Forged monoblock racing wheels, concave 6-spokes, drift spec" },
  { id: 6, name: "Bike / Motorcycle", category: "Motorcycle", description: "Specialized front/rear motorcycle and trike wheels" },
  { id: 7, name: "High End", category: "Exotic", description: "Diamond cut hypercar forged wheels with carbon composite barrels" },
  { id: 8, name: "Benny's Original", category: "Custom", description: "Lowrider bespoke chrome and gold customized retro rims" },
  { id: 9, name: "Benny's Bespoke", category: "Custom", description: "Exotic deep dish customized multi-piece modular wheels" },
  { id: 10, name: "Open Wheel (F1)", category: "Motorsport", description: "Formula race centerlock forged magnesium racing wheels" },
  { id: 11, name: "Street", category: "Street", description: "Modern tuner street spec wheels with polished stepped lips" },
  { id: 12, name: "Track", category: "Motorsport", description: "FIA GT3 track spec ultra-lightweight forged centerlock wheels" }
];

export interface WindowTintOption {
  id: number;
  name: string;
  opacity: number;
  hex: string;
}

export const WINDOW_TINT_OPTIONS: WindowTintOption[] = [
  { id: 0, name: "None (Clear Glass)", opacity: 0.15, hex: "#A8D8EA" },
  { id: 4, name: "Stock Factory", opacity: 0.35, hex: "#63899E" },
  { id: 3, name: "Light Smoke (35%)", opacity: 0.55, hex: "#3A4F59" },
  { id: 2, name: "Dark Smoke (15%)", opacity: 0.75, hex: "#1C252B" },
  { id: 1, name: "Pure Black (5%)", opacity: 0.90, hex: "#0B0E11" },
  { id: 5, name: "Limo (100% Privacy)", opacity: 0.98, hex: "#040507" },
  { id: 6, name: "Green Endurance Tint", opacity: 0.40, hex: "#2E5D4B" }
];

export interface PlateStyleOption {
  id: number;
  name: string;
  bgColor: string;
  textColor: string;
  borderStyle: string;
}

export const PLATE_STYLES: PlateStyleOption[] = [
  { id: 0, name: "Blue on White 1 (Standard)", bgColor: "#F8FAFC", textColor: "#1E3A8A", borderStyle: "border-blue-700" },
  { id: 1, name: "Yellow on Black", bgColor: "#18181B", textColor: "#EAB308", borderStyle: "border-yellow-500" },
  { id: 2, name: "Yellow on Blue", bgColor: "#1E3A8A", textColor: "#FACC15", borderStyle: "border-yellow-400" },
  { id: 3, name: "Blue on White 2", bgColor: "#F1F5F9", textColor: "#2563EB", borderStyle: "border-blue-500" },
  { id: 4, name: "Blue on White 3", bgColor: "#FFFFFF", textColor: "#1D4ED8", borderStyle: "border-blue-600" },
  { id: 5, name: "North Yankton (Exempt)", bgColor: "#F1E5AC", textColor: "#374151", borderStyle: "border-stone-600" }
];

