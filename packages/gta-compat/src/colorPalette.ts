import { RGBColor } from '@autoverse/shared-types';

export interface GTAColorDefinition {
  id: number;
  name: string;
  category: 'Metallic' | 'Matte' | 'Util' | 'Worn' | 'Chameleon' | 'Pearlescent' | 'Chrome' | 'Classic';
  hex: string;
  roughness: number;
  metalness: number;
  clearcoat: number;
}

export const OFFICIAL_GTA_PALETTE: GTAColorDefinition[] = [
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
  { id: 27, name: "Metallic Red", category: "Metallic", hex: "#C00E1A", roughness: 0.2, metalness: 0.85, clearcoat: 0.95 },
  { id: 28, name: "Metallic Torino Red", category: "Metallic", hex: "#DA1918", roughness: 0.18, metalness: 0.88, clearcoat: 0.95 },
  { id: 29, name: "Metallic Formula Red", category: "Metallic", hex: "#B6110B", roughness: 0.18, metalness: 0.88, clearcoat: 0.95 },
  { id: 30, name: "Metallic Blaze Red", category: "Metallic", hex: "#A51E23", roughness: 0.2, metalness: 0.85, clearcoat: 0.95 },
  { id: 35, name: "Metallic Candy Red", category: "Metallic", hex: "#B60F1B", roughness: 0.18, metalness: 0.9, clearcoat: 0.98 },
  { id: 38, name: "Metallic Orange", category: "Metallic", hex: "#F78616", roughness: 0.2, metalness: 0.85, clearcoat: 0.95 },
  { id: 49, name: "Metallic Dark Green", category: "Metallic", hex: "#132428", roughness: 0.25, metalness: 0.85, clearcoat: 0.9 },
  { id: 50, name: "Metallic Racing Green", category: "Metallic", hex: "#122E2B", roughness: 0.2, metalness: 0.85, clearcoat: 0.95 },
  { id: 53, name: "Metallic Bright Green", category: "Metallic", hex: "#155C2D", roughness: 0.2, metalness: 0.85, clearcoat: 0.95 },
  { id: 55, name: "Matte Lime Green", category: "Matte", hex: "#66B233", roughness: 0.85, metalness: 0.1, clearcoat: 0.0 },
  { id: 62, name: "Metallic Dark Blue", category: "Metallic", hex: "#1F283E", roughness: 0.2, metalness: 0.88, clearcoat: 0.95 },
  { id: 64, name: "Metallic Blue", category: "Metallic", hex: "#395A83", roughness: 0.2, metalness: 0.85, clearcoat: 0.95 },
  { id: 70, name: "Metallic Bright Blue", category: "Metallic", hex: "#0057A6", roughness: 0.18, metalness: 0.88, clearcoat: 0.95 },
  { id: 73, name: "Metallic Ultra Blue", category: "Metallic", hex: "#2356A7", roughness: 0.18, metalness: 0.88, clearcoat: 0.98 },
  { id: 88, name: "Metallic Yellow", category: "Metallic", hex: "#FFC700", roughness: 0.18, metalness: 0.85, clearcoat: 0.95 },
  { id: 89, name: "Metallic Race Yellow", category: "Metallic", hex: "#FFAE00", roughness: 0.18, metalness: 0.85, clearcoat: 0.95 },
  { id: 111, name: "Metallic Frost White", category: "Metallic", hex: "#F0F0F0", roughness: 0.18, metalness: 0.85, clearcoat: 0.95 },
  { id: 112, name: "Metallic Ice White", category: "Metallic", hex: "#FFFFFF", roughness: 0.15, metalness: 0.85, clearcoat: 0.98 },
  { id: 120, name: "Chrome", category: "Chrome", hex: "#E8E8E8", roughness: 0.05, metalness: 0.98, clearcoat: 1.0 },
  { id: 135, name: "Hot Pink", category: "Metallic", hex: "#F21F90", roughness: 0.18, metalness: 0.85, clearcoat: 0.98 },
  { id: 140, name: "Bright Blue", category: "Metallic", hex: "#00A6FF", roughness: 0.18, metalness: 0.88, clearcoat: 0.98 },
  { id: 145, name: "Metallic Purple", category: "Metallic", hex: "#621276", roughness: 0.2, metalness: 0.85, clearcoat: 0.95 },
  { id: 156, name: "Alloy Steel", category: "Metallic", hex: "#5A5A5A", roughness: 0.3, metalness: 0.8, clearcoat: 0.8 },
  { id: 161, name: "Carbon Black", category: "Metallic", hex: "#15181C", roughness: 0.25, metalness: 0.85, clearcoat: 0.9 }
];

export function lookupGTAColor(id: number): GTAColorDefinition {
  const found = OFFICIAL_GTA_PALETTE.find(c => c.id === id);
  if (found) return found;
  return {
    id,
    name: `GTA Color #${id}`,
    category: "Metallic",
    hex: "#202530",
    roughness: 0.25,
    metalness: 0.85,
    clearcoat: 0.85
  };
}

