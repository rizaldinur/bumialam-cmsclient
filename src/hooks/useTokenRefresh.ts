// src/hooks/useTokenRefresh.ts
import { useEffect, useRef } from "react";
import { refreshAccessToken } from "../utils/authFetch";

export function useTokenRefresh() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const scheduleRefresh = () => {
      // Bersihkan timer lama kalau ada
      if (timerRef.current) clearTimeout(timerRef.current);

      const token = localStorage.getItem("auth_token");
      if (!token) return;

      try {
        // Decode JWT payload untuk ambil waktu expire
        const payload = JSON.parse(atob(token.split(".")[1]));
        const expiresAt = payload.exp * 1000; // konversi ke milliseconds
        const now = Date.now();
        const timeUntilExpiry = expiresAt - now;

        // Refresh 1 menit sebelum expired

        const refreshIn = timeUntilExpiry - 60 * 1000;

        if (refreshIn <= 0) {
          // Token sudah/hampir expired, langsung refresh sekarang
          refreshAccessToken().then((newToken) => {
            if (newToken) {
              scheduleRefresh(); // jadwalkan untuk token baru
            } else {
              // Refresh token expired → paksa logout
              localStorage.removeItem("auth_token");
              window.location.href = "/login";
            }
          });
          return;
        }

        timerRef.current = setTimeout(async () => {
          const newToken = await refreshAccessToken();
          if (newToken) {
            scheduleRefresh(); // ✅ Jadwalkan refresh berikutnya
          } else {
            // Refresh token expired → paksa logout
            localStorage.removeItem("auth_token");
            window.location.href = "/login";
          }
        }, refreshIn);
      } catch {
        console.warn("Gagal decode JWT untuk silent refresh");
      }
    };

    scheduleRefresh();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
}
