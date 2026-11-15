import { DatabaseRepository, JobRecord } from './db';

export type JobHandler = (
  payload: any,
  onProgress: (progress: number) => void
) => Promise<any>;

export class OfflineJobQueue {
  private repo: DatabaseRepository;
  private handlers: Map<string, JobHandler> = new Map();
  private pollTimer: NodeJS.Timeout | null = null;
  private isProcessing = false;

  constructor(repo: DatabaseRepository) {
    this.repo = repo;
  }

  registerHandler(type: string, handler: JobHandler): void {
    this.handlers.set(type, handler);
  }

  enqueue(type: string, payload?: any): string {
    const id = `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const now = Date.now();
    const record: JobRecord = {
      id,
      type,
      status: 'QUEUED',
      progress: 0,
      payload_json: payload ? JSON.stringify(payload) : null,
      created_at: now,
      updated_at: now
    };
    this.repo.createJob(record);
    return id;
  }

  getJob(id: string): JobRecord | null {
    return this.repo.getJob(id);
  }

  async processNext(): Promise<boolean> {
    if (this.isProcessing) return false;

    const job = this.repo.getNextQueuedJob();
    if (!job) return false;

    this.isProcessing = true;
    this.repo.updateJob(job.id, { status: 'RUNNING', progress: 5 });

    try {
      const handler = this.handlers.get(job.type);
      if (!handler) {
        throw new Error(`No worker registered for job type: ${job.type}`);
      }

      const payload = job.payload_json ? JSON.parse(job.payload_json) : null;
      const result = await handler(payload, (progress: number) => {
        this.repo.updateJob(job.id, { progress: Math.min(100, Math.max(0, Math.round(progress))) });
      });

      this.repo.updateJob(job.id, {
        status: 'COMPLETED',
        progress: 100,
        result_json: result !== undefined ? JSON.stringify(result) : null
      });
    } catch (err: any) {
      this.repo.updateJob(job.id, {
        status: 'FAILED',
        error: err?.message || String(err)
      });
    } finally {
      this.isProcessing = false;
    }

    return true;
  }

  start(pollIntervalMs = 500): void {
    if (this.pollTimer) return;
    this.pollTimer = setInterval(async () => {
      await this.processNext();
    }, pollIntervalMs);
  }

  stop(): void {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }
}

