import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:4000";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);