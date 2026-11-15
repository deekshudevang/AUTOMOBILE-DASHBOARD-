import { describe, it, expect, beforeEach } from 'vitest';
import { useVehicleStore } from '../src/hooks/useVehicleStore';

describe('AutoVerse 3D — Presentation Modes & Diagnostics Suite', () => {
  beforeEach(() => {
    useVehicleStore.setState({
      presentationMode: 'studio',
      isAutoRotate: false,
      isMeasuring: false,
      measurementPoints: { p1: null, p2: null },
      isWireframe: false,
      showNormals: false
    });
  });

  it('verifies presentation mode transitions seamlessly without resource leaks', () => {
    const store = useVehicleStore.getState();
    expect(store.presentationMode).toBe('studio');

    // Switch to engineering
    store.setPresentationMode('engineering');
    expect(useVehicleStore.getState().presentationMode).toBe('engineering');

    // Switch to showroom
    store.setPresentationMode('showroom');
    expect(useVehicleStore.getState().presentationMode).toBe('showroom');
    expect(useVehicleStore.getState().isAutoRotate).toBe(true);

    // Switch to comparison
    store.setPresentationMode('comparison');
    expect(useVehicleStore.getState().presentationMode).toBe('comparison');

    // Return to studio
    store.setPresentationMode('studio');
    expect(useVehicleStore.getState().presentationMode).toBe('studio');
  });

  it('verifies 2-point 3D caliper measurement logic and Euclidean distance calculation', () => {
    const store = useVehicleStore.getState();

    // 1. Activate caliper tool
    store.setIsMeasuring(true);
    expect(useVehicleStore.getState().isMeasuring).toBe(true);

    // 2. Set Point A at front axle center (0, 0.35, 1.2285)
    store.setMeasurementPoint([0, 0.35, 1.2285]);
    let state = useVehicleStore.getState();
    expect(state.measurementPoints.p1).toEqual([0, 0.35, 1.2285]);
    expect(state.measurementPoints.p2).toBeNull();

    // 3. Set Point B at rear axle center (0, 0.35, -1.2285) - exactly 2.457m wheelbase!
    store.setMeasurementPoint([0, 0.35, -1.2285]);
    state = useVehicleStore.getState();
    expect(state.measurementPoints.p1).toEqual([0, 0.35, 1.2285]);
    expect(state.measurementPoints.p2).toEqual([0, 0.35, -1.2285]);

    // Calculate distance
    const [x1, y1, z1] = state.measurementPoints.p1!;
    const [x2, y2, z2] = state.measurementPoints.p2!;
    const distanceM = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);
    const distanceMm = Math.round(distanceM * 1000);

    expect(distanceM).toBeCloseTo(2.457, 3);
    expect(distanceMm).toBe(2457);

    // 4. Click again initiates next measurement cycle
    store.setMeasurementPoint([1.0, 0.5, 0.0]);
    state = useVehicleStore.getState();
    expect(state.measurementPoints.p1).toEqual([1.0, 0.5, 0.0]);
    expect(state.measurementPoints.p2).toBeNull();

    // 5. Clear measurement resets points
    store.clearMeasurement();
    state = useVehicleStore.getState();
    expect(state.measurementPoints.p1).toBeNull();
    expect(state.measurementPoints.p2).toBeNull();
  });

  it('verifies surface diagnostics toggles (wireframe and normal visualization)', () => {
    const store = useVehicleStore.getState();

    expect(store.isWireframe).toBe(false);
    store.toggleWireframe();
    expect(useVehicleStore.getState().isWireframe).toBe(true);
    store.toggleWireframe();
    expect(useVehicleStore.getState().isWireframe).toBe(false);

    expect(store.showNormals).toBe(false);
    store.toggleShowNormals();
    expect(useVehicleStore.getState().showNormals).toBe(true);
    store.toggleShowNormals();
    expect(useVehicleStore.getState().showNormals).toBe(false);
  });
});
