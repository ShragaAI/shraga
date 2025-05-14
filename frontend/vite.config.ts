import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default ({ mode } : { mode: string }) => {
  return defineConfig({
    plugins: [react()],
    server: {
      port: 5000,
      proxy: {
        "/api": {
          target: "http://localhost:8000",
          changeOrigin: true,
        },
        "/auth": {
          target: "http://localhost:8000",
          changeOrigin: true,
        },
        "/oauth": {
          target: "http://localhost:8000",
          changeOrigin: true,
        },
      },
    },
  });
};
