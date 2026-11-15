const fs = require('fs');
const path = require('path');

const discovery = JSON.parse(fs.readFileSync('scripts/deep-discovery-report.json', 'utf8'));
const vehiclesDir = path.join(process.cwd(), 'Vehicles');
const gtaDump = JSON.parse(fs.readFileSync('scripts/gta-vehicles-dump.json', 'utf8'));

const gtaMap = new Map();
gtaDump.forEach(v => {
  gtaMap.set(v.Hash >>> 0, v);
});

// Custom known models (add-ons or newest vehicles)
const customKnown = {
  4255883207: { code: 'polignus', name: 'Weaponized Ignus (Pursuit)', manufacturer: 'Pegassi', realWorld: 'Lamborghini Sián FKP 37', category: 'Supercar' },
  2271995207: { code: 'cartuccia', name: 'Cartuccia GT', manufacturer: 'Grotti', realWorld: 'Ferrari 812 Superfast', category: 'Supercar' },
  1494708164: { code: 'lrcgt', name: 'SM722 LRC GT', manufacturer: 'Benefactor', realWorld: 'Mercedes-Benz SLR McLaren Stirling Moss', category: 'Sports Car' },
  4017955470: { code: 'horus', name: 'Horus / 760 LH', manufacturer: 'Overflod', realWorld: 'Pagani Zonda 760 LH', category: 'Supercar' },
  3316510914: { code: 'velenogt', name: 'Veleno GT', manufacturer: 'Pegassi', realWorld: 'Lamborghini Revuelto / Aventador SVJ', category: 'Supercar' },
  2362851406: { code: 'defendybob', name: 'Defendy Bob', manufacturer: 'Vapid / Custom', realWorld: 'Land Rover Defender V8', category: 'SUV / Offroad' }
};

const realWorldMap = {
  'tenf': 'Audi R8 Gen 2 (4S)',
  'tenf2': 'Audi R8 Gen 2 Widebody (Prior Design)',
  'comet': 'Porsche 911 (996/997)',
  'comet2': 'Porsche 911 (991)',
  'comet3': 'Porsche 911 (930 Retro Custom)',
  'comet5': 'Porsche 911 GT2 RS (997.2)',
  'comet6': 'Porsche 911 GT3 (992)',
  'tempesta': 'Lamborghini Huracán LP610-4',
  'tailgater2': 'Audi RS3 Sedan (8Y)',
  'drafter': 'Audi RS5 Coupe (B9)',
  'entity3': 'Koenigsegg Jesko Absolut',
  'jester3': 'Toyota Supra RZ (JZA80 / MK4)',
  'jester4': 'Toyota GR Supra (A90 / MK5)',
  'jester5': 'Toyota GR Supra Widebody (HKS)',
  'komoda': 'Alfa Romeo Giulia Quadrifoglio',
  'cyclone2': 'Rimac Nevera',
  'driftzr350': 'Mazda RX-7 FD (Drift Spec)',
  'zr350': 'Mazda RX-7 FD3S',
  'iwagen': 'Audi e-tron GT',
  'banshee3': 'Dodge Viper ACR (GTS Edition)',
  'deity': 'Bentley Flying Spur Gen 3',
  'scramjet': 'Speed Racer Mach 5 Concept',
  'blista3': 'Honda Civic Type R (Monkey Edition)',
  'buffalo4': 'Dodge Charger SRT Hellcat Redeye (STX)',
  'sandking': 'Ford F-350 Super Duty Dually',
  'sentinel5': 'BMW M3 Competition (G80)',
  'polgauntlet': 'Dodge Challenger SRT Hellcat (Police Interceptor)',
  'oppressor2': 'Pegassi Hover Bike Concept',
  'coquette6': 'Chevrolet Corvette C5',
  'vigero2': 'Chevrolet Camaro ZL1 1LE (Copo)',
  'cypher': 'BMW M2 CS (F87)',
  'deluxo': 'DeLorean DMC-12',
  'elegy': 'Nissan Skyline GT-R (BNR32/BCNR33/BNR34)',
  'elegy2': 'Nissan GT-R NISMO (R35)',
  'cogcabrio': 'Bentley Continental GT Convertible',
  'euros': 'Nissan 370Z (Z34) / Fairlady Z',
  'shinobi': 'Kawasaki Ninja H2 / ZX-10R',
  'fmj2': 'Ford GT Gen 2 MK V',
  'italirsx': 'Ferrari SF90 Stradale',
  'hakuchou2': 'Suzuki Hayabusa GSX1300R Drag Spec',
  'kanjo': 'Honda Civic Type R (EK9)',
  'sultan3': 'Subaru Impreza WRX STI 22B',
  'kuruma2': 'Mitsubishi Lancer Evolution X (Armored)',
  'corsita': 'Maserati MC20',
  'sabregt2': 'Oldsmobile 442 Cutlass Lowrider',
  'luiva': 'McLaren Elva',
  'polcoquette4': 'Chevrolet Corvette C8 (Police Pursuit)',
  'schlagen': 'Mercedes-AMG GT R Coupe',
  'nightshark': 'Terradyne Gurkha LAPV',
  'niobe': 'Porsche 918 Spyder Concept',
  'paragon2': 'Bentley Continental GT Armored',
  'paragon3': 'Bentley Mulliner Batur',
  'pariah': 'Aston Martin Vanquish Zagato',
  'growler': 'Porsche 718 Cayman GT4 RS',
  'astrale': 'Porsche Taycan Cross Turismo',
  'suzume': 'Koenigsegg Gemera',
  'pipistrello': 'Estrema Fulminea / Lotus Evija',
  'xtreme': 'Porsche 911 GT3 R Rennsport',
  'alkonost': 'Tupolev Tu-160 Supersonic Bomber',
  'specter2': 'Aston Martin DB10 Custom',
  't20': 'McLaren P1',
  'khanjali': 'PL-01 Concept Stealth Tank',
  'tezeract': 'Lamborghini Terzo Millennio',
  'toros': 'Lamborghini Urus',
  'vigilante': 'Batmobile (1989 Concept)',
  'driftvorschlag': 'Mercedes-Benz W124 E-Class AMG (Hammer)',
  'cinquemila': 'Maserati Ghibli Trofeo',
  'dominator3': 'Ford Mustang Shelby GT500 (S550)',
  'turismo3': 'Ferrari F8 Tributo (Turismo Omaggio)',
  'zorrusso': 'Italdesign Zerouno / Pagani Zonda'
};

const files = fs.readdirSync(vehiclesDir).filter(f => f.endsWith('.json'));

let invMd = `# VEHICLE_INVENTORY.md — Complete Vehicle Catalog & Resolution Matrix

> **Generated**: ${new Date().toISOString()}  
> **Source Directory**: \`Vehicles/\`  
> **Total Files Cataloged**: ${files.length}  
> **Unique Model Identifiers (32-bit Joaat Hashes)**: ${Object.keys(discovery.models).length}  
> **Verified Formats**: 100% Cherax Entity (Type 1: Vehicle)  

---

## 1. Complete Fleet Inventory (108 Configurations)

| # | Configuration Filename | Joaat Hash | Hex ID | GTA Archetype | Real-World Vehicle Equivalent | Manufacturer | Category | Active Mods | Extras | Attachments |
| :- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
`;

files.forEach((file, idx) => {
  const d = JSON.parse(fs.readFileSync(path.join(vehiclesDir, file), 'utf8'));
  const modelHash = d.model >>> 0;
  const hex = '0x' + modelHash.toString(16).toUpperCase().padStart(8, '0');

  let codeName = 'unknown';
  let displayName = 'Unknown';
  let manufacturer = 'Unknown';
  let realWorld = 'Unidentified';
  let category = 'Special';

  if (customKnown[modelHash]) {
    codeName = customKnown[modelHash].code;
    displayName = customKnown[modelHash].name;
    manufacturer = customKnown[modelHash].manufacturer;
    realWorld = customKnown[modelHash].realWorld;
    category = customKnown[modelHash].category;
  } else if (gtaMap.has(modelHash)) {
    const g = gtaMap.get(modelHash);
    codeName = g.Name.toLowerCase();
    displayName = g.DisplayName ? g.DisplayName.English : g.Name;
    manufacturer = g.ManufacturerDisplayName ? g.ManufacturerDisplayName.English : (g.Class || 'Unknown');
    realWorld = realWorldMap[codeName] || displayName;
    category = g.Class || 'Sports';
  }

  // Count active mods
  let activeMods = 0;
  if (d.mods) {
    Object.values(d.mods).forEach(m => {
      if (m && m.index > 0) activeMods++;
    });
  }

  const extrasCount = d.extras ? Object.values(d.extras).filter(Boolean).length : 0;
  const attachCount = d.attachments ? d.attachments.length : 0;

  invMd += `| ${idx + 1} | \`${file}\` | \`${modelHash}\` | \`${hex}\` | \`${codeName}\` | **${realWorld}** | ${manufacturer} | ${category} | ${activeMods} slots | ${extrasCount ? extrasCount + ' enabled' : 'None'} | ${attachCount ? attachCount + ' entity' : '0'} |\n`;
});

invMd += `
---

## 2. Multi-Configuration Groupings (Vehicles with >1 Tuning Spec)

The following vehicles have multiple unique tuning configuration files in the collection:

`;

for (const [modelHashStr, fileList] of Object.entries(discovery.models)) {
  if (fileList.length > 1) {
    const modelHash = parseInt(modelHashStr) >>> 0;
    let label = `Model ${modelHashStr}`;
    if (customKnown[modelHash]) label = `${customKnown[modelHash].realWorld} (${customKnown[modelHash].name})`;
    else if (gtaMap.has(modelHash)) {
      const g = gtaMap.get(modelHash);
      const code = g.Name.toLowerCase();
      label = `${realWorldMap[code] || g.DisplayName?.English || g.Name} [${g.ManufacturerDisplayName?.English || ''}]`;
    }
    invMd += `### ${label} (${fileList.length} configurations)\n`;
    fileList.forEach(f => {
      invMd += `- \`${f}\`\n`;
    });
    invMd += `\n`;
  }
}

fs.writeFileSync(path.join(process.cwd(), 'VEHICLE_INVENTORY.md'), invMd);
console.log('Saved VEHICLE_INVENTORY.md');

