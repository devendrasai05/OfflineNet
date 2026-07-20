import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";

import Dashboard from "./pages/Dashboard/Dashboard";
import Chat from "./pages/Chat/Chat";
import Files from "./pages/Files/Files";
import Forum from "./pages/Forum/Forum";
import Search from "./pages/Search/Search";
import Admin from "./pages/Admin/Admin";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Settings from "./pages/Settings/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Application Layout */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />

        <Route
          path="/chat"
          element={
            <MainLayout>
              <Chat />
            </MainLayout>
          }
        />

        <Route
          path="/files"
          element={
            <MainLayout>
              <Files />
            </MainLayout>
          }
        />

        <Route
          path="/forum"
          element={
            <MainLayout>
              <Forum />
            </MainLayout>
          }
        />

        <Route
          path="/search"
          element={
            <MainLayout>
              <Search />
            </MainLayout>
          }
        />

        <Route
          path="/admin"
          element={
            <MainLayout>
              <Admin />
            </MainLayout>
          }
        />

        <Route
          path="/settings"
          element={
            <MainLayout>
              <Settings />
            </MainLayout>
          }
        />

        {/* Authentication Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;