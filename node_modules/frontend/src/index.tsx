import React from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import App from "./App.tsx";
import { Chat } from "./components";
import AuthProvider from "./contexts/AuthContext.tsx";
import ThemeProvider from "./contexts/ThemeContext.tsx";
import "./globals.css";

const createRoot = (element: HTMLElement, chatCls?: React.FC) => {
    return ReactDOM.createRoot(element).render(
      <React.StrictMode>
        <ThemeProvider>
          <AuthProvider>
            <App ChatComponent={chatCls} />
          </AuthProvider>
        </ThemeProvider>
        <ToastContainer />
      </React.StrictMode>
    );
}

export { Chat, createRoot };
