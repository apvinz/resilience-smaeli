/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import { LoginPage } from "./pages/LoginPage";
import { GenerationPage } from "./pages/GenerationPage";
import { ClassPage } from "./pages/ClassPage";

// Route guard component to check auth status
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { role } = useAuth();

  // If role is loaded but not defined, redirect to Login
  if (!role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <Routes>
            {/* Authenticating Screen */}
            <Route path="/" element={<LoginPage />} />

            {/* General school generation catalog info */}
            <Route
              path="/generation"
              element={
                <PrivateRoute>
                  <GenerationPage />
                </PrivateRoute>
              }
            />

            {/* Dynamic classroom layouts */}
            <Route
              path="/class/:level/:subclass"
              element={
                <PrivateRoute>
                  <ClassPage />
                </PrivateRoute>
              }
            />

            {/* Error route fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}
