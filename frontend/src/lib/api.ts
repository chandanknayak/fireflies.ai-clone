import type {
  ActionItem,
  ActionItemCreate,
  ActionItemUpdate,
  MeetingCreate,
  MeetingDetail,
  MeetingListItem,
  MeetingUpdate,
  TranscriptUpload,
} from "@/types";

const getApiBase = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && envUrl.trim()) {
    return envUrl.trim().replace(/\/+$/, "");
  }
  if (typeof window !== "undefined") {
    return "/api";
  }
  return "http://localhost:8000/api";
};

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const baseUrl = getApiBase();
  const primaryUrl = endpoint.startsWith("/") ? `${baseUrl}${endpoint}` : `${baseUrl}/${endpoint}`;

  try {
    const res = await fetch(primaryUrl, {
      headers: {
        "Content-Type": "application/json",
        "bypass-tunnel-reminder": "true",
        ...options?.headers,
      },
      ...options,
    });
    if (res.ok) {
      return await res.json();
    }
    // If non-200 status on external URL, try fallback
    if (baseUrl !== "/api" && typeof window !== "undefined") {
      const fallbackUrl = endpoint.startsWith("/") ? `/api${endpoint}` : `/api/${endpoint}`;
      const fallbackRes = await fetch(fallbackUrl, {
        headers: { "Content-Type": "application/json", ...options?.headers },
        ...options,
      });
      if (fallbackRes.ok) {
        return await fallbackRes.json();
      }
    }
    const error = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || `HTTP ${res.status}`);
  } catch (err) {
    if (baseUrl !== "/api" && typeof window !== "undefined") {
      const fallbackUrl = endpoint.startsWith("/") ? `/api${endpoint}` : `/api/${endpoint}`;
      try {
        const fallbackRes = await fetch(fallbackUrl, {
          headers: { "Content-Type": "application/json", ...options?.headers },
          ...options,
        });
        if (fallbackRes.ok) {
          return await fallbackRes.json();
        }
      } catch {
        // Ignore fallback error and throw original error
      }
    }
    throw err instanceof Error ? err : new Error("Request failed");
  }
}

export const api = {
  getMeetings: (params?: {
    search?: string;
    sort_by?: string;
    participant?: string;
    date_from?: string;
    date_to?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.sort_by) query.set("sort_by", params.sort_by);
    if (params?.participant) query.set("participant", params.participant);
    if (params?.date_from) query.set("date_from", params.date_from);
    if (params?.date_to) query.set("date_to", params.date_to);
    const qs = query.toString();
    return fetchApi<MeetingListItem[]>(`/meetings${qs ? `?${qs}` : ""}`);
  },

  getMeeting: (id: number) => fetchApi<MeetingDetail>(`/meetings/${id}`),

  createMeeting: (data: MeetingCreate) =>
    fetchApi<MeetingDetail>("/meetings", { method: "POST", body: JSON.stringify(data) }),

  uploadTranscript: (data: TranscriptUpload) =>
    fetchApi<MeetingDetail>("/meetings/upload-transcript", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateMeeting: (id: number, data: MeetingUpdate) =>
    fetchApi<MeetingDetail>(`/meetings/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  deleteMeeting: (id: number) =>
    fetchApi<{ message: string }>(`/meetings/${id}`, { method: "DELETE" }),

  createActionItem: (meetingId: number, data: ActionItemCreate) =>
    fetchApi<ActionItem>(`/action-items/meetings/${meetingId}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateActionItem: (id: number, data: ActionItemUpdate) =>
    fetchApi<ActionItem>(`/action-items/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  deleteActionItem: (id: number) =>
    fetchApi<{ message: string }>(`/action-items/${id}`, { method: "DELETE" }),
};

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function formatTimestamp(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
