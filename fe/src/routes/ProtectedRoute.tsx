import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

interface ProtectedRouteProps {
  requiredRole?: "user" | "admin" | "super_admin";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  if (!isAuthenticated) return <Navigate to="/login" />;

  if (
    requiredRole &&
    user?.role !== requiredRole &&
    user?.role !== "super_admin"
  ) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
