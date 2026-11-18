import * as THREE from 'three';
import { ComponentSemanticType } from '../types';

export type ProvenanceClass =
  | 'manufacturer-CAD'
  | 'licensed-mesh'
  | 'photo-reconstruction'
  | 'user-created'
  | 'procedural-placeholder';

export interface AttachmentPoint {
  name: string;
  anchorId: string;
  localPosition: [number, number, number]; // SAE coordinates [x, y, z] in meters
  localRotation?: [number, number, number]; // Euler angles [rx, ry, rz] in radians
  required: boolean;
}

export interface MaterialBinding {
  materialId: string;
  type: 'body_paint' | 'matte_paint' | 'carbon_fiber' | 'forged_carbon' | 'glass' | 'chrome' | 'matte_black' | 'rubber' | 'aluminum';
  colorHex?: string;
  roughness?: number;
  metalness?: number;
  clearcoat?: number;
}

export interface ComponentDefinition {
  id: string;
  name: string;
  semanticType: ComponentSemanticType | string;
  parentId?: string;
  parentAnchorName?: string;
  attachmentPoints: AttachmentPoint[];
  material: MaterialBinding;
  provenance: ProvenanceClass;
  massEstimateKg: {
    value: number;
    isEstimate: true;
    formula?: string;
  };
  locked: boolean;
  visible: boolean;
  geometryHash: string;
  bounds?: {
    min: [number, number, number];
    max: [number, number, number];
  };
  customProperties?: Record<string, any>;
}

export interface ComponentNode extends ComponentDefinition {
  childrenIds: string[];
}

export class ComponentManager {
  private components: Map<string, ComponentDefinition> = new Map();

  constructor(initialComponents?: ComponentDefinition[]) {
    if (initialComponents) {
      for (const comp of initialComponents) {
        this.registerComponent(comp);
      }
    }
  }

  /**
   * Register a new vehicle component
   */
  public registerComponent(comp: ComponentDefinition): void {
    if (this.components.has(comp.id)) {
      throw new Error(`Component with ID '${comp.id}' is already registered.`);
    }
    // Verify parent exists if specified
    if (comp.parentId && !this.components.has(comp.parentId)) {
      // Allow late binding or check existing
    }
    this.components.set(comp.id, { ...comp });
  }

  /**
   * Update an existing component
   */
  public updateComponent(id: string, updates: Partial<ComponentDefinition>): void {
    const comp = this.components.get(id);
    if (!comp) {
      throw new Error(`Component '${id}' not found.`);
    }
    if (comp.locked && updates.locked !== false) {
      throw new Error(`Component '${id}' is locked against modifications.`);
    }
    this.components.set(id, { ...comp, ...updates });
  }

  /**
   * Remove a component and optionally its children
   */
  public removeComponent(id: string, cascade: boolean = false): void {
    if (!this.components.has(id)) return;

    const children = this.getChildren(id);
    if (children.length > 0 && !cascade) {
      throw new Error(
        `Cannot remove component '${id}' because it has active children: ${children.map(c => c.id).join(', ')}. Use cascade=true to remove all.`
      );
    }

    if (cascade) {
      for (const child of children) {
        this.removeComponent(child.id, true);
      }
    }

    this.components.delete(id);
  }

  /**
   * Get component by ID
   */
  public getComponent(id: string): ComponentDefinition | undefined {
    return this.components.get(id);
  }

  /**
   * List all registered components
   */
  public getAllComponents(): ComponentDefinition[] {
    return Array.from(this.components.values());
  }

  /**
   * Retrieve children of a specific component
   */
  public getChildren(parentId: string): ComponentDefinition[] {
    return Array.from(this.components.values()).filter(c => c.parentId === parentId);
  }

  /**
   * Build the complete component hierarchy tree and verify no cycles exist
   */
  public buildHierarchy(): ComponentNode[] {
    const nodes = new Map<string, ComponentNode>();
    for (const comp of this.components.values()) {
      nodes.set(comp.id, { ...comp, childrenIds: [] });
    }

    const rootNodes: ComponentNode[] = [];

    for (const node of nodes.values()) {
      if (node.parentId) {
        const parent = nodes.get(node.parentId);
        if (parent) {
          parent.childrenIds.push(node.id);
        } else {
          // Parent missing or detached; treat as root
          rootNodes.push(node);
        }
      } else {
        rootNodes.push(node);
      }
    }

    // Cycle detection using DFS across all nodes (including isolated cycles with no roots)
    const visited = new Set<string>();
    const inStack = new Set<string>();

    const checkCycle = (nodeId: string) => {
      visited.add(nodeId);
      inStack.add(nodeId);

      const node = nodes.get(nodeId);
      if (node) {
        for (const childId of node.childrenIds) {
          if (!visited.has(childId)) {
            checkCycle(childId);
          } else if (inStack.has(childId)) {
            throw new Error(`Cycle detected in component hierarchy involving '${childId}'!`);
          }
        }
      }
      inStack.delete(nodeId);
    };

    for (const node of nodes.values()) {
      if (!visited.has(node.id)) {
        checkCycle(node.id);
      }
    }

    return Array.from(nodes.values());
  }

  /**
   * Mirror a component across the SAE vehicle symmetry plane (Y=0)
   */
  public mirrorComponent(sourceId: string, targetId: string, targetName: string): ComponentDefinition {
    const source = this.components.get(sourceId);
    if (!source) {
      throw new Error(`Source component '${sourceId}' not found for mirroring.`);
    }

    const replaceLeftWithRight = (str: string): string => {
      return str
        .replace(/_left\b/g, '_right')
        .replace(/_l\b/g, '_r')
        .replace(/\bleft\b/g, 'right')
        .replace(/\bl\b/g, 'r');
    };

    const mirroredAttachmentPoints: AttachmentPoint[] = source.attachmentPoints.map(p => ({
      name: replaceLeftWithRight(p.name),
      anchorId: replaceLeftWithRight(p.anchorId),
      localPosition: [p.localPosition[0], -p.localPosition[1], p.localPosition[2]], // Invert Y for SAE symmetry
      localRotation: p.localRotation
        ? [p.localRotation[0], -p.localRotation[1], -p.localRotation[2]]
        : undefined,
      required: p.required
    }));

    let mirroredBounds: ComponentDefinition['bounds'] = undefined;
    if (source.bounds) {
      mirroredBounds = {
        min: [source.bounds.min[0], -source.bounds.max[1], source.bounds.min[2]],
        max: [source.bounds.max[0], -source.bounds.min[1], source.bounds.max[2]]
      };
    }

    const mirroredSemanticType = source.semanticType
      .replace(/_left\b/g, '_right')
      .replace(/_l\b/g, '_r')
      .replace(/_fl\b/g, '_fr')
      .replace(/_rl\b/g, '_rr');

    const mirroredComp: ComponentDefinition = {
      ...source,
      id: targetId,
      name: targetName,
      semanticType: mirroredSemanticType,
      parentId: source.parentId,
      attachmentPoints: mirroredAttachmentPoints,
      bounds: mirroredBounds,
      geometryHash: `${source.geometryHash}_mirrored_y0`,
      locked: false
    };

    this.registerComponent(mirroredComp);
    return mirroredComp;
  }

  /**
   * Calculate total vehicle mass estimate
   */
  public calculateTotalMassEstimate(): { totalMassKg: number; isEstimate: true; componentCount: number } {
    let total = 0;
    for (const comp of this.components.values()) {
      total += comp.massEstimateKg.value;
    }
    return {
      totalMassKg: Math.round(total * 10) / 10,
      isEstimate: true,
      componentCount: this.components.size
    };
  }

  /**
   * Export all components to deterministic JSON representation
   */
  public toJSON(): string {
    const sorted = Array.from(this.components.values()).sort((a, b) => a.id.localeCompare(b.id));
    return JSON.stringify(sorted, null, 2);
  }

  /**
   * Import from JSON
   */
  public static fromJSON(jsonStr: string): ComponentManager {
    const list = JSON.parse(jsonStr) as ComponentDefinition[];
    return new ComponentManager(list);
  }
}
