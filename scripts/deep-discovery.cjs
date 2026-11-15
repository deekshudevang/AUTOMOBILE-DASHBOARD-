const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const vehiclesDir = path.join(process.cwd(), 'Vehicles');
const files = fs.readdirSync(vehiclesDir).filter(f => f.endsWith('.json'));

const stats = {
  totalFiles: files.length,
  invalidFiles: [],
  schemas: {},
  models: {},
  fieldPresence: {},
  fieldTypes: {},
  fieldValueRanges: {},
  sha256Duplicates: {},
  normalizedDuplicates: {},
  modsStats: {
    totalModKeys: new Set(),
    hasVariation: 0,
    indexRange: { min: Infinity, max: -Infinity },
    negativeIndices: []
  },
  extrasStats: {
    presentInFiles: 0,
    keysFound: new Set()
  },
  neonKitsStats: {
    presentInFiles: 0,
    channelKeys: new Set(),
    hasColor: 0
  },
  tyreSmokeStats: {
    presentInFiles: 0
  },
  attachmentsStats: {
    presentInFiles: 0,
    attachmentCountTotal: 0
  },
  creatorSignatureStats: {
    presentInFiles: 0,
    signatures: new Set()
  }
};

const fileHashes = new Map();
const normHashes = new Map();

files.forEach(file => {
  const filePath = path.join(vehiclesDir, file);
  const rawBytes = fs.readFileSync(filePath);
  const sha256 = crypto.createHash('sha256').update(rawBytes).digest('hex');

  if (!fileHashes.has(sha256)) fileHashes.set(sha256, []);
  fileHashes.get(sha256).push(file);

  let data;
  try {
    data = JSON.parse(rawBytes.toString('utf8'));
  } catch (err) {
    stats.invalidFiles.push({ file, error: err.message });
    return;
  }

  const normJson = JSON.stringify(data);
  const normSha = crypto.createHash('sha256').update(normJson).digest('hex');
  if (!normHashes.has(normSha)) normHashes.set(normSha, []);
  normHashes.get(normSha).push(file);

  // Schema identification
  const schemaKey = `${data.format || 'Unknown'}|Type:${data.type !== undefined ? data.type : 'None'}`;
  stats.schemas[schemaKey] = (stats.schemas[schemaKey] || 0) + 1;

  // Model identification
  const model = data.model;
  if (!stats.models[model]) stats.models[model] = [];
  stats.models[model].push(file);

  // Field presence and types
  Object.keys(data).forEach(k => {
    stats.fieldPresence[k] = (stats.fieldPresence[k] || 0) + 1;
    const t = Array.isArray(data[k]) ? 'array' : typeof data[k];
    if (!stats.fieldTypes[k]) stats.fieldTypes[k] = new Set();
    stats.fieldTypes[k].add(t);

    if (typeof data[k] === 'number') {
      if (!stats.fieldValueRanges[k]) stats.fieldValueRanges[k] = { min: data[k], max: data[k] };
      stats.fieldValueRanges[k].min = Math.min(stats.fieldValueRanges[k].min, data[k]);
      stats.fieldValueRanges[k].max = Math.max(stats.fieldValueRanges[k].max, data[k]);
    }
  });

  // Deep check: mods
  if (data.mods && typeof data.mods === 'object') {
    Object.keys(data.mods).forEach(mk => {
      stats.modsStats.totalModKeys.add(mk);
      const modObj = data.mods[mk];
      if (typeof modObj.index === 'number') {
        stats.modsStats.indexRange.min = Math.min(stats.modsStats.indexRange.min, modObj.index);
        stats.modsStats.indexRange.max = Math.max(stats.modsStats.indexRange.max, modObj.index);
        if (modObj.index < 0) {
          stats.modsStats.negativeIndices.push({ file, mod: mk, index: modObj.index });
        }
      }
      if (modObj.variation !== undefined) {
        stats.modsStats.hasVariation++;
      }
    });
  }

  // Deep check: extras
  if (data.extras && typeof data.extras === 'object') {
    stats.extrasStats.presentInFiles++;
    Object.keys(data.extras).forEach(ek => stats.extrasStats.keysFound.add(ek));
  }

  // Deep check: neonKits
  if (data.neonKits && typeof data.neonKits === 'object') {
    stats.neonKitsStats.presentInFiles++;
    Object.keys(data.neonKits).forEach(nk => stats.neonKitsStats.channelKeys.add(nk));
    if (data.neonKits.color && typeof data.neonKits.color === 'object') {
      stats.neonKitsStats.hasColor++;
    }
  }

  // Deep check: tyreSmokeColor
  if (data.tyreSmokeColor && typeof data.tyreSmokeColor === 'object') {
    stats.tyreSmokeStats.presentInFiles++;
  }

  // Deep check: attachments
  if (data.attachments && Array.isArray(data.attachments)) {
    stats.attachmentsStats.presentInFiles++;
    stats.attachmentsStats.attachmentCountTotal += data.attachments.length;
  }

  // Deep check: _creatorSignature
  if (data._creatorSignature) {
    stats.creatorSignatureStats.presentInFiles++;
    stats.creatorSignatureStats.signatures.add(data._creatorSignature);
  }
});

// Duplicates
for (const [hash, fileList] of fileHashes.entries()) {
  if (fileList.length > 1) {
    stats.sha256Duplicates[hash] = fileList;
  }
}
for (const [hash, fileList] of normHashes.entries()) {
  if (fileList.length > 1) {
    stats.normalizedDuplicates[hash] = fileList;
  }
}

// Convert sets for JSON output
const output = {
  ...stats,
  modsStats: {
    ...stats.modsStats,
    totalModKeys: Array.from(stats.modsStats.totalModKeys).sort((a,b) => parseInt(a.replace('mod','')) - parseInt(b.replace('mod',''))),
  },
  extrasStats: {
    ...stats.extrasStats,
    keysFound: Array.from(stats.extrasStats.keysFound).sort((a,b) => parseInt(a.replace('extra','')) - parseInt(b.replace('extra',''))),
  },
  neonKitsStats: {
    ...stats.neonKitsStats,
    channelKeys: Array.from(stats.neonKitsStats.channelKeys)
  },
  creatorSignatureStats: {
    ...stats.creatorSignatureStats,
    signatures: Array.from(stats.creatorSignatureStats.signatures)
  },
  fieldTypes: Object.fromEntries(
    Object.entries(stats.fieldTypes).map(([k, s]) => [k, Array.from(s)])
  )
};

fs.writeFileSync(path.join(__dirname, 'deep-discovery-report.json'), JSON.stringify(output, null, 2));
console.log('Discovery complete. Total files:', files.length);
console.log('Exact SHA256 duplicates:', Object.keys(output.sha256Duplicates).length);
console.log('Normalized JSON duplicates:', Object.keys(output.normalizedDuplicates).length);
console.log('Unique schemas found:', Object.keys(output.schemas));
console.log('Unique models:', Object.keys(output.models).length);
console.log('Mod index range:', output.modsStats.indexRange);
console.log('Total mod slots found:', output.modsStats.totalModKeys.length);
console.log('Extras keys found:', output.extrasStats.keysFound.length);
console.log('Attachments files:', output.attachmentsStats.presentInFiles);
console.log('Creator signature files:', output.creatorSignatureStats.presentInFiles);
