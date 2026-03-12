import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    console.log("ProtectedRoute - Token check:", token ? "Token exists" : "No token");

    if (!token) {
      console.log("ProtectedRoute - Redirecting to /login");
      navigate("/cms/login");
      return;
    }

    // Set authorized state after validation
    const timerId = setTimeout(() => {
      setIsAuthorized(true);
    }, 0);

    return () => clearTimeout(timerId);
  }, [navigate]);

  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
