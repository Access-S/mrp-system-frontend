// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider as MaterialThemeProvider } from "@material-tailwind/react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // Remove StrictMode wrapper temporarily for testing
  <MaterialThemeProvider>
    <App />
  </MaterialThemeProvider>
);