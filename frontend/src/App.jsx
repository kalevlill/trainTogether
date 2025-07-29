import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import Layout from "./Layout/Layout";
import RegisterPage from "./pages/RegisterPage";
import Auth from "./components/Auth";
import { UserProvider } from "./components/context/UserContext";
import Onboarding from "./pages/Onboarding";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import DashboardProvider from "./components/context/DashboardContext";
import MyPosts from "./pages/MyPosts";
import PostProfilePage from "./pages/PostProfilePage";

function App() {
  return (
    <UserProvider>
      <DashboardProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/register" element={<Auth />} />
              <Route path="/login" element={<Auth type="login" />} />

              <Route
                path="/onboarding"
                element={
                  <ProtectedRoute>
                    <Onboarding />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/myposts"
                element={
                  <ProtectedRoute>
                    <MyPosts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/posts/:id"
                element={
                  <ProtectedRoute>
                    <PostProfilePage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Layout>
        </BrowserRouter>
      </DashboardProvider>
    </UserProvider>
  );
}

export default App;
