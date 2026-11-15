const fs = require('fs');
const path = require('path');

function inspectVehicle(filePath) {
  try {
    const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const isSchema2 = raw.schemaVersion === '2.0';
    const isParametric1 = raw.asset_type === 'parametric_vehicle_geometry' || (raw.$schema && String(raw.$schema).includes('vehicle-parametric'));
    const isCherax = raw.format === 'Cherax Entity' || raw.model !== undefined;

    let format = 'Unknown';
    if (isSchema2) format = 'Schema 2.0';
    else if (isParametric1) format = 'Parametric 1.0';
    else if (isCherax) format = 'Cherax Entity';

    const separable_body_panels = isSchema2 ? !!raw.components?.some(c => c.group === 'body_panels') : false;
    const separable_wheels = isSchema2 ? !!raw.wheels : (isParametric1 ? !!raw.geometry?.wheels : false);
    const tyres_geometry = isSchema2 ? !!(raw.wheels?.frontLeft?.tire) : (isParametric1 ? !!raw.geometry?.wheels?.front : false);
    const brake_parts = isSchema2 ? !!(raw.wheels?.frontLeft?.brakes) : false;
    const interior_meshes = isSchema2 ? !!raw.components?.some(c => c.group === 'interior') : false;
    const named_materials = isSchema2 ? !!(raw.materials && raw.materials.length > 0) : (isParametric1 ? !!raw.materials : false);
    const spec_data = isSchema2 ? !!raw.dimensions : (isParametric1 ? !!raw.reference_specification : !!raw.model);
    const component_count = isSchema2 ? (raw.components?.length || 0) : 0;

    return {
      fileName: path.basename(filePath),
      format,
      separable_body_panels,
      separable_wheels,
      tyres_geometry,
      brake_parts,
      interior_meshes,
      named_materials,
      spec_data,
      component_count
    };
  } catch (err) {
    return {
      fileName: path.basename(filePath),
      format: 'Error',
      error: err.message
    };
  }
}

function scanDir(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      results.push(...scanDir(full));
    } else if (ent.name.endsWith('.json') && ent.name !== 'index.json') {
      results.push(inspectVehicle(full));
    }
  }
  return results;
}

const allResults = scanDir(path.resolve('public/vehicles'));
fs.writeFileSync(path.resolve('docs/vehicle_capability_matrix.json'), JSON.stringify(allResults, null, 2));
console.log('Processed', allResults.length, 'vehicles into docs/vehicle_capability_matrix.json');
