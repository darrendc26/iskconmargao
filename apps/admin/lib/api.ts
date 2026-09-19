/** Browser calls same origin so the session cookie is sent. Next rewrites /api → Go. */
function apiBase() {
  if (typeof window !== "undefined") {
    return "";
  }
  return process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
}

export async function api<T>(
  path: string,
  init?: RequestInit,
): Promise<{ ok: boolean; data?: T; error?: string; status: number }> {
  try {
    const res = await fetch(`${apiBase()}${path}`, {
      ...init,
      credentials: "include",
      headers: {
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...(init?.headers || {}),
      },
    });
    const json = await res.json().catch(() => ({}));
    return {
      ok: res.ok && json.success !== false,
      data: json.data as T,
      error: json.error?.message,
      status: res.status,
    };
  } catch {
    return { ok: false, error: "Could not reach the server. Is the API running?", status: 0 };
  }
}

export function apiUrl() {
  return apiBase();
}
