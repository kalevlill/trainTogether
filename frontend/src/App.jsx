import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import Layout from "./Layout/Layout";
import RegisterPage from "./pages/RegisterPage";
import Auth from "./components/Auth";
import { UserProvider } from "./components/context/UserContext";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<Auth type="register" />} />
            <Route path="/login" element={<Auth type="login" />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
