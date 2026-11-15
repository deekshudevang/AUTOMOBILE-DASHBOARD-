import fastify from 'fastify';
import cors from '@fastify/cors';
import path from 'path';
import { DatabaseRepository } from './db';
import { OfflineJobQueue } from './queue';
import { VehicleExporter } from '@autoverse/vehicle-exporter';
import { normalizeCheraxConfig } from '@autoverse/json-intelligence';

export function createServer(options: { dbPath?: string; logger?: boolean } = {}) {
  const app = fastify({ logger: options.logger ?? false });

  // 100% offline local loopback CORS
  app.register(cors, {
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:4173',
      'http://127.0.0.1:4173'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  });

  const defaultDbPath = path.resolve(process.cwd(), 'backend', 'autoverse.db');
  const repo = new DatabaseRepository(options.dbPath || defaultDbPath);
  const queue = new OfflineJobQueue(repo);

  // Register offline batch workers
  queue.registerHandler('BATCH_IMPORT', async (payload: { files: { name: string; content: string }[] }, onProgress) => {
    const results = [];
    const total = payload.files.length;
    for (let i = 0; i < total; i++) {
      const file = payload.files[i];
      try {
        const rawJson = JSON.parse(file.content);
        const spec = normalizeCheraxConfig(rawJson, file.name);
        repo.upsertVehicle({
          id: spec.id,
          filename: file.name,
          model_hash: spec.modelHashUnsigned,
          format: spec.sourceFormat,
          spec_json: JSON.stringify(spec),
          raw_json: file.content,
          created_at: Date.now(),
          updated_at: Date.now()
        });
        results.push({ filename: file.name, success: true, id: spec.id });
      } catch (err: any) {
        results.push({ filename: file.name, success: false, error: err.message });
      }
      onProgress(Math.round(((i + 1) / total) * 100));
    }
    return { total, results };
  });

  queue.registerHandler('BATCH_EXPORT_ZIP', async (payload: { vehicleIds?: string[] }, onProgress) => {
    onProgress(20);
    const records = repo.listVehicles();
    const filtered = payload.vehicleIds?.length
      ? records.filter(r => payload.vehicleIds!.includes(r.id))
      : records;
    
    onProgress(50);
    const specs = filtered.map(r => JSON.parse(r.spec_json));
    const rawMap: Record<string, string> = {};
    for (const r of filtered) {
      if (r.raw_json) rawMap[r.filename] = r.raw_json;
    }

    const zipBuffer = await VehicleExporter.exportBatchZip(specs, rawMap);
    onProgress(100);
    return {
      count: specs.length,
      byteLength: zipBuffer.byteLength,
      base64Zip: Buffer.from(zipBuffer).toString('base64')
    };
  });

  // Start background job polling
  queue.start(500);

  // --- REST Routes ---

  // Health
  app.get('/health', async () => {
    return { status: 'ok', offline: true, service: 'AUTOVERSE 3D Local Backend', timestamp: Date.now() };
  });

  // Vehicles CRUD
  app.get('/api/vehicles', async () => {
    const records = repo.listVehicles();
    return {
      total: records.length,
      vehicles: records.map(r => ({
        id: r.id,
        filename: r.filename,
        modelHash: r.model_hash,
        format: r.format,
        spec: JSON.parse(r.spec_json),
        updatedAt: r.updated_at
      }))
    };
  });

  app.get<{ Params: { id: string } }>('/api/vehicles/:id', async (req, reply) => {
    const record = repo.getVehicle(req.params.id);
    if (!record) {
      return reply.code(404).send({ error: 'Vehicle not found' });
    }
    return {
      id: record.id,
      filename: record.filename,
      modelHash: record.model_hash,
      format: record.format,
      spec: JSON.parse(record.spec_json),
      rawJson: record.raw_json,
      updatedAt: record.updated_at
    };
  });

  app.post<{ Body: { spec: any; rawJson?: string } }>('/api/vehicles', async (req, reply) => {
    const { spec, rawJson } = req.body;
    if (!spec || !spec.id || !spec.sourceFilename) {
      return reply.code(400).send({ error: 'Invalid vehicle specification payload' });
    }
    const record = {
      id: spec.id,
      filename: spec.sourceFilename,
      model_hash: spec.modelHashUnsigned || 0,
      format: spec.sourceFormat || 'Cherax Entity',
      spec_json: JSON.stringify(spec),
      raw_json: rawJson || null,
      created_at: Date.now(),
      updated_at: Date.now()
    };
    repo.upsertVehicle(record);
    return reply.code(201).send({ success: true, id: record.id });
  });

  app.delete<{ Params: { id: string } }>('/api/vehicles/:id', async (req) => {
    const success = repo.deleteVehicle(req.params.id);
    return { success };
  });

  // History / Undo-Redo
  app.get<{ Params: { id: string } }>('/api/vehicles/:id/history', async (req) => {
    const items = repo.getHistory(req.params.id);
    return {
      history: items.map(h => ({
        id: h.id,
        action: h.action,
        state: JSON.parse(h.state_json),
        createdAt: h.created_at
      }))
    };
  });

  app.post<{ Params: { id: string }; Body: { action: string; state: any } }>('/api/vehicles/:id/history', async (req, reply) => {
    const { action, state } = req.body;
    const historyId = `hist_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    repo.recordHistory({
      id: historyId,
      vehicle_id: req.params.id,
      action: action || 'EDIT',
      state_json: JSON.stringify(state),
      created_at: Date.now()
    });
    return reply.code(201).send({ success: true, historyId });
  });

  // Offline Jobs
  app.post<{ Body: { type: string; payload?: any } }>('/api/jobs', async (req, reply) => {
    const { type, payload } = req.body;
    if (!type) {
      return reply.code(400).send({ error: 'Missing job type' });
    }
    const jobId = queue.enqueue(type, payload);
    return reply.code(202).send({ jobId, status: 'QUEUED' });
  });

  app.get<{ Params: { id: string } }>('/api/jobs/:id', async (req, reply) => {
    const job = queue.getJob(req.params.id);
    if (!job) {
      return reply.code(404).send({ error: 'Job not found' });
    }
    return {
      id: job.id,
      type: job.type,
      status: job.status,
      progress: job.progress,
      result: job.result_json ? JSON.parse(job.result_json) : null,
      error: job.error,
      updatedAt: job.updated_at
    };
  });

  // Export endpoints
  app.post<{ Body: { spec: any; originalRawText?: string } }>('/api/export/cherax', async (req) => {
    const { spec, originalRawText } = req.body;
    const jsonStr = VehicleExporter.exportCheraxJson(spec, {
      isModified: !originalRawText,
      originalRawText
    });
    return { json: jsonStr };
  });

  app.post<{ Body: { spec: any; spawnName?: string } }>('/api/export/fivem', async (req) => {
    const { spec, spawnName } = req.body;
    const xml = VehicleExporter.exportFiveMVehiclesMeta(spec, spawnName);
    return { xml };
  });

  return { app, repo, queue };
}

// Standalone runner when executed directly
if (import.meta.url === `file://${process.argv[1]}` || process.env.RUN_STANDALONE === 'true') {
  const PORT = Number(process.env.PORT) || 3001;
  const HOST = '127.0.0.1';
  const { app } = createServer();
  app.listen({ port: PORT, host: HOST }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`[AUTOVERSE 3D] Offline Local Backend running at ${address}`);
  });
}

