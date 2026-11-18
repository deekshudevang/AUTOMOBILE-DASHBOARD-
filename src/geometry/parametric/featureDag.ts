export type FeatureType =
  | 'DATUM_PLANE'
  | 'SKETCH_SECTION'
  | 'LOFT_BODY'
  | 'SWEEP_AERO'
  | 'FILLET_CHAMFER'
  | 'SHELL_HOLLOW'
  | 'BOOLEAN_CUT'
  | 'COMPONENT_INSTANCE';

export type FeatureStatus = 'VALID' | 'STALE' | 'FAILED' | 'PENDING';

export interface FeatureNode<T = any> {
  id: string;
  name: string;
  type: FeatureType;
  parameters: T;
  parentIds: string[];
  childIds: string[];
  status: FeatureStatus;
  geometryHash: string;
  timestamp: number;
  errorMessage?: string;
  output?: any;
}

export interface FeatureDagSnapshot {
  features: Record<string, FeatureNode>;
  rootIds: string[];
  version: number;
}

/**
 * Phase 5.1 & 5.5: Parametric Feature DAG Engine
 * Implements deterministic dependency rebuilds, failure isolation, and topological execution.
 */
export class FeatureDagEngine {
  private features = new Map<string, FeatureNode>();
  private historyStack: FeatureDagSnapshot[] = [];
  private historyIndex = -1;
  private version = 1;

  public addFeature<T>(feature: Omit<FeatureNode<T>, 'childIds' | 'status' | 'geometryHash' | 'timestamp'>): FeatureNode<T> {
    const node: FeatureNode<T> = {
      ...feature,
      childIds: [],
      status: 'PENDING',
      geometryHash: '',
      timestamp: Date.now()
    };

    this.features.set(node.id, node);

    // Link parents to this child
    for (const pId of node.parentIds) {
      const parent = this.features.get(pId);
      if (parent && !parent.childIds.includes(node.id)) {
        parent.childIds.push(node.id);
      }
    }

    this.recordCheckpoint();
    return node;
  }

  public getFeature(id: string): FeatureNode | undefined {
    return this.features.get(id);
  }

  public getAllFeatures(): FeatureNode[] {
    return Array.from(this.features.values());
  }

  /**
   * Topological sort of feature dependencies (Kahn's algorithm)
   */
  public getTopologicalOrder(): string[] {
    const inDegree = new Map<string, number>();
    for (const [id, f] of this.features.entries()) {
      inDegree.set(id, f.parentIds.filter(p => this.features.has(p)).length);
    }

    const queue: string[] = [];
    for (const [id, deg] of inDegree.entries()) {
      if (deg === 0) queue.push(id);
    }

    const order: string[] = [];
    while (queue.length > 0) {
      const curr = queue.shift()!;
      order.push(curr);

      const node = this.features.get(curr);
      if (node) {
        for (const childId of node.childIds) {
          const newDeg = (inDegree.get(childId) || 1) - 1;
          inDegree.set(childId, newDeg);
          if (newDeg === 0) {
            queue.push(childId);
          }
        }
      }
    }

    if (order.length !== this.features.size) {
      throw new Error('Cyclic dependency detected in Feature DAG');
    }

    return order;
  }

  /**
   * Updates an earlier feature and triggers deterministic cascade rebuild
   */
  public updateFeature<T>(
    id: string,
    newParams: Partial<T>,
    rebuilder?: (node: FeatureNode) => { success: boolean; hash: string; error?: string }
  ): { rebuiltCount: number; failedNodeId?: string } {
    const node = this.features.get(id);
    if (!node) throw new Error(`Feature ${id} not found in DAG`);

    node.parameters = { ...node.parameters, ...newParams };
    node.timestamp = Date.now();

    // Mark all descendants as STALE
    const markDescendantsStale = (currId: string) => {
      const curr = this.features.get(currId);
      if (curr) {
        for (const cId of curr.childIds) {
          const child = this.features.get(cId);
          if (child) {
            child.status = 'STALE';
            markDescendantsStale(cId);
          }
        }
      }
    };
    markDescendantsStale(id);

    // Rebuild in topological order from id forward
    const order = this.getTopologicalOrder();
    const startIndex = order.indexOf(id);

    let rebuiltCount = 0;
    let failedNodeId: string | undefined = undefined;

    for (let i = startIndex; i < order.length; i++) {
      const currNode = this.features.get(order[i])!;

      if (rebuilder) {
        try {
          const res = rebuilder(currNode);
          if (res.success) {
            currNode.status = 'VALID';
            currNode.geometryHash = res.hash;
            currNode.errorMessage = undefined;
            rebuiltCount++;
          } else {
            currNode.status = 'FAILED';
            currNode.errorMessage = res.error || 'Rebuild failed';
            failedNodeId = currNode.id;
            break; // Isolate failure
          }
        } catch (err: any) {
          currNode.status = 'FAILED';
          currNode.errorMessage = err.message;
          failedNodeId = currNode.id;
          break; // Isolate failure
        }
      } else {
        currNode.status = 'VALID';
        currNode.geometryHash = `hash_${currNode.id}_${Date.now()}`;
        rebuiltCount++;
      }
    }

    this.recordCheckpoint();
    return { rebuiltCount, failedNodeId };
  }

  /**
   * Records a snapshot for undo/redo
   */
  private recordCheckpoint(): void {
    const snapshot: FeatureDagSnapshot = {
      features: JSON.parse(JSON.stringify(Object.fromEntries(this.features.entries()))),
      rootIds: Array.from(this.features.values()).filter(f => f.parentIds.length === 0).map(f => f.id),
      version: this.version++
    };

    // Truncate redo history if appending from middle
    if (this.historyIndex < this.historyStack.length - 1) {
      this.historyStack = this.historyStack.slice(0, this.historyIndex + 1);
    }

    this.historyStack.push(snapshot);
    this.historyIndex = this.historyStack.length - 1;
  }

  public undo(): boolean {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.restoreSnapshot(this.historyStack[this.historyIndex]);
      return true;
    }
    return false;
  }

  public redo(): boolean {
    if (this.historyIndex < this.historyStack.length - 1) {
      this.historyIndex++;
      this.restoreSnapshot(this.historyStack[this.historyIndex]);
      return true;
    }
    return false;
  }

  public serialize(): string {
    return JSON.stringify(Array.from(this.features.values()), null, 2);
  }

  public static deserialize(jsonStr: string): FeatureDagEngine {
    const dag = new FeatureDagEngine();
    const list = JSON.parse(jsonStr) as FeatureNode[];
    for (const node of list) {
      dag.features.set(node.id, { ...node });
    }
    dag.recordCheckpoint();
    return dag;
  }

  private restoreSnapshot(snap: FeatureDagSnapshot): void {
    this.features.clear();
    for (const [id, f] of Object.entries(snap.features)) {
      this.features.set(id, { ...f });
    }
    this.version = snap.version;
  }
}

export { FeatureDagEngine as FeatureDag };
