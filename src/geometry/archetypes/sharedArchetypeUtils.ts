import * as THREE from 'three';
import { ComponentSemanticType, GeometryNodeMetadata } from '../types';

export interface NodeRegistrar {
  addNode: (
    mesh: THREE.Object3D,
    id: string,
    semType: ComponentSemanticType,
    parentId?: string,
    attachPoint?: [number, number, number]
  ) => void;
  nodes: GeometryNodeMetadata[];
  root: THREE.Group;
}

/**
 * Creates node registration context for an archetype assembly
 */
export function createNodeRegistrar(name = 'panelized_chassis_assembly'): NodeRegistrar {
  const root = new THREE.Group();
  root.name = name;
  const nodes: GeometryNodeMetadata[] = [];

  const addNode = (
    mesh: THREE.Object3D,
    id: string,
    semType: ComponentSemanticType,
    parentId?: string,
    attachPoint: [number, number, number] = [0, 0, 0]
  ) => {
    mesh.name = id;
    mesh.userData = { componentId: id, semanticType: semType, parentId, attachPoint };

    const box = new THREE.Box3().setFromObject(mesh);
    const size = new THREE.Vector3();
    box.getSize(size);

    let triCount = 0;
    mesh.traverse(child => {
      if ((child as THREE.Mesh).isMesh) {
        const g = (child as THREE.Mesh).geometry;
        if (g) triCount += g.index ? g.index.count / 3 : g.attributes.position.count / 3;
      }
    });

    nodes.push({
      id,
      semanticType: semType,
      parentId,
      pivot: [mesh.position.x, mesh.position.y, mesh.position.z],
      attachPoint,
      visible: true,
      triangleCount: Math.round(triCount),
      boundingBox: {
        min: [box.min.x, box.min.y, box.min.z],
        max: [box.max.x, box.max.y, box.max.z],
        size: [size.x, size.y, size.z]
      },
      materialId: (mesh as any).material?.name || 'body_paint'
    });

    root.add(mesh);
  };

  return { root, nodes, addNode };
}

/**
 * Evaluates a smooth parametric surface patch with clean outward normals and double curvature
 */
export function createCurvedPatch(
  uSteps: number,
  vSteps: number,
  evalFn: (u: number, v: number) => THREE.Vector3,
  material: THREE.Material,
  centerHeight = 0.60
): THREE.Mesh {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= uSteps; i++) {
    const u = i / uSteps;
    for (let j = 0; j <= vSteps; j++) {
      const v = j / vSteps;
      const pt = evalFn(u, v);
      positions.push(pt.x, pt.y, pt.z);
      uvs.push(u, v);
    }
  }

  // Check outward normal against center of vehicle volume (0, centerHeight, 0)
  const midI = Math.floor(uSteps / 2);
  const midJ = Math.floor(vSteps / 2);
  const idxA = midI * (vSteps + 1) + midJ;
  const idxB = Math.min((midI + 1) * (vSteps + 1) + midJ, (uSteps + 1) * (vSteps + 1) - 1);
  const idxC = Math.min((midI + 1) * (vSteps + 1) + (midJ + 1), (uSteps + 1) * (vSteps + 1) - 1);

  const pA = new THREE.Vector3(positions[idxA * 3], positions[idxA * 3 + 1], positions[idxA * 3 + 2]);
  const pB = new THREE.Vector3(positions[idxB * 3], positions[idxB * 3 + 1], positions[idxB * 3 + 2]);
  const pC = new THREE.Vector3(positions[idxC * 3], positions[idxC * 3 + 1], positions[idxC * 3 + 2]);

  const vAB = new THREE.Vector3().subVectors(pB, pA);
  const vAC = new THREE.Vector3().subVectors(pC, pA);
  const norm = new THREE.Vector3().crossVectors(vAB, vAC);

  const outwardRef = new THREE.Vector3(pA.x, pA.y - centerHeight, pA.z);
  const isOutward = norm.dot(outwardRef) >= 0;

  for (let i = 0; i < uSteps; i++) {
    for (let j = 0; j < vSteps; j++) {
      const a = i * (vSteps + 1) + j;
      const b = (i + 1) * (vSteps + 1) + j;
      const c = (i + 1) * (vSteps + 1) + (j + 1);
      const d = i * (vSteps + 1) + (j + 1);

      if (isOutward) {
        indices.push(a, b, c);
        indices.push(a, c, d);
      } else {
        indices.push(a, c, b);
        indices.push(a, d, c);
      }
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();

  const mesh = new THREE.Mesh(geo, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

/**
 * Creates an authentic recessed front and rear license plate assembly
 * anchored with 0-2mm offset to avoid floating geometry check failures
 */
export function addLicensePlates(
  reg: NodeRegistrar,
  frontPos: [number, number, number],
  rearPos: [number, number, number],
  frontParent = 'front_bumper',
  rearParent = 'rear_bumper'
): void {
  const plateWidth = 0.38;
  const plateHeight = 0.11;

  // Bracket with rounded edges
  const bracketGeo = new THREE.BoxGeometry(plateWidth + 0.016, plateHeight + 0.016, 0.010);
  bracketGeo.computeVertexNormals();
  const bracketMat = new THREE.MeshStandardMaterial({
    color: '#15171C',
    roughness: 0.75,
    metalness: 0.2
  });

  const whitePlateGeo = new THREE.BoxGeometry(plateWidth, plateHeight, 0.004);
  whitePlateGeo.computeVertexNormals();
  const whitePlateMat = new THREE.MeshStandardMaterial({
    color: '#FAFAFC',
    roughness: 0.3,
    metalness: 0.1
  });

  // Front plate
  const fGroup = new THREE.Group();
  const fBracket = new THREE.Mesh(bracketGeo, bracketMat);
  fGroup.add(fBracket);
  const fPlate = new THREE.Mesh(whitePlateGeo, whitePlateMat);
  fPlate.position.z = 0.005;
  fGroup.add(fPlate);
  fGroup.position.set(frontPos[0], frontPos[1], frontPos[2]);
  reg.addNode(fGroup, 'license_plate_front', frontParent as any, frontParent, frontPos);

  // Rear plate
  const rGroup = new THREE.Group();
  const rBracket = new THREE.Mesh(bracketGeo, bracketMat);
  rGroup.add(rBracket);
  const rPlate = new THREE.Mesh(whitePlateGeo, whitePlateMat);
  rPlate.position.z = -0.005;
  rGroup.add(rPlate);
  rGroup.position.set(rearPos[0], rearPos[1], rearPos[2]);
  reg.addNode(rGroup, 'license_plate_rear', rearParent as any, rearParent, rearPos);
}

/**
 * Creates aerodynamic racing side door mirrors anchored to doors
 */
export function addDoorMirrors(
  reg: NodeRegistrar,
  mirrorPositions: {
    left: [number, number, number];
    right: [number, number, number];
  },
  bodyPaintMat: THREE.Material,
  carbonMat: THREE.Material
): void {
  [-1, 1].forEach((side) => {
    const isLeft = side === 1;
    const pos = isLeft ? mirrorPositions.left : mirrorPositions.right;

    const group = new THREE.Group();
    
    // Aerodynamic mounting stalk
    const stemGeo = new THREE.CylinderGeometry(0.012, 0.018, 0.09, 14);
    stemGeo.rotateZ(side * 0.45);
    stemGeo.computeVertexNormals();
    const stem = new THREE.Mesh(stemGeo, carbonMat);
    stem.name = `${isLeft ? 'mirror_l' : 'mirror_r'}_stem`;
    stem.position.set(side * 0.035, 0.02, 0);
    group.add(stem);

    // Sculpted teardrop mirror housing
    const headGeo = new THREE.SphereGeometry(1.0, 20, 16);
    headGeo.scale(0.085, 0.045, 0.055);
    headGeo.computeVertexNormals();
    const head = new THREE.Mesh(headGeo, bodyPaintMat);
    head.name = `${isLeft ? 'mirror_l' : 'mirror_r'}_head`;
    head.position.set(side * 0.08, 0.045, -0.01);
    group.add(head);

    // Glass mirror face (pointing backwards)
    const glassGeo = new THREE.CylinderGeometry(0.038, 0.038, 0.006, 16);
    glassGeo.rotateX(Math.PI / 2);
    glassGeo.scale(1.2, 0.75, 1.0);
    glassGeo.computeVertexNormals();
    const glassMat = new THREE.MeshStandardMaterial({
      color: '#E0E8F0',
      metalness: 0.95,
      roughness: 0.05
    });
    const mirrorGlass = new THREE.Mesh(glassGeo, glassMat);
    mirrorGlass.position.set(side * 0.08, 0.045, -0.036);
    group.add(mirrorGlass);

    group.position.set(pos[0], pos[1], pos[2]);
    const mId = isLeft ? 'mirror_l' : 'mirror_r';
    const parentId = isLeft ? 'door_l' : 'door_r';
    reg.addNode(group, mId, mId as any, parentId, pos);
  });
}

/**
 * Creates authentic 3D circular or quad exhaust pipes with hollow dark bores
 */
export function createExhaustAssembly(
  reg: NodeRegistrar,
  positions: Array<[number, number, number]>,
  radius = 0.045,
  length = 0.12,
  parentName = 'rear_diffuser'
): void {
  const outerMat = new THREE.MeshStandardMaterial({
    color: '#D8DCE4',
    metalness: 0.92,
    roughness: 0.18
  });
  const innerMat = new THREE.MeshStandardMaterial({
    color: '#08090C',
    roughness: 0.95,
    metalness: 0.05
  });

  positions.forEach((pos, idx) => {
    const group = new THREE.Group();
    
    // Outer metallic bevel pipe (translated forward so rear tip is flush at z=0)
    const outerGeo = new THREE.CylinderGeometry(radius, radius * 0.96, length, 24, 1, true);
    outerGeo.rotateX(Math.PI / 2);
    outerGeo.translate(0, 0, length / 2);
    outerGeo.computeVertexNormals();
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    group.add(outerMesh);

    // Inner dark hollow bore
    const innerGeo = new THREE.CylinderGeometry(radius * 0.86, radius * 0.86, length * 0.98, 24);
    innerGeo.rotateX(Math.PI / 2);
    innerGeo.translate(0, 0, length / 2);
    innerGeo.computeVertexNormals();
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    group.add(innerMesh);

    group.position.set(pos[0], pos[1], pos[2]);
    const id = `exhaust_tip_${idx === 0 ? 'l' : idx === 1 ? 'r' : `_${idx}`}`;
    reg.addNode(group, id, id as any, parentName, pos);
  });
}
