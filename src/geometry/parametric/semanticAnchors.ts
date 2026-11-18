export interface SemanticAnchor {
  anchorId: string;
  name: string;
  parentComponentId: string;
  nominalCoordinates: [number, number, number]; // SAE [X, Y, Z]
  normalVector: [number, number, number];
  tangentVector: [number, number, number];
  isDatum: boolean;
}

export class SemanticAnchorRegistry {
  private anchors = new Map<string, SemanticAnchor>();

  public registerAnchor(anchor: SemanticAnchor): void {
    this.anchors.set(anchor.anchorId, anchor);
  }

  public getAnchor(id: string): SemanticAnchor | undefined {
    return this.anchors.get(id);
  }

  public getAllAnchors(): SemanticAnchor[] {
    return Array.from(this.anchors.values());
  }

  /**
   * Generates standard automotive datum anchors
   */
  public static createStandardVehicleAnchors(): SemanticAnchorRegistry {
    const reg = new SemanticAnchorRegistry();

    reg.registerAnchor({
      anchorId: 'DATUM_FRONT_AXLE',
      name: 'Front Axle Centerline Datum',
      parentComponentId: 'chassis',
      nominalCoordinates: [0.0, 0.0, 0.33],
      normalVector: [0, 0, 1],
      tangentVector: [1, 0, 0],
      isDatum: true
    });

    reg.registerAnchor({
      anchorId: 'DATUM_REAR_AXLE',
      name: 'Rear Axle Centerline Datum',
      parentComponentId: 'chassis',
      nominalCoordinates: [-2.50, 0.0, 0.33],
      normalVector: [0, 0, 1],
      tangentVector: [1, 0, 0],
      isDatum: true
    });

    reg.registerAnchor({
      anchorId: 'ANCHOR_SPLITTER_MOUNT',
      name: 'Front Splitter Subframe Anchor',
      parentComponentId: 'front_bumper',
      nominalCoordinates: [0.95, 0.0, 0.12],
      normalVector: [0, 1, 0],
      tangentVector: [1, 0, 0],
      isDatum: false
    });

    reg.registerAnchor({
      anchorId: 'ANCHOR_REAR_WING_DECK',
      name: 'Rear Wing Pylon Structural Deck Mount',
      parentComponentId: 'engine_cover',
      nominalCoordinates: [-3.10, 0.0, 0.85],
      normalVector: [0, 0, 1],
      tangentVector: [0, 1, 0],
      isDatum: false
    });

    reg.registerAnchor({
      anchorId: 'ANCHOR_DIFFUSER_HINGE',
      name: 'Rear Diffuser Flat Floor Hinge',
      parentComponentId: 'underbody',
      nominalCoordinates: [-2.20, 0.0, 0.10],
      normalVector: [0, 0, 1],
      tangentVector: [1, 0, 0],
      isDatum: false
    });

    return reg;
  }
}
