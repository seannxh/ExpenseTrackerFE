// src/components/RequireAuth.tsx
import { Navigate } from "react-router-dom";

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");

  if (!token) {    // If no token → boot them back to login
    return <Navigate to="/login" replace />;
  }

  return children;
}
