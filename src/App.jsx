import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "./Component/UserStoragePage/AdminLogin";
import AdminPanel from "./Component/Admin";

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("adminLoggedIn"); // Check login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route path="/login" element={<AdminLogin />} />

        {/* Protected Admin Panel */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
