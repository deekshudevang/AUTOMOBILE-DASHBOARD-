const fs = require('fs');
const path = require('path');

function joaat(key) {
  key = key.toLowerCase();
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash += key.charCodeAt(i);
    hash += (hash << 10);
    hash ^= (hash >>> 6);
  }
  hash += (hash << 3);
  hash ^= (hash >>> 11);
  hash += (hash << 15);
  return hash >>> 0;
}

const gtaVehicles = [
  'tenf', 'tenf2', 'comet', 'comet2', 'comet3', 'comet4', 'comet6', 'comet7',
  'tempesta', 'tailgater', 'tailgater2', 'drafter', 'zeno', 'entity', 'entity2', 'entity3',
  'jester', 'jester2', 'jester3', 'jester4', 'zorrusso', 'osiris', 'veleno', 'corsita',
  'giulia', 'cyclone', 'cyclone2', 'zr350', 'rx7', 'banshee', 'banshee2',
  'sm722', 'stirlinggt', 'schlagen', 'bentley', 'windsor', 'windsor2', 'scramjet', 'blista',
  'blista2', 'blista3', 'buffalo', 'buffalo2', 'buffalo3', 'buffalo4', 'sentinel', 'sentinel2',
  'sentinel3', 'sentinel4', 'gauntlet', 'gauntlet2', 'gauntlet3', 'gauntlet4', 'oppressor',
  'oppressor2', 'c6', 'corvette', 'coquette', 'coquette2', 'coquette3', 'coquette4',
  'carbonizzare', 'f80', 'turismo2', 'turismor', 'italirsx', 'italigto', 'cypher', 'm2',
  'm3', 'm4', 'm5', 'deluxo', 'elegy', 'elegy2', 'enus', 'deity', 'jubilee', 'euros',
  'euros2', 'fmj', 'gtr', 'hakuchou', 'hakuchou2', 'kanjo', 'kanjosj', 'sultan', 'sultan2',
  'sultan3', 'kuruma', 'kuruma2', 'pariah', 'growler', 'astron', 'astron2', 'pipistrello',
  'ignus', 'wignus', 'specter', 'specter2', 't20', 'tezeract', 'toros', 'w124', 'cinquemila',
  'pr4', 'br8', 'r88', 'emerus', 'krieger', 'thrax', 'deveste', 'vagner', 'xa21', 'nero',
  'nero2', 'chiron', 'veyron', 'reaper', 'infernus', 'infernus2', 'vacca', 'bullet', 'cheetah',
  'cheetah2', 'turismo', 'feltzer', 'feltzer2', 'feltzer3', 'schafter', 'schafter2', 'schafter3',
  'schafter4', 'schafter5', 'schafter6', 'streiter', 'dubsta', 'dubsta2', 'dubsta3', 'torero',
  'torero2', 'monroe', 'coquette', 'vigilante', 'nightshark', 'niobe', 'paragon', 'paragon2'
];

const vehiclesDir = path.join(process.cwd(), 'Vehicles');
const files = fs.readdirSync(vehiclesDir).filter(f => f.endsWith('.json'));

const modelMap = new Map();
files.forEach(f => {
  const d = JSON.parse(fs.readFileSync(path.join(vehiclesDir, f), 'utf8'));
  if (!modelMap.has(d.model)) {
    modelMap.set(d.model, []);
  }
  modelMap.get(d.model).push(f);
});

console.log('Total unique models:', modelMap.size);

const hashToName = new Map();
gtaVehicles.forEach(v => {
  hashToName.set(joaat(v), v);
});

let matched = 0;
for (const [model, fileList] of modelMap.entries()) {
  if (hashToName.has(model)) {
    matched++;
    console.log(`MATCHED: ${model} -> ${hashToName.get(model)} (Files: ${fileList.slice(0, 2).join(', ')})`);
  } else {
    console.log(`UNMATCHED: ${model} (Files: ${fileList.slice(0, 2).join(', ')})`);
  }
}

console.log(`Matched ${matched} of ${modelMap.size}`);

