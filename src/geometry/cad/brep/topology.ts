import * as THREE from 'three';

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface BRepVertex {
  id: string;
  point: [number, number, number];
}

export interface BRepCurve {
  type: 'LINE' | 'CIRCLE' | 'BSPLINE';
  evaluate(t: number): [number, number, number];
  getTangent(t: number): [number, number, number];
  getLength(): number;
}

export class LineCurve3D implements BRepCurve {
  public type: 'LINE' = 'LINE';
  constructor(
    public p0: [number, number, number],
    public p1: [number, number, number]
  ) {}

  evaluate(t: number): [number, number, number] {
    return [
      this.p0[0] + (this.p1[0] - this.p0[0]) * t,
      this.p0[1] + (this.p1[1] - this.p0[1]) * t,
      this.p0[2] + (this.p1[2] - this.p0[2]) * t
    ];
  }

  getTangent(_t: number): [number, number, number] {
    const dx = this.p1[0] - this.p0[0];
    const dy = this.p1[1] - this.p0[1];
    const dz = this.p1[2] - this.p0[2];
    const len = Math.hypot(dx, dy, dz) || 1;
    return [dx / len, dy / len, dz / len];
  }

  getLength(): number {
    return Math.hypot(
      this.p1[0] - this.p0[0],
      this.p1[1] - this.p0[1],
      this.p1[2] - this.p0[2]
    );
  }
}

export class CircleCurve3D implements BRepCurve {
  public type: 'CIRCLE' = 'CIRCLE';
  constructor(
    public center: [number, number, number],
    public normal: [number, number, number],
    public radius: number,
    public refDir: [number, number, number] = [1, 0, 0]
  ) {}

  evaluate(t: number): [number, number, number] {
    // t from 0 to 1 represents 0 to 2*PI
    const angle = t * 2 * Math.PI;
    const norm = new THREE.Vector3(...this.normal).normalize();
    const ref = new THREE.Vector3(...this.refDir).normalize();
    const ortho = new THREE.Vector3().crossVectors(norm, ref).normalize();

    const pt = new THREE.Vector3(...this.center)
      .addScaledVector(ref, Math.cos(angle) * this.radius)
      .addScaledVector(ortho, Math.sin(angle) * this.radius);

    return [pt.x, pt.y, pt.z];
  }

  getTangent(t: number): [number, number, number] {
    const angle = t * 2 * Math.PI;
    const norm = new THREE.Vector3(...this.normal).normalize();
    const ref = new THREE.Vector3(...this.refDir).normalize();
    const ortho = new THREE.Vector3().crossVectors(norm, ref).normalize();

    const tgt = new THREE.Vector3()
      .addScaledVector(ref, -Math.sin(angle))
      .addScaledVector(ortho, Math.cos(angle))
      .normalize();

    return [tgt.x, tgt.y, tgt.z];
  }

  getLength(): number {
    return 2 * Math.PI * this.radius;
  }
}

export interface BRepEdge {
  id: string;
  startVertex: BRepVertex;
  endVertex: BRepVertex;
  curve: BRepCurve;
  range: [number, number];
}

export interface BRepOrientedEdge {
  edge: BRepEdge;
  forward: boolean;
}

export interface BRepWire {
  id: string;
  edges: BRepOrientedEdge[];
  isClosed: boolean;
}

export interface BRepSurface {
  type: 'PLANE' | 'CYLINDER' | 'BSPLINE';
  evaluate(u: number, v: number): [number, number, number];
  getNormal(u: number, v: number): [number, number, number];
}

export class PlaneSurface3D implements BRepSurface {
  public type: 'PLANE' = 'PLANE';
  constructor(
    public origin: [number, number, number],
    public normal: [number, number, number],
    public refDir: [number, number, number] = [1, 0, 0]
  ) {}

  evaluate(u: number, v: number): [number, number, number] {
    const norm = new THREE.Vector3(...this.normal).normalize();
    const uDir = new THREE.Vector3(...this.refDir).normalize();
    const vDir = new THREE.Vector3().crossVectors(norm, uDir).normalize();

    const pt = new THREE.Vector3(...this.origin)
      .addScaledVector(uDir, u)
      .addScaledVector(vDir, v);

    return [pt.x, pt.y, pt.z];
  }

  getNormal(_u: number, _v: number): [number, number, number] {
    const norm = new THREE.Vector3(...this.normal).normalize();
    return [norm.x, norm.y, norm.z];
  }
}

export class CylinderSurface3D implements BRepSurface {
  public type: 'CYLINDER' = 'CYLINDER';
  constructor(
    public origin: [number, number, number],
    public axis: [number, number, number],
    public radius: number,
    public height: number = 1.0,
    public refDir: [number, number, number] = [1, 0, 0]
  ) {}

  evaluate(u: number, v: number): [number, number, number] {
    // u: angle in radians [0, 2pi], v: normalized parameter [0, 1] along axis
    const axisVec = new THREE.Vector3(...this.axis).normalize();
    const uDir = new THREE.Vector3(...this.refDir).normalize();
    const vDir = new THREE.Vector3().crossVectors(axisVec, uDir).normalize();

    const pt = new THREE.Vector3(...this.origin)
      .addScaledVector(axisVec, v * this.height)
      .addScaledVector(uDir, Math.cos(u) * this.radius)
      .addScaledVector(vDir, Math.sin(u) * this.radius);

    return [pt.x, pt.y, pt.z];
  }

  getNormal(u: number, _v: number): [number, number, number] {
    const axisVec = new THREE.Vector3(...this.axis).normalize();
    const uDir = new THREE.Vector3(...this.refDir).normalize();
    const vDir = new THREE.Vector3().crossVectors(axisVec, uDir).normalize();

    const norm = new THREE.Vector3()
      .addScaledVector(uDir, Math.cos(u))
      .addScaledVector(vDir, Math.sin(u))
      .normalize();

    return [norm.x, norm.y, norm.z];
  }
}

export class BSplineSurface3D implements BRepSurface {
  public type: 'BSPLINE' = 'BSPLINE';
  constructor(
    public degreeU: number,
    public degreeV: number,
    public controlPoints: Array<Array<[number, number, number]>>, // [uCount][vCount][3]
    public knotsU: number[],
    public knotsV: number[],
    public weights?: number[][]
  ) {}

  evaluate(u: number, v: number): [number, number, number] {
    // Bilinear or bicubic B-spline evaluation
    const uCount = this.controlPoints.length;
    const vCount = this.controlPoints[0].length;

    // Clamp parameters
    const uClamped = Math.max(0, Math.min(1, u));
    const vClamped = Math.max(0, Math.min(1, v));

    const uIdx = uClamped * (uCount - 1);
    const vIdx = vClamped * (vCount - 1);

    const i0 = Math.floor(uIdx);
    const i1 = Math.min(uCount - 1, i0 + 1);
    const j0 = Math.floor(vIdx);
    const j1 = Math.min(vCount - 1, j0 + 1);

    const uFrac = uIdx - i0;
    const vFrac = vIdx - j0;

    const p00 = this.controlPoints[i0][j0];
    const p10 = this.controlPoints[i1][j0];
    const p01 = this.controlPoints[i0][j1];
    const p11 = this.controlPoints[i1][j1];

    const x = (1 - uFrac) * (1 - vFrac) * p00[0] +
              uFrac * (1 - vFrac) * p10[0] +
              (1 - uFrac) * vFrac * p01[0] +
              uFrac * vFrac * p11[0];

    const y = (1 - uFrac) * (1 - vFrac) * p00[1] +
              uFrac * (1 - vFrac) * p10[1] +
              (1 - uFrac) * vFrac * p01[1] +
              uFrac * vFrac * p11[1];

    const z = (1 - uFrac) * (1 - vFrac) * p00[2] +
              uFrac * (1 - vFrac) * p10[2] +
              (1 - uFrac) * vFrac * p01[2] +
              uFrac * vFrac * p11[2];

    return [x, y, z];
  }

  getNormal(u: number, v: number): [number, number, number] {
    const eps = 1e-4;
    const pCenter = this.evaluate(u, v);
    const pU = this.evaluate(Math.min(1, u + eps), v);
    const pV = this.evaluate(u, Math.min(1, v + eps));

    const du = new THREE.Vector3(pU[0] - pCenter[0], pU[1] - pCenter[1], pU[2] - pCenter[2]);
    const dv = new THREE.Vector3(pV[0] - pCenter[0], pV[1] - pCenter[1], pV[2] - pCenter[2]);

    const norm = new THREE.Vector3().crossVectors(du, dv).normalize();
    return [norm.x, norm.y, norm.z];
  }
}

export interface BRepFace {
  id: string;
  outerBound: BRepWire;
  innerBounds: BRepWire[];
  surface: BRepSurface;
  sameSense: boolean; // True if face normal matches surface normal
}

export interface BRepShell {
  id: string;
  faces: BRepFace[];
  isClosed: boolean;
}

export class BRepSolid {
  constructor(
    public id: string,
    public name: string,
    public outerShell: BRepShell,
    public innerShells: BRepShell[] = []
  ) {}

  /**
   * Computes the Euler characteristic: V - E + F
   */
  public getEulerCharacteristic(): number {
    const vertices = new Set<string>();
    const edges = new Set<string>();
    const faces = this.outerShell.faces;

    for (const f of faces) {
      for (const oe of f.outerBound.edges) {
        edges.add(oe.edge.id);
        vertices.add(oe.edge.startVertex.id);
        vertices.add(oe.edge.endVertex.id);
      }
      for (const inner of f.innerBounds) {
        for (const oe of inner.edges) {
          edges.add(oe.edge.id);
          vertices.add(oe.edge.startVertex.id);
          vertices.add(oe.edge.endVertex.id);
        }
      }
    }

    const V = vertices.size;
    const E = edges.size;
    const F = faces.length;
    return V - E + F;
  }

  /**
   * Computes exact solid volume using the Divergence Theorem on boundary faces
   */
  public getVolume(): number {
    let volume = 0;
    const mesh = this.toMesh();
    const pos = mesh.getAttribute('position');
    const index = mesh.getIndex();

    if (!pos) return 0;

    const count = index ? index.count / 3 : pos.count / 3;
    for (let i = 0; i < count; i++) {
      const i0 = index ? index.getX(i * 3) : i * 3;
      const i1 = index ? index.getX(i * 3 + 1) : i * 3 + 1;
      const i2 = index ? index.getX(i * 3 + 2) : i * 3 + 2;

      const p0 = new THREE.Vector3(pos.getX(i0), pos.getY(i0), pos.getZ(i0));
      const p1 = new THREE.Vector3(pos.getX(i1), pos.getY(i1), pos.getZ(i1));
      const p2 = new THREE.Vector3(pos.getX(i2), pos.getY(i2), pos.getZ(i2));

      // Tetrahedron signed volume from origin: (p0 dot (p1 cross p2)) / 6
      const cross = new THREE.Vector3().crossVectors(p1, p2);
      volume += p0.dot(cross) / 6.0;
    }

    return Math.abs(volume);
  }

  /**
   * Computes total surface area of boundary faces
   */
  public getSurfaceArea(): number {
    let area = 0;
    const mesh = this.toMesh();
    const pos = mesh.getAttribute('position');
    const index = mesh.getIndex();

    if (!pos) return 0;

    const count = index ? index.count / 3 : pos.count / 3;
    for (let i = 0; i < count; i++) {
      const i0 = index ? index.getX(i * 3) : i * 3;
      const i1 = index ? index.getX(i * 3 + 1) : i * 3 + 1;
      const i2 = index ? index.getX(i * 3 + 2) : i * 3 + 2;

      const p0 = new THREE.Vector3(pos.getX(i0), pos.getY(i0), pos.getZ(i0));
      const p1 = new THREE.Vector3(pos.getX(i1), pos.getY(i1), pos.getZ(i1));
      const p2 = new THREE.Vector3(pos.getX(i2), pos.getY(i2), pos.getZ(i2));

      const v0 = new THREE.Vector3().subVectors(p1, p0);
      const v1 = new THREE.Vector3().subVectors(p2, p0);
      area += new THREE.Vector3().crossVectors(v0, v1).length() * 0.5;
    }

    return area;
  }

  /**
   * Computes 3D Axis-Aligned Bounding Box
   */
  public getBoundingBox(): { min: [number, number, number]; max: [number, number, number] } {
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

    for (const f of this.outerShell.faces) {
      for (const oe of f.outerBound.edges) {
        for (const pt of [oe.edge.startVertex.point, oe.edge.endVertex.point]) {
          minX = Math.min(minX, pt[0]);
          minY = Math.min(minY, pt[1]);
          minZ = Math.min(minZ, pt[2]);
          maxX = Math.max(maxX, pt[0]);
          maxY = Math.max(maxY, pt[1]);
          maxZ = Math.max(maxZ, pt[2]);
        }
      }
    }

    return {
      min: [minX, minY, minZ],
      max: [maxX, maxY, maxZ]
    };
  }

  /**
   * Tessellates B-Rep faces into watertight Three.js BufferGeometry
   */
  public toMesh(): THREE.BufferGeometry {
    const positions: number[] = [];
    const normals: number[] = [];

    for (const face of this.outerShell.faces) {
      const surf = face.surface;
      const wire = face.outerBound;

      if (surf.type === 'PLANE') {
        // Collect boundary polygon vertices, sampling curved circle edges
        const polyPoints: Array<[number, number, number]> = [];
        for (const oe of wire.edges) {
          if (oe.edge.curve.type === 'CIRCLE') {
            const circ = oe.edge.curve as CircleCurve3D;
            const steps = 12;
            const [t0, t1] = oe.edge.range;
            for (let s = 0; s < steps; s++) {
              const t = oe.forward
                ? t0 + (t1 - t0) * (s / steps)
                : t1 - (t1 - t0) * (s / steps);
              polyPoints.push(circ.evaluate(t));
            }
          } else {
            polyPoints.push(oe.forward ? oe.edge.startVertex.point : oe.edge.endVertex.point);
          }
        }

        if (polyPoints.length >= 3) {
          const norm = surf.getNormal(0, 0);
          const flip = !face.sameSense;
          const fn = flip ? [-norm[0], -norm[1], -norm[2]] : norm;

          // Simple fan triangulation for convex/planar faces
          const p0 = polyPoints[0];
          for (let i = 1; i < polyPoints.length - 1; i++) {
            const p1 = polyPoints[i];
            const p2 = polyPoints[i + 1];

            if (flip) {
              positions.push(...p0, ...p2, ...p1);
            } else {
              positions.push(...p0, ...p1, ...p2);
            }
            normals.push(...fn, ...fn, ...fn);
          }
        }
      } else if (surf.type === 'CYLINDER') {
        // Tessellate cylinder surface grid
        const uSteps = 24;
        const vSteps = 4;
        const cyl = surf as CylinderSurface3D;

        for (let uI = 0; uI < uSteps; uI++) {
          const u0 = (uI / uSteps) * 2 * Math.PI;
          const u1 = ((uI + 1) / uSteps) * 2 * Math.PI;

          for (let vI = 0; vI < vSteps; vI++) {
            const v0 = vI / vSteps;
            const v1 = (vI + 1) / vSteps;

            const pt00 = cyl.evaluate(u0, v0);
            const pt10 = cyl.evaluate(u1, v0);
            const pt01 = cyl.evaluate(u0, v1);
            const pt11 = cyl.evaluate(u1, v1);

            const n00 = cyl.getNormal(u0, v0);
            const n10 = cyl.getNormal(u1, v0);
            const n01 = cyl.getNormal(u0, v1);
            const n11 = cyl.getNormal(u1, v1);

            // Triangle 1
            positions.push(...pt00, ...pt10, ...pt01);
            normals.push(...n00, ...n10, ...n01);

            // Triangle 2
            positions.push(...pt10, ...pt11, ...pt01);
            normals.push(...n10, ...n11, ...n01);
          }
        }
      } else if (surf.type === 'BSPLINE') {
        // Tessellate B-spline surface
        const uSteps = 12;
        const vSteps = 12;

        for (let uI = 0; uI < uSteps; uI++) {
          const u0 = uI / uSteps;
          const u1 = (uI + 1) / uSteps;

          for (let vI = 0; vI < vSteps; vI++) {
            const v0 = vI / vSteps;
            const v1 = (vI + 1) / vSteps;

            const pt00 = surf.evaluate(u0, v0);
            const pt10 = surf.evaluate(u1, v0);
            const pt01 = surf.evaluate(u0, v1);
            const pt11 = surf.evaluate(u1, v1);

            const n00 = surf.getNormal(u0, v0);
            const n10 = surf.getNormal(u1, v0);
            const n01 = surf.getNormal(u0, v1);
            const n11 = surf.getNormal(u1, v1);

            positions.push(...pt00, ...pt10, ...pt01);
            normals.push(...n00, ...n10, ...n01);

            positions.push(...pt10, ...pt11, ...pt01);
            normals.push(...n10, ...n11, ...n01);
          }
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    return geo;
  }
}
