import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/mainLayout";
import DashboardPage from "./pages/dashboardPage";
import SigninPage from "./pages/signinPage";
import SignupPage from "./pages/signupPage";
import TaskDetailPage from "./pages/taskDetailPage";
import useAuthStore from "./stores/useAuthStore";
import { Loader2 } from "lucide-react";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100 uppercase">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <span className="ml-3 font-semibold">Loading authentication...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  return children;
};

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Protected Routes */}
        <Route
          index
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="task/:id"
          element={
            <ProtectedRoute>
              <TaskDetailPage />
            </ProtectedRoute>
          }
        />
        
        {/* Auth Routes */}
        <Route path="signin" element={<SigninPage />} />
        <Route path="signup" element={<SignupPage />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
}

export default App;
