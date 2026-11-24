import * as THREE from 'three';
import {
  BRepSolid,
  BRepShell,
  BRepFace,
  PlaneSurface3D,
  LineCurve3D,
  BRepVertex,
  BRepEdge,
  BRepOrientedEdge
} from './topology';

export class BRepBooleanEngine {
  /**
   * Boolean Difference: solidA MINUS solidB (e.g. drilling a hole, carving a vent)
   */
  public static difference(solidA: BRepSolid, solidB: BRepSolid, name?: string): BRepSolid {
    return this.performCsgOperation(solidA, solidB, 'DIFFERENCE', name || `${solidA.name}_cut_${solidB.name}`);
  }

  /**
   * Boolean Union: solidA PLUS solidB (fusing two components into a single solid)
   */
  public static union(solidA: BRepSolid, solidB: BRepSolid, name?: string): BRepSolid {
    return this.performCsgOperation(solidA, solidB, 'UNION', name || `${solidA.name}_union_${solidB.name}`);
  }

  /**
   * Boolean Intersection: solidA AND solidB (retaining only shared solid volume)
   */
  public static intersect(solidA: BRepSolid, solidB: BRepSolid, name?: string): BRepSolid {
    return this.performCsgOperation(solidA, solidB, 'INTERSECT', name || `${solidA.name}_intersect_${solidB.name}`);
  }

  private static performCsgOperation(
    solidA: BRepSolid,
    solidB: BRepSolid,
    op: 'UNION' | 'DIFFERENCE' | 'INTERSECT',
    resultName: string
  ): BRepSolid {
    const meshA = solidA.toMesh();
    const meshB = solidB.toMesh();

    const boxB = solidB.getBoundingBox();
    const boxA = solidA.getBoundingBox();

    // Check for disjoint bounding boxes
    const disjoint =
      boxA.max[0] < boxB.min[0] || boxA.min[0] > boxB.max[0] ||
      boxA.max[1] < boxB.min[1] || boxA.min[1] > boxB.max[1] ||
      boxA.max[2] < boxB.min[2] || boxA.min[2] > boxB.max[2];

    if (disjoint) {
      if (op === 'UNION') {
        // Union of disjoint solids is both shells combined
        const combinedFaces = [...solidA.outerShell.faces, ...solidB.outerShell.faces];
        return new BRepSolid(`solid_${resultName}`, resultName, {
          id: `shell_${resultName}`,
          faces: combinedFaces,
          isClosed: true
        });
      }
      if (op === 'DIFFERENCE') {
        // A - B where B is disjoint is simply A
        return new BRepSolid(`solid_${resultName}`, resultName, solidA.outerShell);
      }
      if (op === 'INTERSECT') {
        // A intersect B where disjoint is empty solid
        return new BRepSolid(`solid_${resultName}`, resultName, {
          id: `shell_${resultName}`,
          faces: [],
          isClosed: false
        });
      }
    }

    // Tessellated boundary classification
    const posA = meshA.getAttribute('position');
    const posB = meshB.getAttribute('position');

    const resultPositions: number[] = [];
    const resultNormals: number[] = [];

    // Helper: test if point is inside bounding solid approximation
    const isInsideB = (p: THREE.Vector3) => {
      const [minX, minY, minZ] = boxB.min;
      const [maxX, maxY, maxZ] = boxB.max;
      return (
        p.x >= minX - 1e-4 && p.x <= maxX + 1e-4 &&
        p.y >= minY - 1e-4 && p.y <= maxY + 1e-4 &&
        p.z >= minZ - 1e-4 && p.z <= maxZ + 1e-4
      );
    };

    const isInsideA = (p: THREE.Vector3) => {
      const [minX, minY, minZ] = boxA.min;
      const [maxX, maxY, maxZ] = boxA.max;
      return (
        p.x >= minX - 1e-4 && p.x <= maxX + 1e-4 &&
        p.y >= minY - 1e-4 && p.y <= maxY + 1e-4 &&
        p.z >= minZ - 1e-4 && p.z <= maxZ + 1e-4
      );
    };

    // Classify triangles of A
    const countA = posA.count / 3;
    for (let t = 0; t < countA; t++) {
      const p0 = new THREE.Vector3(posA.getX(t * 3), posA.getY(t * 3), posA.getZ(t * 3));
      const p1 = new THREE.Vector3(posA.getX(t * 3 + 1), posA.getY(t * 3 + 1), posA.getZ(t * 3 + 1));
      const p2 = new THREE.Vector3(posA.getX(t * 3 + 2), posA.getY(t * 3 + 2), posA.getZ(t * 3 + 2));
      const centroid = new THREE.Vector3().add(p0).add(p1).add(p2).divideScalar(3);

      const insideB = isInsideB(centroid);

      let keep = false;
      if (op === 'DIFFERENCE' && !insideB) keep = true;
      if (op === 'UNION' && !insideB) keep = true;
      if (op === 'INTERSECT' && insideB) keep = true;

      if (keep) {
        const v0 = new THREE.Vector3().subVectors(p1, p0);
        const v1 = new THREE.Vector3().subVectors(p2, p0);
        const n = new THREE.Vector3().crossVectors(v0, v1).normalize();

        resultPositions.push(p0.x, p0.y, p0.z, p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
        resultNormals.push(n.x, n.y, n.z, n.x, n.y, n.z, n.x, n.y, n.z);
      }
    }

    // Classify triangles of B
    const countB = posB.count / 3;
    for (let t = 0; t < countB; t++) {
      const p0 = new THREE.Vector3(posB.getX(t * 3), posB.getY(t * 3), posB.getZ(t * 3));
      const p1 = new THREE.Vector3(posB.getX(t * 3 + 1), posB.getY(t * 3 + 1), posB.getZ(t * 3 + 1));
      const p2 = new THREE.Vector3(posB.getX(t * 3 + 2), posB.getY(t * 3 + 2), posB.getZ(t * 3 + 2));
      const centroid = new THREE.Vector3().add(p0).add(p1).add(p2).divideScalar(3);

      const insideA = isInsideA(centroid);

      let keep = false;
      let flip = false;

      if (op === 'DIFFERENCE' && insideA) {
        keep = true;
        flip = true; // Invert normal for the cutout cavity
      }
      if (op === 'UNION' && !insideA) keep = true;
      if (op === 'INTERSECT' && insideA) keep = true;

      if (keep) {
        const v0 = new THREE.Vector3().subVectors(p1, p0);
        const v1 = new THREE.Vector3().subVectors(p2, p0);
        const n = new THREE.Vector3().crossVectors(v0, v1).normalize();
        if (flip) n.negate();

        if (flip) {
          resultPositions.push(p0.x, p0.y, p0.z, p2.x, p2.y, p2.z, p1.x, p1.y, p1.z);
        } else {
          resultPositions.push(p0.x, p0.y, p0.z, p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
        }
        resultNormals.push(n.x, n.y, n.z, n.x, n.y, n.z, n.x, n.y, n.z);
      }
    }

    // Reconstruct BRep faces from clipped boundary triangles
    const faces: BRepFace[] = [];
    const triCount = resultPositions.length / 9;

    for (let i = 0; i < triCount; i++) {
      const p0: [number, number, number] = [
        resultPositions[i * 9],
        resultPositions[i * 9 + 1],
        resultPositions[i * 9 + 2]
      ];
      const p1: [number, number, number] = [
        resultPositions[i * 9 + 3],
        resultPositions[i * 9 + 4],
        resultPositions[i * 9 + 5]
      ];
      const p2: [number, number, number] = [
        resultPositions[i * 9 + 6],
        resultPositions[i * 9 + 7],
        resultPositions[i * 9 + 8]
      ];

      const norm: [number, number, number] = [
        resultNormals[i * 9],
        resultNormals[i * 9 + 1],
        resultNormals[i * 9 + 2]
      ];

      const v0: BRepVertex = { id: `csg_v_${i}_0`, point: p0 };
      const v1: BRepVertex = { id: `csg_v_${i}_1`, point: p1 };
      const v2: BRepVertex = { id: `csg_v_${i}_2`, point: p2 };

      const e01: BRepEdge = { id: `csg_e_${i}_01`, startVertex: v0, endVertex: v1, curve: new LineCurve3D(p0, p1), range: [0, 1] };
      const e12: BRepEdge = { id: `csg_e_${i}_12`, startVertex: v1, endVertex: v2, curve: new LineCurve3D(p1, p2), range: [0, 1] };
      const e20: BRepEdge = { id: `csg_e_${i}_20`, startVertex: v2, endVertex: v0, curve: new LineCurve3D(p2, p0), range: [0, 1] };

      faces.push({
        id: `csg_face_${i}`,
        outerBound: {
          id: `csg_wire_${i}`,
          edges: [
            { edge: e01, forward: true },
            { edge: e12, forward: true },
            { edge: e20, forward: true }
          ],
          isClosed: true
        },
        innerBounds: [],
        surface: new PlaneSurface3D(p0, norm),
        sameSense: true
      });
    }

    const shell: BRepShell = {
      id: `shell_${resultName}`,
      faces,
      isClosed: true
    };

    return new BRepSolid(`solid_${resultName}`, resultName, shell);
  }
}
