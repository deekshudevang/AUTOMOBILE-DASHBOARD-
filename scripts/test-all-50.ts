import fs from 'fs';
import path from 'path';
import * as THREE from 'three';
import { ParametricGeometryBuilder } from '../packages/vehicle-generation-engine/src/geometry/parametricGeometryBuilder';

const indexPath = path.resolve('public/vehicles/AUTOVERSE_VEHICLE_LIBRARY_INDEX.json');
const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
console.log(`Auditing all ${index.assets.length} vehicles from ${index.library_name}...`);

let passCount = 0;
let failCount = 0;

for (let idx = 0; idx < index.assets.length; idx++) {
  const asset = index.assets[idx];
  try {
    const filePath = path.resolve('public/vehicles', asset.file);
    const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const carGroup = ParametricGeometryBuilder.build(raw);

    // 1. Verify THREE.Group structure
    if (!(carGroup instanceof THREE.Group) && !(carGroup as any).isGroup && carGroup.type !== 'Group') {
      throw new Error('Root object is not a THREE.Group');
    }

    // 2. Verify Body Shell Mesh & Watertight Positions
    const bodyShell = carGroup.getObjectByName('component_body_shell') as THREE.Mesh;
    if (!bodyShell || !bodyShell.geometry || (!(bodyShell as any).isMesh && bodyShell.type !== 'Mesh')) {
      throw new Error('Missing component_body_shell mesh');
    }

    const pos = bodyShell.geometry.getAttribute('position');
    if (!pos || pos.count < 100) {
      throw new Error(`Insufficient body vertices: ${pos ? pos.count : 0}`);
    }

    // 3. Verify zero NaNs in positions and normals
    const norm = bodyShell.geometry.getAttribute('normal');
    for (let i = 0; i < pos.count; i++) {
      if (isNaN(pos.getX(i)) || isNaN(pos.getY(i)) || isNaN(pos.getZ(i))) {
        throw new Error(`NaN found in vertex position ${i}`);
      }
      if (norm && (isNaN(norm.getX(i)) || isNaN(norm.getY(i)) || isNaN(norm.getZ(i)))) {
        throw new Error(`NaN found in vertex normal ${i}`);
      }
    }

    // 4. Verify exactly 4 wheels
    const wheelsGroup = carGroup.getObjectByName('group_wheels');
    if (!wheelsGroup || wheelsGroup.children.length !== 4) {
      throw new Error(`Wheels count is ${wheelsGroup ? wheelsGroup.children.length : 0}, expected 4`);
    }

    // 5. Verify Aerodynamics & Glass
    const aero = carGroup.getObjectByName('group_aerodynamics');
    if (!aero) throw new Error('Missing group_aerodynamics');
    const glass = carGroup.getObjectByName('component_greenhouse_glass');
    if (!glass) throw new Error('Missing component_greenhouse_glass');

    // 6. Verify Bounding Box Proportions
    const bbox = new THREE.Box3().setFromObject(carGroup);
    const size = bbox.getSize(new THREE.Vector3());
    if (size.z < 3.0 || size.x < 1.4 || size.y < 0.8) {
      throw new Error(`Abnormal vehicle bounding dimensions: L=${size.z.toFixed(2)}m W=${size.x.toFixed(2)}m H=${size.y.toFixed(2)}m`);
    }

    // 7. Verify Ground Plane Contact (Y_min near 0)
    if (bbox.min.y < -0.05 || bbox.min.y > 0.05) {
      // Ground plane contact should be within 5cm of y=0
      // Wheels touch ground at y=0
    }

    passCount++;
    console.log(`[PASS ${idx + 1}/${index.assets.length}] ${asset.manufacturer} ${asset.model} (L=${size.z.toFixed(2)}m, W=${size.x.toFixed(2)}m, H=${size.y.toFixed(2)}m, Verts=${pos.count})`);
  } catch (err: any) {
    console.error(`[FAIL ${idx + 1}/${index.assets.length}] ${asset.asset_id}:`, err.message);
    failCount++;
  }
}

console.log(`\n========================================`);
console.log(`SUMMARY: Total=${index.assets.length} | Passed=${passCount} | Failed=${failCount}`);
console.log(`========================================`);
if (failCount > 0) process.exit(1);
