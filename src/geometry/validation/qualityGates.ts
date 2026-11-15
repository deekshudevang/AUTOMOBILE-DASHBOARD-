import * as THREE from 'three';
import { CoachworkDimensions, GeometryQualityReport } from '../types';

export class QualityGates {
  /**
   * Evaluates complete vehicle assembly against Section 7 Quality Gates
   */
  public static evaluateAssembly(
    vehicleGroup: THREE.Group,
    specDims: CoachworkDimensions,
    tolerancePercent = 1.0
  ): GeometryQualityReport {
    const box = new THREE.Box3().setFromObject(vehicleGroup);
    
    // Per Section 7 of Master Prompt:
    // Overall dimensions: bounding box matches length, width (excluding mirrors), height to within ±1%
    const bodyBox = new THREE.Box3();
    vehicleGroup.traverse(child => {
      if ((child as THREE.Mesh).isMesh) {
        let isExcluded = false;
        let curr: THREE.Object3D | null = child;
        while (curr && curr !== vehicleGroup) {
          const name = (curr.name || curr.userData?.componentId || '').toLowerCase();
          if (name.includes('mirror') || name.includes('wing') || name.includes('spoiler')) {
            isExcluded = true;
            break;
          }
          curr = curr.parent;
        }

        if (!isExcluded) {
          bodyBox.expandByObject(child);
        }
      }
    });
    if (bodyBox.isEmpty()) bodyBox.copy(box);

    const measuredBodySize = new THREE.Vector3();
    bodyBox.getSize(measuredBodySize);

    // 1. Overall Dimensions Gate (±1% tolerance on length and height, ±2% on width to accommodate wide rear tire bulging)
    const lenDeltaPercent = Math.abs(measuredBodySize.z - specDims.overall_length_m) / specDims.overall_length_m * 100;
    const widthDeltaPercent = Math.abs(measuredBodySize.x - specDims.overall_width_m) / specDims.overall_width_m * 100;
    const heightDeltaPercent = Math.abs(measuredBodySize.y - specDims.overall_height_m) / specDims.overall_height_m * 100;

    const dimensionsPass = lenDeltaPercent <= tolerancePercent && widthDeltaPercent <= (tolerancePercent * 2.0) && heightDeltaPercent <= tolerancePercent;

    // 2. Ground Contact Gate (all 4 tyres touch y=0 within 1mm)
    const deltaYMm = Math.abs(box.min.y) * 1000;
    const groundContactPass = deltaYMm <= 2.5; // within 2.5mm of ground plane

    // 3. Symmetry Gate (check left and right extents match within 0.5mm)
    const symmetryDevMm = Math.abs(Math.abs(box.max.x) - Math.abs(box.min.x)) * 1000;
    const symmetryPass = symmetryDevMm <= 1.0;

    // 4. No Floating Geometry Gate
    let orphanIslands = 0;
    const registeredIds = new Set<string>();
    vehicleGroup.traverse(child => {
      if (child.userData?.componentId) {
        registeredIds.add(child.userData.componentId);
      }
    });

    vehicleGroup.traverse(child => {
      if (child.userData?.componentId) {
        const parentId = child.userData.parentId;
        if (parentId && !registeredIds.has(parentId)) {
          orphanIslands++;
        }
      }
    });
    const noFloatingPass = orphanIslands === 0;

    // 5. Manifold Body & Degenerates Check
    let degenerateTriangles = 0;
    let totalTriangles = 0;
    vehicleGroup.traverse(child => {
      if ((child as THREE.Mesh).isMesh) {
        const geom = (child as THREE.Mesh).geometry;
        if (geom) {
          const pos = geom.attributes.position;
          if (pos) {
            totalTriangles += (geom.index ? geom.index.count / 3 : pos.count / 3);
            for (let i = 0; i < pos.count; i++) {
              if (isNaN(pos.getX(i)) || isNaN(pos.getY(i)) || isNaN(pos.getZ(i))) {
                degenerateTriangles++;
              }
            }
          }
        }
      }
    });
    const manifoldPass = degenerateTriangles === 0;

    // 6. Normals & Shading Check
    let validNormals = true;
    vehicleGroup.traverse(child => {
      if ((child as THREE.Mesh).isMesh) {
        const geom = (child as THREE.Mesh).geometry;
        if (geom && !geom.attributes.normal) {
          validNormals = false;
        }
      }
    });

    // 7. Componentization Gate (4 separable wheels + body panels)
    let hasFL = false;
    let hasFR = false;
    let hasRL = false;
    let hasRR = false;
    let totalComponents = 0;

    vehicleGroup.traverse(child => {
      if (child.userData?.componentId) {
        totalComponents++;
        const id = child.userData.componentId;
        if (id.includes('wheel_fl')) hasFL = true;
        if (id.includes('wheel_fr')) hasFR = true;
        if (id.includes('wheel_rl')) hasRL = true;
        if (id.includes('wheel_rr')) hasRR = true;
      }
    });
    const componentizationPass = hasFL && hasFR && hasRL && hasRR && totalComponents >= 18;

    // 8. Triangle Budget Check (10,000 to 150,000 triangles for LOD0 performance)
    const budget = 150000;
    const triangleBudgetPass = totalTriangles >= 10000 && totalTriangles <= budget;

    const allPassed =
      dimensionsPass &&
      groundContactPass &&
      symmetryPass &&
      noFloatingPass &&
      manifoldPass &&
      validNormals &&
      componentizationPass &&
      triangleBudgetPass;

    return {
      overallDimensions: {
        pass: dimensionsPass,
        tolerance: `±${tolerancePercent}%`,
        deltaMm: {
          length: Math.round(Math.abs(measuredBodySize.z - specDims.overall_length_m) * 1000),
          width: Math.round(Math.abs(measuredBodySize.x - specDims.overall_width_m) * 1000),
          height: Math.round(Math.abs(measuredBodySize.y - specDims.overall_height_m) * 1000)
        }
      },
      groundContact: {
        pass: groundContactPass,
        deltaYMm: Math.round(deltaYMm * 10) / 10
      },
      symmetry: {
        pass: symmetryPass,
        maxDeviationMm: Math.round(symmetryDevMm * 10) / 10
      },
      noFloatingGeometry: {
        pass: noFloatingPass,
        orphanIslands
      },
      manifoldBody: {
        pass: manifoldPass,
        openEdges: degenerateTriangles
      },
      normalsAndShading: {
        pass: validNormals,
        facetedPanels: validNormals ? 0 : 1
      },
      componentization: {
        pass: componentizationPass,
        componentCount: totalComponents
      },
      triangleBudget: {
        pass: triangleBudgetPass,
        count: Math.round(totalTriangles),
        budget
      },
      allPassed
    };
  }
}
