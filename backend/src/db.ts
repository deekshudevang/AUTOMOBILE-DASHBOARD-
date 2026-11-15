import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';

export interface VehicleRecord {
  id: string;
  filename: string;
  model_hash: number;
  format: string;
  spec_json: string;
  raw_json?: string | null;
  created_at: number;
  updated_at: number;
}

export interface HistoryRecord {
  id: string;
  vehicle_id: string;
  action: string;
  state_json: string;
  created_at: number;
}

export interface JobRecord {
  id: string;
  type: string;
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  progress: number;
  payload_json?: string | null;
  result_json?: string | null;
  error?: string | null;
  created_at: number;
  updated_at: number;
}

export class DatabaseRepository {
  private db: DatabaseSync;

  constructor(dbPath: string = ':memory:') {
    if (dbPath !== ':memory:') {
      const dir = path.dirname(dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
    this.db = new DatabaseSync(dbPath);
    this.initialize();
  }

  private initialize(): void {
    // Configure SQLite WAL mode for concurrency and performance
    this.db.exec(`PRAGMA journal_mode = WAL;`);
    this.db.exec(`PRAGMA foreign_keys = ON;`);

    // Schema: vehicles
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id TEXT PRIMARY KEY,
        filename TEXT NOT NULL,
        model_hash INTEGER NOT NULL,
        format TEXT NOT NULL,
        spec_json TEXT NOT NULL,
        raw_json TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_vehicles_model_hash ON vehicles(model_hash);
      CREATE INDEX IF NOT EXISTS idx_vehicles_filename ON vehicles(filename);
    `);

    // Schema: history
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS history (
        id TEXT PRIMARY KEY,
        vehicle_id TEXT NOT NULL,
        action TEXT NOT NULL,
        state_json TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        FOREIGN KEY(vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_history_vehicle_id ON history(vehicle_id);
    `);

    // Schema: jobs (persistent offline background job queue)
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS jobs (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        status TEXT NOT NULL,
        progress INTEGER DEFAULT 0,
        payload_json TEXT,
        result_json TEXT,
        error TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
    `);
  }

  // --- Vehicle Operations ---
  upsertVehicle(vehicle: VehicleRecord): void {
    const stmt = this.db.prepare(`
      INSERT INTO vehicles (id, filename, model_hash, format, spec_json, raw_json, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        filename = excluded.filename,
        model_hash = excluded.model_hash,
        format = excluded.format,
        spec_json = excluded.spec_json,
        raw_json = coalesce(excluded.raw_json, vehicles.raw_json),
        updated_at = excluded.updated_at;
    `);
    stmt.run(
      vehicle.id,
      vehicle.filename,
      vehicle.model_hash,
      vehicle.format,
      vehicle.spec_json,
      vehicle.raw_json ?? null,
      vehicle.created_at,
      vehicle.updated_at
    );
  }

  getVehicle(id: string): VehicleRecord | null {
    const stmt = this.db.prepare(`SELECT * FROM vehicles WHERE id = ? LIMIT 1;`);
    const row = stmt.get(id);
    return (row as unknown as VehicleRecord) || null;
  }

  listVehicles(): VehicleRecord[] {
    const stmt = this.db.prepare(`SELECT * FROM vehicles ORDER BY updated_at DESC;`);
    return (stmt.all() as unknown as VehicleRecord[]) || [];
  }

  deleteVehicle(id: string): boolean {
    const stmt = this.db.prepare(`DELETE FROM vehicles WHERE id = ?;`);
    stmt.run(id);
    return true;
  }

  // --- History Operations ---
  recordHistory(history: HistoryRecord): void {
    const stmt = this.db.prepare(`
      INSERT INTO history (id, vehicle_id, action, state_json, created_at)
      VALUES (?, ?, ?, ?, ?);
    `);
    stmt.run(history.id, history.vehicle_id, history.action, history.state_json, history.created_at);
  }

  getHistory(vehicleId: string): HistoryRecord[] {
    const stmt = this.db.prepare(`
      SELECT * FROM history WHERE vehicle_id = ? ORDER BY created_at ASC;
    `);
    return (stmt.all(vehicleId) as unknown as HistoryRecord[]) || [];
  }

  // --- Job Queue Operations ---
  createJob(job: JobRecord): void {
    const stmt = this.db.prepare(`
      INSERT INTO jobs (id, type, status, progress, payload_json, result_json, error, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `);
    stmt.run(
      job.id,
      job.type,
      job.status,
      job.progress,
      job.payload_json ?? null,
      job.result_json ?? null,
      job.error ?? null,
      job.created_at,
      job.updated_at
    );
  }

  getJob(id: string): JobRecord | null {
    const stmt = this.db.prepare(`SELECT * FROM jobs WHERE id = ? LIMIT 1;`);
    const row = stmt.get(id);
    return (row as unknown as JobRecord) || null;
  }

  updateJob(id: string, updates: Partial<JobRecord>): void {
    const existing = this.getJob(id);
    if (!existing) return;

    const status = updates.status ?? existing.status;
    const progress = updates.progress ?? existing.progress;
    const result_json = updates.result_json !== undefined ? updates.result_json : existing.result_json;
    const error = updates.error !== undefined ? updates.error : existing.error;
    const updated_at = Date.now();

    const stmt = this.db.prepare(`
      UPDATE jobs SET
        status = ?,
        progress = ?,
        result_json = ?,
        error = ?,
        updated_at = ?
      WHERE id = ?;
    `);
    stmt.run(status, progress, result_json ?? null, error ?? null, updated_at, id);
  }

  getNextQueuedJob(): JobRecord | null {
    const stmt = this.db.prepare(`
      SELECT * FROM jobs WHERE status = 'QUEUED' ORDER BY created_at ASC LIMIT 1;
    `);
    const row = stmt.get();
    return (row as unknown as JobRecord) || null;
  }

  close(): void {
    this.db.close();
  }
}
