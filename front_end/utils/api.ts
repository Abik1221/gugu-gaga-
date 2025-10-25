export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export async function postForm<T = any>(path: string, data: Record<string, string>): Promise<T> {
  const body = new URLSearchParams(data);
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed with ${res.status}`);
  }
  return (await res.json()) as T;
}

export async function postMultipart<T = any>(path: string, formData: FormData): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    let message = `Request failed with ${res.status}`;
    try {
      const data = await res.json();
      message = data?.detail || message;
    } catch {}
    throw new Error(message);
  }
  return (await res.json()) as T;
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refresh_token");
}

async function refreshTokens(): Promise<boolean> {
  const rt = getRefreshToken();
  if (!rt) return false;
  const url = `${API_BASE}/api/v1/auth/refresh?refresh_token=${encodeURIComponent(rt)}`;
  const res = await fetch(url, { method: "POST" });
  if (!res.ok) return false;
  try {
    const data = (await res.json()) as {
      access_token: string;
      refresh_token: string;
      token_type: string;
      expires_in: number;
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
    }
    return true;
  } catch {
    return false;
  }
}

async function authFetch(path: string, init?: RequestInit, retry = true): Promise<Response> {
  const token = getAccessToken();
  const headers: HeadersInit = {
    ...(init?.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const res = await fetch(`${API_BASE}${path}`, { ...(init || {}), headers });
  if (res.status === 401 && retry) {
    const ok = await refreshTokens();
    if (ok) {
      const newToken = getAccessToken();
      const retryHeaders: HeadersInit = {
        ...(init?.headers || {}),
        ...(newToken ? { Authorization: `Bearer ${newToken}` } : {}),
      };
      return fetch(`${API_BASE}${path}`, { ...(init || {}), headers: retryHeaders });
    }
  }
  return res;
}

export async function getAuthJSON<T = any>(path: string): Promise<T> {
  const res = await authFetch(path);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed with ${res.status}`);
  }
  return (await res.json()) as T;
}

export async function postAuthJSON<T = any>(path: string, bodyData: any): Promise<T> {
  const res = await authFetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bodyData),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed with ${res.status}`);
  }
  return (await res.json()) as T;
}
