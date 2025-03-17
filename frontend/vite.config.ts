import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default ({ mode } : { mode: string }) => {
  return defineConfig({
    plugins: [react()],
    optimizeDeps: {
      include: ['@googlemaps/markerclusterer']
    },
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
