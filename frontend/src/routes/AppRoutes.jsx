import { Routes, Route } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import AuthLayout from "../components/layout/AuthLayout";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import PublicRoute from "../components/auth/PublicRoute";

import Dashboard from "../pages/Dashboard/Dashboard";
import Chat from "../pages/Chat/Chat";
import Files from "../pages/Files/Files";
import Forum from "../pages/Forum/Forum";
import Search from "../pages/Search/Search";
import Admin from "../pages/Admin/Admin";
import Settings from "../pages/Settings/Settings";

import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
  element={
    <PublicRoute>
      <AuthLayout />
    </PublicRoute>
  }
>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
</Route>

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="chat" element={<Chat />} />
        <Route path="files" element={<Files />} />
        <Route path="forum" element={<Forum />} />
        <Route path="search" element={<Search />} />
        <Route path="admin" element={<Admin />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;