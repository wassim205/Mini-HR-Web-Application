import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RegisterPage from "./pages/auth/Register.jsx";
import LoginPage from "./pages/auth/Login.jsx";
import { AdminDashboard } from "./pages/admin/AdminDashboard.jsx";
import { EmployeeDashboard } from "./pages/employee/EmployeeDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { isAuthenticated, redirectToDashboard, logout } from "./utils/auth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated() ? (
              <Navigate to={redirectToDashboard()} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard onSignOut={logout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/dashboard"
          element={
            <ProtectedRoute requiredRole="employee">
              <EmployeeDashboard onSignOut={logout} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
