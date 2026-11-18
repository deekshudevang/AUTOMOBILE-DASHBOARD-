import { StationCrossSection, CoachworkDimensions } from '../types';

export const PORSCHE_992_GT3_RS_DIMENSIONS: CoachworkDimensions = {
  overall_length_m: 4.572,
  overall_width_m: 1.900,
  overall_height_m: 1.322,
  wheelbase_m: 2.457,
  front_track_m: 1.630,
  rear_track_m: 1.582,
  ground_clearance_m: 0.100
};

/**
 * 48 authentic longitudinal cross-section stations for the Porsche 911 GT3 RS (992)
 * capturing the iconic teardrop flyline, raised front fender crests, sloping hood,
 * wide rear haunches, and low ground clearance.
 */
export function generatePorsche992Stations(): StationCrossSection[] {
  const stations: StationCrossSection[] = [];
  const numStations = 48;
  const L = 4.572;
  const halfL = L / 2; // 2.286m
  const WB = 2.457;
  const frontAxleZ = WB / 2; // +1.2285m
  const rearAxleZ = -WB / 2; // -1.2285m

  for (let i = 0; i < numStations; i++) {
    const t = i / (numStations - 1); // 0 at front (+2.286), 1 at rear (-2.286)
    const z = halfL - t * L; // +2.286 down to -2.286

    let floorY = 0.10;
    let rockerY = 0.20;
    let beltY = 0.68;
    let roofY = 0.70;
    let halfW = 0.45;
    let flare = 0.0;
    let tumblehome = 0.15;

    // 1. Front Fascia & Splitter Nose (Z from 2.286 to 1.80)
    if (z > 1.80) {
      const u = (z - 1.80) / (halfL - 1.80); // 0 to 1
      halfW = 0.85 * (1 - 0.4 * u);
      floorY = 0.10 + 0.05 * u;
      rockerY = 0.22 + 0.08 * u;
      beltY = 0.65 - 0.12 * u;
      roofY = beltY + 0.05;
      tumblehome = 0.08;
    }
    // 2. Front Hood & Raised Fender Pods (Z from 1.80 to frontAxleZ = 1.2285)
    else if (z > frontAxleZ) {
      const u = (z - frontAxleZ) / (1.80 - frontAxleZ); // 0 to 1
      halfW = 0.92 - 0.07 * u;
      floorY = 0.10;
      rockerY = 0.22;
      beltY = 0.72 - 0.07 * u;
      roofY = 0.78 - 0.08 * u;
      tumblehome = 0.12;
    }
    // 3. A-Pillar Base & Windshield Sweep (Z from 1.2285 to 0.40)
    else if (z > 0.40) {
      const u = (z - 0.40) / (frontAxleZ - 0.40); // 0 to 1 (0 at A-pillar, 1 at axle)
      halfW = 0.94 - 0.02 * u;
      floorY = 0.10;
      rockerY = 0.24;
      beltY = 0.74;
      // Roof ramps up along windshield
      roofY = 1.32 - (1.32 - 0.78) * (u ** 1.3);
      tumblehome = 0.28 * (1 - u);
    }
    // 4. Cabin Crown / Teardrop Flyline Apex (Z from 0.40 to -0.40)
    else if (z > -0.40) {
      const u = (z - (-0.40)) / 0.80; // 0 to 1
      halfW = 0.92;
      floorY = 0.10;
      rockerY = 0.25;
      beltY = 0.74;
      // Maximum roof height at 1.322m near z = 0
      const centerU = (z - 0.0) / 0.40;
      roofY = 1.322 - 0.02 * (centerU ** 2);
      tumblehome = 0.32;
    }
    // 5. Fastback Roofline & Wide Haunch Swell (Z from -0.40 to rearAxleZ = -1.2285)
    else if (z > rearAxleZ) {
      const u = (z - rearAxleZ) / (-0.40 - rearAxleZ); // 0 at rear axle, 1 at mid cabin
      // Rear haunches flare out to 0.95m (1.90m total width)
      halfW = 0.95 - 0.03 * u;
      flare = 0.06 * (1 - u);
      floorY = 0.10;
      rockerY = 0.25;
      beltY = 0.74 - 0.02 * (1 - u);
      // Classic 911 flyline slopes down to 1.10m
      roofY = 1.12 + (1.30 - 1.12) * (u ** 1.2);
      tumblehome = 0.35 - 0.10 * (1 - u);
    }
    // 6. Rear Engine Decklid & Ducktail Base (Z from -1.2285 to -1.90)
    else if (z > -1.90) {
      const u = (z - (-1.90)) / (rearAxleZ - (-1.90)); // 0 to 1
      halfW = 0.93 + 0.02 * u;
      flare = 0.04 * u;
      floorY = 0.11;
      rockerY = 0.26;
      beltY = 0.72 - 0.04 * (1 - u);
      roofY = 0.82 + (1.12 - 0.82) * (u ** 1.1);
      tumblehome = 0.20 * u;
    }
    // 7. Rear Bumper & Diffuser Taper (Z from -1.90 to -2.286)
    else {
      const u = (z - (-halfL)) / (-1.90 - (-halfL)); // 0 at tail (-2.286), 1 at -1.90
      halfW = 0.82 + 0.11 * u;
      floorY = 0.16 - 0.05 * u;
      rockerY = 0.30 - 0.04 * u;
      beltY = 0.65 + 0.03 * u;
      roofY = beltY + 0.06 * u;
      tumblehome = 0.10 * u;
    }

    stations.push({
      station_z_m: Math.round(z * 10000) / 10000,
      width_half_m: Math.round(halfW * 10000) / 10000,
      floor_y_m: Math.round(floorY * 10000) / 10000,
      rocker_y_m: Math.round(rockerY * 10000) / 10000,
      belt_y_m: Math.round(beltY * 10000) / 10000,
      roof_y_m: Math.round(roofY * 10000) / 10000,
      shoulder_flare_m: Math.round(flare * 10000) / 10000,
      tumblehome_m: Math.round(tumblehome * 10000) / 10000
    });
  }

  return stations;
}

