/**
 * OneCompilerHub Frontend - Typed Execution API Client
 * Connects Next.js frontend to the FastAPI Execution Backend.
 *
 * Enforces production safety: Real execution is disabled pending
 * sandbox security verification. Never fabricates execution results.
 */

export interface HealthResponse {
  status: string;
  version: string;
  environment: string;
  execution_enabled: boolean;
  capabilities: {
    supported_languages_count: number;
    active_workers: number;
    sandbox_isolation_ready: boolean;
    queue_driver: string;
  };
}

export type ExecutionMode =
  | "compiled"
  | "interpreted"
  | "browser_preview"
  | "database_query"
  | "framework";

export type LanguageAvailability = "available" | "coming_soon" | "disabled";

export interface ResourcePolicy {
  cpu_limit_cores: number;
  memory_limit_mb: number;
  timeout_seconds: number;
  network_enabled: boolean;
}

export interface LanguageEntry {
  id: string;
  name: string;
  category: string;
  execution_mode: ExecutionMode;
  file_extensions: string[];
  availability: LanguageAvailability;
  resource_policy: ResourcePolicy;
}

export interface LanguageListResponse {
  total: number;
  languages: LanguageEntry[];
}

export type ExecutionStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "timed_out"
  | "cancelled";

export interface ExecutionCreateRequest {
  language: string;
  source_code: string;
  stdin?: string;
  client_request_id?: string;
}

export interface ExecutionResponse {
  id?: string;
  execution_id: string;
  language: string;
  status: ExecutionStatus;
  stdout: string;
  stderr: string;
  exit_code: number | null;
  duration_ms: number | null;
  error: string | null;
  created_at: string;
  completed_at: string | null;
  is_sandboxed: boolean;
}

export interface ApiErrorDetail {
  code: string;
  message: string;
  field?: string;
}

export class ExecutionApiError extends Error {
  public code: string;
  public status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.name = "ExecutionApiError";
    this.code = code;
    this.status = status;
  }
}

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_EXECUTION_API_URL || "http://localhost:8000";

/**
 * Resolves optional bearer token from Supabase session if signed in.
 */
async function resolveAuthToken(explicitToken?: string): Promise<string | undefined> {
  if (explicitToken) return explicitToken;
  try {
    if (typeof window !== "undefined") {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();
      return data.session?.access_token;
    }
  } catch {
    // ignore
  }
  return undefined;
}

/**
 * Checks backend health and isolation readiness.
 */
export async function checkBackendHealth(): Promise<HealthResponse | null> {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/api/v1/health`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Lists all registered languages and their availability status.
 */
export async function listSupportedLanguages(): Promise<LanguageListResponse | null> {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/api/v1/languages`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Submits source code to the execution backend.
 */
export async function submitExecution(
  payload: ExecutionCreateRequest,
  token?: string
): Promise<ExecutionResponse> {
  const authToken = await resolveAuthToken(token);
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  let res: Response;
  try {
    res = await fetch(`${BACKEND_BASE_URL}/api/v1/executions`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Network error";
    throw new ExecutionApiError(
      "network_error",
      `Unable to connect to OneCompilerHub execution backend at ${BACKEND_BASE_URL}. (${errorMsg})`,
      0
    );
  }

  const data = await res.json();

  if (!res.ok) {
    const errorDetail = data?.error;
    throw new ExecutionApiError(
      errorDetail?.code || "request_failed",
      errorDetail?.message || data?.detail || "Execution request failed.",
      res.status
    );
  }

  const execution_id = data.execution_id || data.id;

  return {
    ...data,
    id: data.id || execution_id,
    execution_id,
  } as ExecutionResponse;
}

/**
 * Retrieves the status and output of a running or finished execution job.
 */
export async function getExecutionStatus(
  executionId: string,
  token?: string
): Promise<ExecutionResponse> {
  const authToken = await resolveAuthToken(token);
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const res = await fetch(`${BACKEND_BASE_URL}/api/v1/executions/${executionId}`, {
    method: "GET",
    headers,
  });

  const data = await res.json();
  if (!res.ok) {
    const errorDetail = data?.error;
    throw new ExecutionApiError(
      errorDetail?.code || "request_failed",
      errorDetail?.message || data?.detail || "Failed to fetch execution status.",
      res.status
    );
  }

  const resolvedId = data.execution_id || data.id || executionId;

  return {
    ...data,
    id: data.id || resolvedId,
    execution_id: resolvedId,
  } as ExecutionResponse;
}

/**
 * Cancels a queued or running execution job.
 */
export async function cancelExecution(
  executionId: string,
  token?: string
): Promise<{ execution_id: string; cancelled: boolean; message: string }> {
  const authToken = await resolveAuthToken(token);
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const res = await fetch(
    `${BACKEND_BASE_URL}/api/v1/executions/${executionId}/cancel`,
    {
      method: "POST",
      headers,
    }
  );

  const data = await res.json();
  if (!res.ok) {
    const errorDetail = data?.error;
    throw new ExecutionApiError(
      errorDetail?.code || "cancel_failed",
      errorDetail?.message || data?.detail || "Failed to cancel execution.",
      res.status
    );
  }

  return {
    execution_id: data.execution_id || data.id || executionId,
    cancelled: true,
    message: data.message || "Execution cancelled",
  };
}
