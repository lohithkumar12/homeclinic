export type ClinicInfo = {
  name: string;
  phone: string;
  hours: string;
};

export type TriageResult = {
  red_flag: boolean;
  reasons: string[];
};

export type IntakeSuccess = {
  public_id: string;
  priority: "normal" | "urgent";
  red_flag: boolean;
  red_flag_reasons: string[];
  clinic: ClinicInfo;
  message: string;
};

export type RequestListItem = {
  id: number;
  public_id: string;
  patient_name: string;
  phone: string;
  complaint: string;
  status: string;
  priority: string;
  red_flag: boolean;
  created_at: string;
};

export type RequestDetail = {
  id: number;
  public_id: string;
  status: string;
  priority: string;
  red_flag: boolean;
  red_flag_reasons: string[];
  complaint: string;
  duration: string;
  symptoms?: string | null;
  medications?: string | null;
  allergies?: string | null;
  previous_conditions?: string | null;
  preferred_time?: string | null;
  scheduled_at_note?: string | null;
  consent_version: string;
  consent_accepted_at: string;
  created_at: string;
  updated_at: string;
  patient: {
    id: number;
    name: string;
    age: number;
    gender: string;
    phone: string;
    location?: string | null;
  };
  attachments: {
    id: number;
    original_filename: string;
    url: string;
    content_type?: string | null;
    size_bytes: number;
  }[];
  notes: { id: number; body: string; created_at: string }[];
};

const API_BASE =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
    : "";

export async function getClinic(): Promise<ClinicInfo> {
  const res = await fetch(`${API_BASE}/api/clinic`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load clinic info");
  return res.json();
}

export async function checkTriage(complaint: string, symptoms: string): Promise<TriageResult> {
  const res = await fetch(`${API_BASE}/api/triage/check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ complaint, symptoms }),
  });
  if (!res.ok) throw new Error("Triage check failed");
  return res.json();
}

export async function submitIntake(form: FormData): Promise<IntakeSuccess> {
  const res = await fetch(`${API_BASE}/api/intake`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const err = new Error(data.detail?.message || data.detail || "Submit failed") as Error & {
      status?: number;
      detail?: unknown;
    };
    err.status = res.status;
    err.detail = data.detail;
    throw err;
  }
  return res.json();
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("hc_admin_token");
}

export function setToken(token: string) {
  localStorage.setItem("hc_admin_token", token);
}

export function clearToken() {
  localStorage.removeItem("hc_admin_token");
}

import { resolveAdminLoginPath } from "@/lib/admin";

async function adminFetch(path: string, init: RequestInit = {}) {
  const token = getToken();
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  if (res.status === 401) {
    clearToken();
    if (typeof window !== "undefined") {
      window.location.href = resolveAdminLoginPath();
    }
  }
  return res;
}

export async function adminLogin(email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/admin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Invalid email or password");
  return res.json() as Promise<{ access_token: string }>;
}

export async function adminMe() {
  const res = await adminFetch("/api/admin/auth/me");
  if (!res.ok) throw new Error("Not authenticated");
  return res.json();
}

export async function listRequests(params: { status?: string; priority?: string; q?: string } = {}) {
  const qs = new URLSearchParams();
  if (params.status) qs.set("status", params.status);
  if (params.priority) qs.set("priority", params.priority);
  if (params.q) qs.set("q", params.q);
  const res = await adminFetch(`/api/admin/requests?${qs.toString()}`);
  if (!res.ok) throw new Error("Failed to load requests");
  return res.json() as Promise<RequestListItem[]>;
}

export async function getRequest(id: number) {
  const res = await adminFetch(`/api/admin/requests/${id}`);
  if (!res.ok) throw new Error("Failed to load request");
  return res.json() as Promise<RequestDetail>;
}

export async function updateRequest(
  id: number,
  body: {
    status?: string;
    priority?: string;
    scheduled_at_note?: string;
    note?: string;
  },
) {
  const res = await adminFetch(`/api/admin/requests/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Update failed");
  return res.json() as Promise<RequestDetail>;
}
