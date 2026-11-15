import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { DatabaseRepository, OfflineJobQueue, createServer } from '../backend/src';
import { normalizeCheraxConfig } from '@autoverse/json-intelligence';
import { CheraxVehicleConfig } from '@autoverse/shared-types';

const rawCheraxJson: CheraxVehicleConfig = {
  format: 'Cherax Entity',
  type: 1,
  model: 2709293299,
  baseFlags: 1073808655,
  mods: {
    mod0: { index: 2, variation: false },
    mod49: { index: 1, variation: false }
  },
  extras: { extra1: true },
  wheelType: 8,
  wheelColor: 156,
  bulletproofTyres: true,
  driftTyres: false,
  tyreSmokeColor: { r: 0, g: 234, b: 255 },
  neonKits: {
    left: true,
    right: true,
    front: true,
    back: true,
    color: { r: 0, g: 234, b: 255 }
  },
  primaryColor: 0,
  secondaryColor: 0,
  pearlescentColor: 0,
  isPrimaryColorCustom: true,
  customPrimaryColor: { r: 0, g: 234, b: 255 },
  isSecondaryColorCustom: false,
  customSecondaryColor: { r: 17, g: 17, b: 17 },
  windowTint: 1,
  interiorColor: 0,
  dashBoardColor: 0,
  plateText: 'BMW M3  ',
  plateTextIndex: 0
};

const spec = normalizeCheraxConfig(rawCheraxJson, 'BMW_M3_TEST.json');

describe('DatabaseRepository (SQLite WAL)', () => {
  let repo: DatabaseRepository;

  beforeAll(() => {
    repo = new DatabaseRepository(':memory:');
  });

  afterAll(() => {
    repo.close();
  });

  it('inserts and retrieves vehicle specifications', () => {
    repo.upsertVehicle({
      id: spec.id,
      filename: spec.sourceFilename,
      model_hash: spec.modelHashUnsigned,
      format: spec.sourceFormat,
      spec_json: JSON.stringify(spec),
      raw_json: JSON.stringify(rawCheraxJson),
      created_at: Date.now(),
      updated_at: Date.now()
    });

    const retrieved = repo.getVehicle(spec.id);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.filename).toBe('BMW_M3_TEST.json');
    expect(retrieved?.model_hash).toBe(2709293299);
  });

  it('lists vehicles in database', () => {
    const list = repo.listVehicles();
    expect(list.length).toBeGreaterThanOrEqual(1);
    expect(list[0].id).toBe(spec.id);
  });

  it('records and queries history snapshots', () => {
    repo.recordHistory({
      id: 'h1',
      vehicle_id: spec.id,
      action: 'PAINT_CHANGE',
      state_json: JSON.stringify({ color: '#00EAFF' }),
      created_at: Date.now()
    });

    const history = repo.getHistory(spec.id);
    expect(history.length).toBe(1);
    expect(history[0].action).toBe('PAINT_CHANGE');
  });
});

describe('OfflineJobQueue (Persistent Background Queue)', () => {
  let repo: DatabaseRepository;
  let queue: OfflineJobQueue;

  beforeAll(() => {
    repo = new DatabaseRepository(':memory:');
    queue = new OfflineJobQueue(repo);
  });

  afterAll(() => {
    queue.stop();
    repo.close();
  });

  it('enqueues and processes background tasks with progress tracking', async () => {
    let progressSeen = 0;
    queue.registerHandler('CALCULATE_SUM', async (payload: { a: number; b: number }, onProgress) => {
      onProgress(50);
      progressSeen = 50;
      return { sum: payload.a + payload.b };
    });

    const jobId = queue.enqueue('CALCULATE_SUM', { a: 10, b: 32 });
    expect(jobId).toBeDefined();

    const queuedJob = queue.getJob(jobId);
    expect(queuedJob?.status).toBe('QUEUED');

    // Process job
    const processed = await queue.processNext();
    expect(processed).toBe(true);

    const finishedJob = queue.getJob(jobId);
    expect(finishedJob?.status).toBe('COMPLETED');
    expect(finishedJob?.progress).toBe(100);
    expect(progressSeen).toBe(50);

    const result = JSON.parse(finishedJob!.result_json!);
    expect(result.sum).toBe(42);
  });

  it('handles job errors gracefully without crashing the server', async () => {
    queue.registerHandler('FAILING_TASK', async () => {
      throw new Error('Intentional task failure for test');
    });

    const jobId = queue.enqueue('FAILING_TASK', {});
    await queue.processNext();

    const job = queue.getJob(jobId);
    expect(job?.status).toBe('FAILED');
    expect(job?.error).toContain('Intentional task failure');
  });
});

describe('Fastify REST API & Loopback Endpoints', () => {
  let serverInstance: ReturnType<typeof createServer>;

  beforeAll(() => {
    serverInstance = createServer({ dbPath: ':memory:' });
  });

  afterAll(async () => {
    serverInstance.queue.stop();
    serverInstance.repo.close();
    await serverInstance.app.close();
  });

  it('responds to GET /health', async () => {
    const res = await serverInstance.app.inject({
      method: 'GET',
      url: '/health'
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body.status).toBe('ok');
    expect(body.offline).toBe(true);
  });

  it('allows saving and listing vehicle specifications', async () => {
    const postRes = await serverInstance.app.inject({
      method: 'POST',
      url: '/api/vehicles',
      payload: { spec }
    });
    expect(postRes.statusCode).toBe(201);

    const getRes = await serverInstance.app.inject({
      method: 'GET',
      url: '/api/vehicles'
    });
    expect(getRes.statusCode).toBe(200);
    const list = JSON.parse(getRes.payload);
    expect(list.total).toBeGreaterThanOrEqual(1);
    expect(list.vehicles[0].id).toBe(spec.id);
  });

  it('enqueues and checks background jobs via REST', async () => {
    const postJob = await serverInstance.app.inject({
      method: 'POST',
      url: '/api/jobs',
      payload: { type: 'BATCH_EXPORT_ZIP', payload: {} }
    });
    expect(postJob.statusCode).toBe(202);
    const { jobId } = JSON.parse(postJob.payload);

    const getJob = await serverInstance.app.inject({
      method: 'GET',
      url: `/api/jobs/${jobId}`
    });
    expect(getJob.statusCode).toBe(200);
    const jobData = JSON.parse(getJob.payload);
    expect(jobData.id).toBe(jobId);
  });

  it('exports Cherax JSON via /api/export/cherax', async () => {
    const res = await serverInstance.app.inject({
      method: 'POST',
      url: '/api/export/cherax',
      payload: { spec }
    });
    expect(res.statusCode).toBe(200);
    const { json } = JSON.parse(res.payload);
    const parsed = JSON.parse(json);
    expect(parsed.model).toBe(2709293299);
  });

  it('exports FiveM XML via /api/export/fivem', async () => {
    const res = await serverInstance.app.inject({
      method: 'POST',
      url: '/api/export/fivem',
      payload: { spec, spawnName: 'sentinel5' }
    });
    expect(res.statusCode).toBe(200);
    const { xml } = JSON.parse(res.payload);
    expect(xml).toContain('<modelName>sentinel5</modelName>');
  });
});

