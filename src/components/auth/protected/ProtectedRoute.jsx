import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children, allowedRoles }) {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkRole = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        setUserRole(null);
        return;
      }
      try {
        const res = await fetch(
          `http://192.168.108.79:8000/api/auth/me?token=${token}`,
          { method: "POST" }
        );
        const data = await res.json();
        setUserRole(data.role);
      } catch {
        setUserRole(null);
      }
      setLoading(false);
    };
    checkRole();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!localStorage.getItem("token")) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    if (userRole === "super_admin") return <Navigate to="/superadmin" replace />;
    if (userRole === "admin_faskes") return <Navigate to="/" replace />;
    if (userRole === "user_mobile") {
      window.location.href = "https://play.google.com/store/apps/details?id=com.sadar.mobile";
      return null;
    }
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  return children;
}