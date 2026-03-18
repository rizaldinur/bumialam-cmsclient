// Ini sepertinya juga benar
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import { setCookie } from "../../utils/authFetch";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        API_URL+"/v1/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      const contentType = response.headers.get("content-type");
      let result;

      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        throw new Error(
          `Server returned ${response.status}: ${response.statusText}`,
        );
      }

      if (!response.ok) {
        throw new Error(result?.message || "Login failed");
      }

      // Ambil session data dari response - coba berbagai kemungkinan struktur
      const session = result?.data?.session;
      let accessToken = session?.access_token;
      let refreshToken = session?.refresh_token;
      let expiresAt = session?.expires_at; // Unix timestamp (seconds)

      // Fallback: coba struktur response lainnya jika session tidak ada
      if (!accessToken) {
        accessToken = result?.data?.access_token || result?.access_token || result?.token;
      }
      if (!refreshToken) {
        refreshToken = result?.data?.refresh_token || result?.refresh_token;
      }
      if (!expiresAt) {
        expiresAt = result?.data?.expires_at || result?.expires_at;
      }

      // Simpan access_token di localStorage
      if (accessToken) {
        localStorage.setItem("auth_token", accessToken);
      } else {
        setError("No access token received from server. Please try again.");
        setLoading(false);
        return;
      }

      // Simpan refresh_token di cookie dengan expire sesuai expires_at dari backend
      if (refreshToken) {
        const expireDate = expiresAt
          ? new Date(expiresAt * 1000)
          : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // fallback 7 hari
        setCookie("refresh_token", refreshToken, expireDate);
      }

      // Force re-render/storage event untuk trigger ProtectedRoute
      window.dispatchEvent(new Event("storage"));

      // Small delay to ensure localStorage is written
      await new Promise(resolve => setTimeout(resolve, 100));

      navigate("/cms", { replace: true });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-500">Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all disabled:bg-gray-100"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all disabled:bg-gray-100"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-sky-500 border-gray-300 rounded focus:ring-sky-500"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-600 text-white py-3 rounded-lg font-semibold hover:bg-sky-700 focus:ring-4 focus:ring-sky-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}

// // yang sementara benar
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import AuthLayout from "../layouts/AuthLayout";

// export default function Login() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const requestBody = { email, password };
//       // console.log("Sending login request:", requestBody);

//       const response = await fetch(
//         "https://nkdvrw8s-3000.asse.devtunnels.ms/v1/auth/login",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(requestBody),
//         },
//       );

//       console.log("Response status:", response.status, response.statusText);

//       // Handle non-JSON response (e.g., 404 HTML page)
//       const contentType = response.headers.get("content-type");
//       let result;

//       if (contentType && contentType.includes("application/json")) {
//         result = await response.json();
//       } else {
//         const text = await response.text();
//         console.error("Non-JSON response:", text);
//         throw new Error(
//           `Server returned ${response.status}: ${response.statusText}`,
//         );
//       }

//       console.log("Response data:", result);

//       if (!response.ok) {
//         throw new Error(result?.message || "Login failed");
//       }

//       console.log("Login successful!", result);
//       console.log("Full response structure:", JSON.stringify(result, null, 2));

//       // Log semua key yang ada di response
//       console.log("Response keys:", Object.keys(result || {}));
//       if (result?.data) {
//         console.log("result.data keys:", Object.keys(result.data));
//         console.log("result.data:", result.data);
//       }

//       // Simpan token ke localStorage - coba berbagai kemungkinan struktur response
//       let token =
//         result?.token ||
//         result?.data?.token ||
//         result?.access_token ||
//         result?.auth?.token ||
//         result?.user?.token ||
//         "";

//       console.log("Extracted token:", token);

//       if (token) {
//         localStorage.setItem("auth_token", token);
//         console.log("Token saved to localStorage");
//       } else {
//         console.warn("No token found in response!");
//         // Fallback: jika response OK tapi tidak ada token, gunakan dummy token
//         // untuk session-based auth atau API yang tidak return token
//         console.log("Setting fallback token for session-based auth");
//         token = "session-" + Date.now();
//         localStorage.setItem("auth_token", token);
//         console.log("Fallback token saved:", token);
//       }

//       console.log(
//         "Current localStorage token:",
//         localStorage.getItem("auth_token"),
//       );
//       console.log("Redirecting to /cms...");
//       // Redirect ke halaman utama
//       navigate("/cms");
//     } catch (err) {
//       console.error("Login error:", err);
//       setError(
//         err instanceof Error ? err.message : "Login failed. Please try again.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AuthLayout>
//       <div>
//         {/* Header */}
//         <div className="mb-8">
//           <h2 className="text-3xl font-bold text-gray-900 mb-2">
//             Welcome Back
//           </h2>
//           <p className="text-gray-500">Sign in to your account to continue</p>
//         </div>

//         {/* Login Form */}
//         <form onSubmit={handleSubmit} className="space-y-5">
//           {/* Error Message */}
//           {error && (
//             <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
//               {error}
//             </div>
//           )}

//           {/* Email Field */}
//           <div>
//             <label
//               htmlFor="email"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               disabled={loading}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all disabled:bg-gray-100"
//               placeholder="you@example.com"
//               required
//             />
//           </div>

//           {/* Password Field */}
//           <div>
//             <label
//               htmlFor="password"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               disabled={loading}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all disabled:bg-gray-100"
//               placeholder="••••••••"
//               required
//             />
//           </div>

//           {/* Remember Me */}
//           <div className="flex items-center justify-between">
//             <label className="flex items-center">
//               <input
//                 type="checkbox"
//                 className="w-4 h-4 text-sky-500 border-gray-300 rounded focus:ring-sky-500"
//               />
//               <span className="ml-2 text-sm text-gray-600">Remember me</span>
//             </label>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-sky-600 text-white py-3 rounded-lg font-semibold hover:bg-sky-700 focus:ring-4 focus:ring-sky-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//           >
//             {loading ? (
//               <>
//                 <svg
//                   className="animate-spin h-5 w-5"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   />
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                   />
//                 </svg>
//                 Signing in...
//               </>
//             ) : (
//               "Sign In"
//             )}
//           </button>
//         </form>
//       </div>
//     </AuthLayout>
//   );
// }
