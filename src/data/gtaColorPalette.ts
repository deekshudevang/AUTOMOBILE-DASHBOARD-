export interface GTAColorDef {
  id: number;
  name: string;
  category: 'Metallic' | 'Matte' | 'Util' | 'Worn' | 'Chameleon' | 'Pearlescent' | 'Chrome' | 'Classic';
  hex: string;
  roughness: number;
  metalness: number;
  clearcoat: number;
}

export const GTA_COLOR_PALETTE: GTAColorDef[] = [
  { id: 0, name: "Metallic Black", category: "Metallic", hex: "#0D1116", roughness: 0.2, metalness: 0.9, clearcoat: 0.9 },
  { id: 1, name: "Metallic Graphite Black", category: "Metallic", hex: "#1C1D21", roughness: 0.25, metalness: 0.85, clearcoat: 0.85 },
  { id: 2, name: "Metallic Black Steel", category: "Metallic", hex: "#32383E", roughness: 0.25, metalness: 0.85, clearcoat: 0.85 },
  { id: 3, name: "Metallic Dark Silver", category: "Metallic", hex: "#454B4F", roughness: 0.25, metalness: 0.8, clearcoat: 0.8 },
  { id: 4, name: "Metallic Silver", category: "Metallic", hex: "#999DA0", roughness: 0.2, metalness: 0.85, clearcoat: 0.9 },
  { id: 5, name: "Metallic Blue Silver", category: "Metallic", hex: "#C2C4C6", roughness: 0.2, metalness: 0.85, clearcoat: 0.9 },
  { id: 6, name: "Metallic Steel Gray", category: "Metallic", hex: "#979A97", roughness: 0.25, metalness: 0.8, clearcoat: 0.85 },
  { id: 7, name: "Metallic Shadow Silver", category: "Metallic", hex: "#637380", roughness: 0.25, metalness: 0.8, clearcoat: 0.85 },
  { id: 8, name: "Metallic Stone Silver", category: "Metallic", hex: "#63625C", roughness: 0.25, metalness: 0.8, clearcoat: 0.85 },
  { id: 9, name: "Metallic Midnight Silver", category: "Metallic", hex: "#3C3F47", roughness: 0.22, metalness: 0.85, clearcoat: 0.85 },
  { id: 10, name: "Metallic Gun Metal", category: "Metallic", hex: "#444E54", roughness: 0.25, metalness: 0.8, clearcoat: 0.85 },
  { id: 11, name: "Metallic Anthracite Gray", category: "Metallic", hex: "#1D2129", roughness: 0.22, metalness: 0.85, clearcoat: 0.9 },
  { id: 12, name: "Matte Black", category: "Matte", hex: "#131518", roughness: 0.85, metalness: 0.1, clearcoat: 0.0 },
  { id: 13, name: "Matte Gray", category: "Matte", hex: "#26282A", roughness: 0.85, metalness: 0.1, clearcoat: 0.0 },
  { id: 14, name: "Matte Light Gray", category: "Matte", hex: "#515554", roughness: 0.85, metalness: 0.1, clearcoat: 0.0 },
  { id: 15, name: "Util Black", category: "Util", hex: "#15191E", roughness: 0.6, metalness: 0.3, clearcoat: 0.2 },
  { id: 16, name: "Util Black Poly", category: "Util", hex: "#1E2429", roughness: 0.6, metalness: 0.3, clearcoat: 0.2 },
  { id: 27, name: "Metallic Red", category: "Metallic", hex: "#C00E1A", roughness: 0.2, metalness: 0.85, clearcoat: 0.95 },
  { id: 28, name: "Metallic Torino Red", category: "Metallic", hex: "#DA1918", roughness: 0.18, metalness: 0.88, clearcoat: 0.95 },
  { id: 29, name: "Metallic Formula Red", category: "Metallic", hex: "#B6110B", roughness: 0.18, metalness: 0.88, clearcoat: 0.95 },
  { id: 30, name: "Metallic Blaze Red", category: "Metallic", hex: "#A51E23", roughness: 0.2, metalness: 0.85, clearcoat: 0.95 },
  { id: 31, name: "Metallic Graceful Red", category: "Metallic", hex: "#7B1A22", roughness: 0.22, metalness: 0.85, clearcoat: 0.9 },
  { id: 32, name: "Metallic Garnet Red", category: "Metallic", hex: "#8E1B1F", roughness: 0.22, metalness: 0.85, clearcoat: 0.9 },
  { id: 33, name: "Metallic Desert Red", category: "Metallic", hex: "#6F1818", roughness: 0.25, metalness: 0.8, clearcoat: 0.85 },
  { id: 34, name: "Metallic Cabernet Red", category: "Metallic", hex: "#49111D", roughness: 0.22, metalness: 0.85, clearcoat: 0.9 },
  { id: 35, name: "Metallic Candy Red", category: "Metallic", hex: "#B60F1B", roughness: 0.18, metalness: 0.9, clearcoat: 0.98 },
  { id: 36, name: "Metallic Sunrise Orange", category: "Metallic", hex: "#D44A17", roughness: 0.2, metalness: 0.85, clearcoat: 0.95 },
  { id: 37, name: "Metallic Classic Gold", category: "Metallic", hex: "#C2944F", roughness: 0.2, metalness: 0.9, clearcoat: 0.9 },
  { id: 38, name: "Metallic Orange", category: "Metallic", hex: "#F78616", roughness: 0.2, metalness: 0.85, clearcoat: 0.95 },
  { id: 39, name: "Matte Red", category: "Matte", hex: "#CF1F1F", roughness: 0.85, metalness: 0.1, clearcoat: 0.0 },
  { id: 40, name: "Matte Dark Red", category: "Matte", hex: "#732021", roughness: 0.85, metalness: 0.1, clearcoat: 0.0 },
  { id: 41, name: "Matte Orange", category: "Matte", hex: "#F27D16", roughness: 0.85, metalness: 0.1, clearcoat: 0.0 },
  { id: 42, name: "Matte Yellow", category: "Matte", hex: "#FFC91E", roughness: 0.85, metalness: 0.1, clearcoat: 0.0 },
  { id: 49, name: "Metallic Dark Green", category: "Metallic", hex: "#132428", roughness: 0.25, metalness: 0.85, clearcoat: 0.9 },
  { id: 50, name: "Metallic Racing Green", category: "Metallic", hex: "#122E2B", roughness: 0.2, metalness: 0.85, clearcoat: 0.95 },
  { id: 51, name: "Metallic Sea Green", category: "Metallic", hex: "#12383C", roughness: 0.22, metalness: 0.85, clearcoat: 0.9 },
  { id: 52, name: "Metallic Olive Green", category: "Metallic", hex: "#31423F", roughness: 0.25, metalness: 0.8, clearcoat: 0.85 },
  { id: 53, name: "Metallic Bright Green", category: "Metallic", hex: "#155C2D", roughness: 0.2, metalness: 0.85, clearcoat: 0.95 },
  { id: 54, name: "Metallic Gasoline Blue Green", category: "Metallic", hex: "#1B6770", roughness: 0.2, metalness: 0.85, clearcoat: 0.95 },
  { id: 55, name: "Matte Lime Green", category: "Matte", hex: "#66B233", roughness: 0.85, metalness: 0.1, clearcoat: 0.0 },
  { id: 56, name: "Util Dark Green", category: "Util", hex: "#223832", roughness: 0.6, metalness: 0.3, clearcoat: 0.2 },
  { id: 59, name: "Worn Green", category: "Worn", hex: "#2D423F", roughness: 0.7, metalness: 0.2, clearcoat: 0.1 },
  { id: 60, name: "Worn Sea Wash", category: "Worn", hex: "#45595B", roughness: 0.7, metalness: 0.2, clearcoat: 0.1 },
  { id: 61, name: "Metallic Galaxy Blue", category: "Metallic", hex: "#22384E", roughness: 0.2, metalness: 0.88, clearcoat: 0.95 },
  { id: 62, name: "Metallic Dark Blue", category: "Metallic", hex: "#1F283E", roughness: 0.2, metalness: 0.88, clearcoat: 0.95 },
  { id: 63, name: "Metallic Saxon Blue", category: "Metallic", hex: "#2B506E", roughness: 0.22, metalness: 0.85, clearcoat: 0.9 },
  { id: 64, name: "Metallic Blue", category: "Metallic", hex: "#395A83", roughness: 0.2, metalness: 0.85, clearcoat: 0.95 },
  { id: 65, name: "Metallic Mariner Blue", category: "Metallic", hex: "#577B9D", roughness: 0.2, metalness: 0.85, clearcoat: 0.95 },
  { id: 66, name: "Metallic Harbor Blue", category: "Metallic", hex: "#3E4D5E", roughness: 0.22, metalness: 0.85, clearcoat: 0.9 },
  { id: 67, name: "Metallic Diamond Blue", category: "Metallic", hex: "#BEE0E7", roughness: 0.18, metalness: 0.9, clearcoat: 0.98 },
  { id: 68, name: "Metallic Surf Blue", category: "Metallic", hex: "#4A7B92", roughness: 0.2, metalness: 0.85, clearcoat: 0.95 },
  { id: 69, name: "Metallic Nautical Blue", category: "Metallic", hex: "#425E75", roughness: 0.22, metalness: 0.85, clearcoat: 0.9 },
  { id: 70, name: "Metallic Bright Blue", category: "Metallic", hex: "#0057A6", roughness: 0.18, metalness: 0.88, clearcoat: 0.95 },
  { id: 71, name: "Metallic Purple Blue", category: "Metallic", hex: "#363B6D", roughness: 0.2, metalness: 0.88, clearcoat: 0.95 },
  { id: 72, name: "Metallic Spinnaker Blue", category: "Metallic", hex: "#2F3C53", roughness: 0.22, metalness: 0.85, clearcoat: 0.9 },
  { id: 73, name: "Metallic Ultra Blue", category: "Metallic", hex: "#2356A7", roughness: 0.18, metalness: 0.88, clearcoat: 0.98 },
  { id: 74, name: "Metallic Bright Blue Light", category: "Metallic", hex: "#3261A8", roughness: 0.18, metalness: 0.88, clearcoat: 0.98 },
  { id: 82, name: "Matte Dark Blue", category: "Matte", hex: "#1E2D40", roughness: 0.85, metalness: 0.1, clearcoat: 0.0 },
  { id: 83, name: "Matte Desert Tan", category: "Matte", hex: "#A1927F", roughness: 0.85, metalness: 0.1, clearcoat: 0.0 },
  { id: 84, name: "Matte Foliage Green", category: "Matte", hex: "#4D5647", roughness: 0.85, metalness: 0.1, clearcoat: 0.0 },
  { id: 87, name: "Metallic Champagne", category: "Metallic", hex: "#9B8B79", roughness: 0.2, metalness: 0.85, clearcoat: 0.9 },
  { id: 88, name: "Metallic Yellow", category: "Metallic", hex: "#FFC700", roughness: 0.18, metalness: 0.85, clearcoat: 0.95 },
  { id: 89, name: "Metallic Race Yellow", category: "Metallic", hex: "#FFAE00", roughness: 0.18, metalness: 0.85, clearcoat: 0.95 },
  { id: 91, name: "Metallic Fluorescent Yellow", category: "Metallic", hex: "#E0E13D", roughness: 0.18, metalness: 0.85, clearcoat: 0.98 },
  { id: 92, name: "Metallic Lime", category: "Metallic", hex: "#98D22C", roughness: 0.2, metalness: 0.85, clearcoat: 0.95 },
  { id: 106, name: "Metallic Sun Bleeched Brown", category: "Metallic", hex: "#624428", roughness: 0.25, metalness: 0.8, clearcoat: 0.85 },
  { id: 107, name: "Metallic Straw Brown", category: "Metallic", hex: "#837361", roughness: 0.25, metalness: 0.8, clearcoat: 0.85 },
  { id: 111, name: "Metallic Frost White", category: "Metallic", hex: "#F0F0F0", roughness: 0.18, metalness: 0.85, clearcoat: 0.95 },
  { id: 112, name: "Metallic Ice White", category: "Metallic", hex: "#FFFFFF", roughness: 0.15, metalness: 0.85, clearcoat: 0.98 },
  { id: 120, name: "Chrome", category: "Chrome", hex: "#E8E8E8", roughness: 0.05, metalness: 0.98, clearcoat: 1.0 },
  { id: 131, name: "Matte White", category: "Matte", hex: "#EDEDED", roughness: 0.85, metalness: 0.1, clearcoat: 0.0 },
  { id: 132, name: "Matte Frost White", category: "Matte", hex: "#DCDCDC", roughness: 0.85, metalness: 0.1, clearcoat: 0.0 },
  { id: 134, name: "Metallic Pure Gold", category: "Metallic", hex: "#FFC843", roughness: 0.15, metalness: 0.95, clearcoat: 0.98 },
  { id: 135, name: "Hot Pink", category: "Metallic", hex: "#F21F90", roughness: 0.18, metalness: 0.85, clearcoat: 0.98 },
  { id: 136, name: "Salmon Pink", category: "Metallic", hex: "#FDD6CD", roughness: 0.2, metalness: 0.8, clearcoat: 0.9 },
  { id: 137, name: "Pfister Pink", category: "Metallic", hex: "#DF5891", roughness: 0.18, metalness: 0.85, clearcoat: 0.95 },
  { id: 140, name: "Bright Blue", category: "Metallic", hex: "#00A6FF", roughness: 0.18, metalness: 0.88, clearcoat: 0.98 },
  { id: 141, name: "Midnight Blue", category: "Metallic", hex: "#0E1628", roughness: 0.22, metalness: 0.88, clearcoat: 0.95 },
  { id: 145, name: "Metallic Purple", category: "Metallic", hex: "#621276", roughness: 0.2, metalness: 0.85, clearcoat: 0.95 },
  { id: 148, name: "Matte Violet", category: "Matte", hex: "#6B1F7B", roughness: 0.85, metalness: 0.1, clearcoat: 0.0 },
  { id: 149, name: "Matte Deep Purple", category: "Matte", hex: "#1E1D32", roughness: 0.85, metalness: 0.1, clearcoat: 0.0 },
  { id: 156, name: "Alloy Steel", category: "Metallic", hex: "#5A5A5A", roughness: 0.3, metalness: 0.8, clearcoat: 0.8 },
  { id: 158, name: "Pure Gold Satin", category: "Metallic", hex: "#D4AF37", roughness: 0.25, metalness: 0.92, clearcoat: 0.85 },
  { id: 159, name: "Brushed Gold", category: "Metallic", hex: "#AA7A1E", roughness: 0.35, metalness: 0.9, clearcoat: 0.7 },
  { id: 160, name: "Brushed Aluminum", category: "Metallic", hex: "#8A949E", roughness: 0.3, metalness: 0.85, clearcoat: 0.75 },
  { id: 161, name: "Carbon Black", category: "Metallic", hex: "#15181C", roughness: 0.25, metalness: 0.85, clearcoat: 0.9 }
];

export function getGTAColor(id: number): GTAColorDef {
  const found = GTA_COLOR_PALETTE.find(c => c.id === id);
  if (found) return found;
  // Fallback for unlisted IDs: derive deterministic tone or default to metallic dark
  return {
    id,
    name: `Palette Color #${id}`,
    category: "Metallic",
    hex: "#222730",
    roughness: 0.25,
    metalness: 0.8,
    clearcoat: 0.85
  };
}

