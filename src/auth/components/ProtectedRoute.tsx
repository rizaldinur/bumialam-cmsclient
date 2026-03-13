import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("auth_token");
      // const currentPath = location.pathname;

      // console.log("ProtectedRoute - Token check:", token ? "Token exists (" + token.substring(0, 20) + "...)" : "No token");
      // console.log("ProtectedRoute - Current path:", currentPath);

      if (!token) {
        // console.log("ProtectedRoute - No token, redirecting to /cms/login");
        navigate("/cms/login", { replace: true });
        setIsChecking(false);
        return;
      }

      // Token exists, allow access
      // console.log("ProtectedRoute - Token valid, allowing access");
      setIsChecking(false);
    };

    checkAuth();
  }, [navigate, location.pathname]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
