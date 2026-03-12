// src/utils/authFetch.ts

// Helper: ambil nilai cookie by name
export function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

// Helper: hapus cookie
export function clearCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`;
}

// Helper: set cookie dengan expiry
export function setCookie(name: string, value: string, expireDate: Date): void {
  document.cookie = `${name}=${value}; expires=${expireDate.toUTCString()}; path=/; SameSite=Strict; Secure`;
}

// Di-export supaya bisa dipakai useTokenRefresh
export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getCookie("refresh_token");
  if (!refreshToken) return null;

  try {
    const response = await fetch("http://localhost:3000/v1/auth/refreshtoken", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) return null;

    const result = await response.json();
    const session = result?.data?.session;
    const newAccessToken = session?.access_token;
    const newRefreshToken = session?.refresh_token;
    const newExpiresAt = session?.expires_at;

    // Update access_token di localStorage
    if (newAccessToken) {
      localStorage.setItem("auth_token", newAccessToken);
    }

    // Rotate refresh_token di cookie dengan yang baru
    if (newRefreshToken && newExpiresAt) {
      const expireDate = new Date(newExpiresAt * 1000);
      setCookie("refresh_token", newRefreshToken, expireDate);
    }

    return newAccessToken ?? null;
  } catch {
    return null;
  }
}

// Gunakan fungsi ini sebagai pengganti fetch() biasa di seluruh aplikasi
export async function authFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = localStorage.getItem("auth_token");

  const makeRequest = (t: string | null) =>
    fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(t ? { Authorization: `Bearer ${t}` } : {}),
        ...(options.headers || {}),
      },
    });

  let response = await makeRequest(token);

  // Kalau 401 (token expired), coba refresh dulu lalu retry
  if (response.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      response = await makeRequest(newToken);
    } else {
      // Refresh token juga expired → paksa logout
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    }
  }

  return response;
}
