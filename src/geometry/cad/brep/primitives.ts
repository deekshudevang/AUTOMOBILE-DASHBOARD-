import * as THREE from 'three';
import {
  BRepVertex,
  BRepEdge,
  BRepOrientedEdge,
  BRepWire,
  BRepFace,
  BRepShell,
  BRepSolid,
  LineCurve3D,
  CircleCurve3D,
  PlaneSurface3D,
  CylinderSurface3D,
  BSplineSurface3D
} from './topology';

export class BRepPrimitives {
  /**
   * Creates an exact topological B-Rep Solid Box (6 planar faces, 12 edges, 8 vertices)
   * Satisfies Euler characteristic: 8 - 12 + 6 = 2
   */
  public static createBox(
    width: number,
    height: number,
    depth: number,
    center: [number, number, number] = [0, 0, 0]
  ): BRepSolid {
    const hw = width / 2;
    const hh = height / 2;
    const hd = depth / 2;

    const [cx, cy, cz] = center;

    // 8 Vertices
    const v0: BRepVertex = { id: 'v0', point: [cx - hw, cy - hh, cz - hd] };
    const v1: BRepVertex = { id: 'v1', point: [cx + hw, cy - hh, cz - hd] };
    const v2: BRepVertex = { id: 'v2', point: [cx + hw, cy - hh, cz + hd] };
    const v3: BRepVertex = { id: 'v3', point: [cx - hw, cy - hh, cz + hd] };
    const v4: BRepVertex = { id: 'v4', point: [cx - hw, cy + hh, cz - hd] };
    const v5: BRepVertex = { id: 'v5', point: [cx + hw, cy + hh, cz - hd] };
    const v6: BRepVertex = { id: 'v6', point: [cx + hw, cy + hh, cz + hd] };
    const v7: BRepVertex = { id: 'v7', point: [cx - hw, cy + hh, cz + hd] };

    // 12 Edges
    const makeEdge = (id: string, va: BRepVertex, vb: BRepVertex): BRepEdge => ({
      id,
      startVertex: va,
      endVertex: vb,
      curve: new LineCurve3D(va.point, vb.point),
      range: [0, 1]
    });

    const e01 = makeEdge('e01', v0, v1);
    const e12 = makeEdge('e12', v1, v2);
    const e23 = makeEdge('e23', v2, v3);
    const e30 = makeEdge('e30', v3, v0);

    const e45 = makeEdge('e45', v4, v5);
    const e56 = makeEdge('e56', v5, v6);
    const e67 = makeEdge('e67', v6, v7);
    const e74 = makeEdge('e74', v7, v4);

    const e04 = makeEdge('e04', v0, v4);
    const e15 = makeEdge('e15', v1, v5);
    const e26 = makeEdge('e26', v2, v6);
    const e37 = makeEdge('e37', v3, v7);

    const makeWire = (id: string, edges: Array<{ edge: BRepEdge; forward: boolean }>): BRepWire => ({
      id,
      edges,
      isClosed: true
    });

    // 6 Faces with outward normals
    // Bottom (-Y): v3 -> v2 -> v1 -> v0
    const wBottom = makeWire('w_bottom', [
      { edge: e23, forward: false },
      { edge: e12, forward: false },
      { edge: e01, forward: false },
      { edge: e30, forward: false }
    ]);
    const fBottom: BRepFace = {
      id: 'face_bottom',
      outerBound: wBottom,
      innerBounds: [],
      surface: new PlaneSurface3D([cx, cy - hh, cz], [0, -1, 0], [1, 0, 0]),
      sameSense: true
    };

    // Top (+Y): v4 -> v5 -> v6 -> v7
    const wTop = makeWire('w_top', [
      { edge: e45, forward: true },
      { edge: e56, forward: true },
      { edge: e67, forward: true },
      { edge: e74, forward: true }
    ]);
    const fTop: BRepFace = {
      id: 'face_top',
      outerBound: wTop,
      innerBounds: [],
      surface: new PlaneSurface3D([cx, cy + hh, cz], [0, 1, 0], [1, 0, 0]),
      sameSense: true
    };

    // Front (+Z): v3 -> v7 -> v6 -> v2
    const wFront = makeWire('w_front', [
      { edge: e37, forward: true },
      { edge: e67, forward: false },
      { edge: e26, forward: false },
      { edge: e23, forward: true }
    ]);
    const fFront: BRepFace = {
      id: 'face_front',
      outerBound: wFront,
      innerBounds: [],
      surface: new PlaneSurface3D([cx, cy, cz + hd], [0, 0, 1], [1, 0, 0]),
      sameSense: true
    };

    // Back (-Z): v0 -> v1 -> v5 -> v4
    const wBack = makeWire('w_back', [
      { edge: e01, forward: true },
      { edge: e15, forward: true },
      { edge: e45, forward: false },
      { edge: e04, forward: false }
    ]);
    const fBack: BRepFace = {
      id: 'face_back',
      outerBound: wBack,
      innerBounds: [],
      surface: new PlaneSurface3D([cx, cy, cz - hd], [0, 0, -1], [-1, 0, 0]),
      sameSense: true
    };

    // Left (-X): v0 -> v4 -> v7 -> v3
    const wLeft = makeWire('w_left', [
      { edge: e04, forward: true },
      { edge: e74, forward: false },
      { edge: e37, forward: false },
      { edge: e30, forward: true }
    ]);
    const fLeft: BRepFace = {
      id: 'face_left',
      outerBound: wLeft,
      innerBounds: [],
      surface: new PlaneSurface3D([cx - hw, cy, cz], [-1, 0, 0], [0, 0, 1]),
      sameSense: true
    };

    // Right (+X): v1 -> v2 -> v6 -> v5
    const wRight = makeWire('w_right', [
      { edge: e12, forward: true },
      { edge: e26, forward: true },
      { edge: e56, forward: false },
      { edge: e15, forward: false }
    ]);
    const fRight: BRepFace = {
      id: 'face_right',
      outerBound: wRight,
      innerBounds: [],
      surface: new PlaneSurface3D([cx + hw, cy, cz], [1, 0, 0], [0, 0, -1]),
      sameSense: true
    };

    const shell: BRepShell = {
      id: 'shell_box',
      faces: [fBottom, fTop, fFront, fBack, fLeft, fRight],
      isClosed: true
    };

    return new BRepSolid('solid_box', 'Solid_Box', shell);
  }

  /**
   * Creates an exact analytical B-Rep Solid Cylinder
   * Features exact circular cap curves and analytical cylindrical surface
   */
  public static createCylinder(
    radius: number,
    height: number,
    center: [number, number, number] = [0, 0, 0],
    axis: [number, number, number] = [0, 1, 0]
  ): BRepSolid {
    const hh = height / 2;
    const [cx, cy, cz] = center;

    // Bottom center and top center
    const bottomCenter: [number, number, number] = [cx, cy - hh, cz];
    const topCenter: [number, number, number] = [cx, cy + hh, cz];

    // Reference vertices on boundary circles
    const vBottom0: BRepVertex = { id: 'v_b0', point: [cx + radius, cy - hh, cz] };
    const vBottom1: BRepVertex = { id: 'v_b1', point: [cx - radius, cy - hh, cz] };
    const vTop0: BRepVertex = { id: 'v_t0', point: [cx + radius, cy + hh, cz] };
    const vTop1: BRepVertex = { id: 'v_t1', point: [cx - radius, cy + hh, cz] };

    // Edges
    const eBottomCirc1: BRepEdge = {
      id: 'e_bot_circ1',
      startVertex: vBottom0,
      endVertex: vBottom1,
      curve: new CircleCurve3D(bottomCenter, [0, -1, 0], radius, [1, 0, 0]),
      range: [0, 0.5]
    };
    const eBottomCirc2: BRepEdge = {
      id: 'e_bot_circ2',
      startVertex: vBottom1,
      endVertex: vBottom0,
      curve: new CircleCurve3D(bottomCenter, [0, -1, 0], radius, [-1, 0, 0]),
      range: [0, 0.5]
    };

    const eTopCirc1: BRepEdge = {
      id: 'e_top_circ1',
      startVertex: vTop0,
      endVertex: vTop1,
      curve: new CircleCurve3D(topCenter, [0, 1, 0], radius, [1, 0, 0]),
      range: [0, 0.5]
    };
    const eTopCirc2: BRepEdge = {
      id: 'e_top_circ2',
      startVertex: vTop1,
      endVertex: vTop0,
      curve: new CircleCurve3D(topCenter, [0, 1, 0], radius, [-1, 0, 0]),
      range: [0, 0.5]
    };

    const eSeam0: BRepEdge = {
      id: 'e_seam0',
      startVertex: vBottom0,
      endVertex: vTop0,
      curve: new LineCurve3D(vBottom0.point, vTop0.point),
      range: [0, 1]
    };

    // Bottom Face (Plane)
    const fBottom: BRepFace = {
      id: 'face_cyl_bottom',
      outerBound: {
        id: 'w_cyl_bot',
        edges: [
          { edge: eBottomCirc1, forward: true },
          { edge: eBottomCirc2, forward: true }
        ],
        isClosed: true
      },
      innerBounds: [],
      surface: new PlaneSurface3D(bottomCenter, [0, -1, 0], [1, 0, 0]),
      sameSense: true
    };

    // Top Face (Plane)
    const fTop: BRepFace = {
      id: 'face_cyl_top',
      outerBound: {
        id: 'w_cyl_top',
        edges: [
          { edge: eTopCirc1, forward: true },
          { edge: eTopCirc2, forward: true }
        ],
        isClosed: true
      },
      innerBounds: [],
      surface: new PlaneSurface3D(topCenter, [0, 1, 0], [1, 0, 0]),
      sameSense: true
    };

    // Cylinder Body Face (CylinderSurface3D)
    const fBody: BRepFace = {
      id: 'face_cyl_body',
      outerBound: {
        id: 'w_cyl_body',
        edges: [
          { edge: eBottomCirc1, forward: false },
          { edge: eSeam0, forward: true },
          { edge: eTopCirc1, forward: true },
          { edge: eSeam0, forward: false }
        ],
        isClosed: true
      },
      innerBounds: [],
      surface: new CylinderSurface3D(bottomCenter, axis, radius, height, [1, 0, 0]),
      sameSense: true
    };

    const shell: BRepShell = {
      id: 'shell_cylinder',
      faces: [fBottom, fTop, fBody],
      isClosed: true
    };

    return new BRepSolid('solid_cylinder', 'Solid_Cylinder', shell);
  }

  /**
   * Creates an exact B-spline Lofted Solid between cross sections
   */
  public static createLoft(
    sections: Array<{ points: Array<[number, number, number]> }>,
    name: string = 'Lofted_Component'
  ): BRepSolid {
    if (sections.length < 2) {
      throw new Error('Loft requires at least 2 cross sections');
    }

    const secCount = sections.length;
    const ptCount = sections[0].points.length;

    // Grid of control points [u][v]
    const controlGrid: Array<Array<[number, number, number]>> = [];
    for (let u = 0; u < secCount; u++) {
      controlGrid.push([...sections[u].points]);
    }

    const bsplineSurf = new BSplineSurface3D(
      Math.min(3, secCount - 1),
      Math.min(3, ptCount - 1),
      controlGrid,
      [0, 0, 1, 1],
      [0, 0, 1, 1]
    );

    // Build end cap faces
    const startSection = sections[0];
    const endSection = sections[secCount - 1];

    const makeCapFace = (sec: { points: Array<[number, number, number]> }, id: string, normal: [number, number, number]): BRepFace => {
      const edges: BRepOrientedEdge[] = [];
      const n = sec.points.length;
      for (let i = 0; i < n; i++) {
        const pA = sec.points[i];
        const pB = sec.points[(i + 1) % n];
        const vA: BRepVertex = { id: `${id}_v${i}`, point: pA };
        const vB: BRepVertex = { id: `${id}_v${(i + 1) % n}`, point: pB };
        const edge: BRepEdge = {
          id: `${id}_e${i}`,
          startVertex: vA,
          endVertex: vB,
          curve: new LineCurve3D(pA, pB),
          range: [0, 1]
        };
        edges.push({ edge, forward: true });
      }

      return {
        id: `face_${id}`,
        outerBound: { id: `wire_${id}`, edges, isClosed: true },
        innerBounds: [],
        surface: new PlaneSurface3D(sec.points[0], normal),
        sameSense: true
      };
    };

    const fStart = makeCapFace(startSection, 'loft_start', [0, 0, -1]);
    const fEnd = makeCapFace(endSection, 'loft_end', [0, 0, 1]);

    // Side skin face
    const fSkin: BRepFace = {
      id: 'face_loft_skin',
      outerBound: {
        id: 'wire_loft_skin',
        edges: [],
        isClosed: true
      },
      innerBounds: [],
      surface: bsplineSurf,
      sameSense: true
    };

    const shell: BRepShell = {
      id: 'shell_loft',
      faces: [fStart, fEnd, fSkin],
      isClosed: true
    };

    return new BRepSolid(`solid_${name.toLowerCase()}`, name, shell);
  }
}
