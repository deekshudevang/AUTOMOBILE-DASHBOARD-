/**
 * AutoVerse Platform — Shared Authoritative API Client
 * Connects frontend workspace to FastAPI backend with retry, timeouts, and offline handling.
 */

export interface HealthStatus {
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE' | 'CONNECTING';
  service: string;
  version: string;
  timestamp?: string;
  database_connected: boolean;
  active_mode?: string;
  details?: {
    api_version?: string;
    database_engine?: string;
    database_latency_ms?: number;
    cfd_worker_integrated?: boolean;
    cad_kernel_mode?: string;
  };
}

export interface SystemInfo {
  service: string;
  version: string;
  database: string;
  database_connected: boolean;
  vehicle_count: number;
  project_count: number;
  build_count: number;
  uptime_seconds: number;
  timestamp: string;
}

export interface BackendProject {
  id: string;
  name: string;
  description: string;
  base_vehicle_id: string;
  active_branch: string;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  revisions: BackendRevision[];
}

export interface BackendRevision {
  id: string;
  project_id: string;
  revision_hash: string;
  parent_revision_hash?: string | null;
  commit_message: string;
  author_name: string;
  geometry_digest: string;
  is_manifold: boolean;
  serialized_bundle?: string | null;
  configuration_json?: string | null;
  created_at: string;
}

export interface BackendSavedBuild {
  id: string;
  project_id?: string | null;
  user_id: string;
  vehicle_id: string;
  name: string;
  base_vehicle_file: string;
  base_model_hash: number;
  configuration_json: string;
  primary_color?: number | null;
  secondary_color?: number | null;
  custom_primary_color?: string | null;
  custom_secondary_color?: string | null;
  is_primary_color_custom: boolean;
  wheel_color?: number | null;
  version: string;
  config_version: number;
  revision_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateBuildPayload {
  name: string;
  vehicle_id: string;
  base_vehicle_file: string;
  project_id?: string | null;
  base_model_hash?: number;
  configuration_json?: string;
  primary_color?: number;
  secondary_color?: number;
  custom_primary_color?: string;
  custom_secondary_color?: string;
  is_primary_color_custom?: boolean;
  wheel_color?: number;
  version?: string;
  config_version?: number;
  revision_id?: string;
}

export class ApiError extends Error {
  status: number;
  detail?: any;

  constructor(status: number, message: string, detail?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
  }
}

class AutoVerseApiClient {
  private baseUrl: string;
  private timeoutMs: number = 8000;

  constructor() {
    // Priority: Vite env variable -> standard port 8000 -> localhost fallback
    if (typeof window !== 'undefined') {
      const envUrl = (import.meta as any).env?.VITE_API_BASE_URL;
      const host = window.location.hostname || 'localhost';
      this.baseUrl = envUrl || `http://${host}:8000`;
    } else {
      this.baseUrl = 'http://localhost:8000';
    }
  }

  public setBaseUrl(url: string): void {
    this.baseUrl = url.replace(/\/$/, '');
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retries: number = 1
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorDetail;
        try {
          errorDetail = await response.json();
        } catch {
          errorDetail = await response.text();
        }
        const message = typeof errorDetail === 'object' && errorDetail?.detail
          ? (typeof errorDetail.detail === 'string' ? errorDetail.detail : JSON.stringify(errorDetail.detail))
          : `HTTP error ${response.status}: ${response.statusText}`;
        throw new ApiError(response.status, message, errorDetail);
      }

      return (await response.json()) as T;
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new ApiError(408, `Request timed out after ${this.timeoutMs}ms: ${endpoint}`);
      }
      if (retries > 0 && options.method === 'GET') {
        // Backoff and retry idempotent requests once
        await new Promise(res => setTimeout(res, 500));
        return this.request<T>(endpoint, options, retries - 1);
      }
      if (err instanceof ApiError) throw err;
      throw new ApiError(0, `Network error: Could not connect to backend at ${this.baseUrl} (${err.message})`);
    }
  }

  // --- Health & Diagnostics ---

  public async checkHealth(): Promise<HealthStatus> {
    try {
      const data = await this.request<HealthStatus>('/api/v1/health', { method: 'GET' }, 0);
      return data;
    } catch (err) {
      return {
        status: 'OFFLINE',
        service: 'autoverse-api',
        version: 'unknown',
        database_connected: false,
        details: { database_engine: 'disconnected' }
      };
    }
  }

  public async getSystemInfo(): Promise<SystemInfo> {
    return this.request<SystemInfo>('/api/v1/system/info');
  }

  // --- Projects ---

  public async listProjects(): Promise<BackendProject[]> {
    return this.request<BackendProject[]>('/api/v1/projects');
  }

  public async getProject(projectId: string): Promise<BackendProject> {
    return this.request<BackendProject>(`/api/v1/projects/${projectId}`);
  }

  public async createProject(payload: {
    name: string;
    base_vehicle_id: string;
    description?: string;
    active_branch?: string;
  }): Promise<BackendProject> {
    return this.request<BackendProject>('/api/v1/projects', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  public async updateProject(
    projectId: string,
    payload: { name?: string; description?: string; active_branch?: string; is_archived?: boolean }
  ): Promise<BackendProject> {
    return this.request<BackendProject>(`/api/v1/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  }

  public async deleteProject(projectId: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/api/v1/projects/${projectId}`, {
      method: 'DELETE'
    });
  }

  // --- Revisions ---

  public async listRevisions(projectId: string): Promise<BackendRevision[]> {
    return this.request<BackendRevision[]>(`/api/v1/projects/${projectId}/revisions`);
  }

  public async createRevision(
    projectId: string,
    payload: {
      commit_message: string;
      author_name?: string;
      geometry_digest: string;
      parent_revision_hash?: string | null;
      serialized_bundle?: string | null;
      configuration_json?: string | null;
      is_manifold?: boolean;
    }
  ): Promise<BackendRevision> {
    return this.request<BackendRevision>(`/api/v1/projects/${projectId}/revisions`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  public async restoreRevision(revisionIdOrHash: string): Promise<BackendRevision> {
    return this.request<BackendRevision>(`/api/v1/revisions/${revisionIdOrHash}/restore`, {
      method: 'POST'
    });
  }

  // --- Saved Builds ---

  public async listBuilds(params: { projectId?: string; vehicleId?: string } = {}): Promise<BackendSavedBuild[]> {
    const searchParams = new URLSearchParams();
    if (params.projectId) searchParams.set('project_id', params.projectId);
    if (params.vehicleId) searchParams.set('vehicle_id', params.vehicleId);
    const qs = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return this.request<BackendSavedBuild[]>(`/api/v1/builds${qs}`);
  }

  public async getBuild(buildId: string): Promise<BackendSavedBuild> {
    return this.request<BackendSavedBuild>(`/api/v1/builds/${buildId}`);
  }

  public async createBuild(payload: CreateBuildPayload): Promise<BackendSavedBuild> {
    return this.request<BackendSavedBuild>('/api/v1/builds', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  public async updateBuild(
    buildId: string,
    payload: Partial<CreateBuildPayload> & { expected_version?: number }
  ): Promise<BackendSavedBuild> {
    return this.request<BackendSavedBuild>(`/api/v1/builds/${buildId}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  }

  public async deleteBuild(buildId: string): Promise<{ success: boolean; deleted_id: string }> {
    return this.request<{ success: boolean; deleted_id: string }>(`/api/v1/builds/${buildId}`, {
      method: 'DELETE'
    });
  }

  public async duplicateBuild(buildId: string): Promise<BackendSavedBuild> {
    return this.request<BackendSavedBuild>(`/api/v1/builds/${buildId}/duplicate`, {
      method: 'POST'
    });
  }

  // --- Vehicles ---

  public async listVehicles(params: { q?: string; category?: string; manufacturer?: string } = {}): Promise<any[]> {
    const searchParams = new URLSearchParams();
    if (params.q) searchParams.set('q', params.q);
    if (params.category) searchParams.set('category', params.category);
    if (params.manufacturer) searchParams.set('manufacturer', params.manufacturer);
    const qs = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return this.request<any[]>(`/api/v1/vehicles${qs}`);
  }

  public async getVehicle(vehicleId: string): Promise<any> {
    return this.request<any>(`/api/v1/vehicles/${vehicleId}`);
  }

  public async getVehicleComponents(vehicleId: string): Promise<any[]> {
    return this.request<any[]>(`/api/v1/vehicles/${vehicleId}/components`);
  }
}

// Export singleton instance
export const apiClient = new AutoVerseApiClient();
