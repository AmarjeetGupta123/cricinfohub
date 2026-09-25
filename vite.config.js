import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      "/api": {
        target: "https://www.cricbuzz.com",
        changeOrigin: true,
        secure: true,
      },

      "/backend-api": {
        target: "https://cricinfohub-api.onrender.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/backend-api/, "/api"),
      },
    },
  },
});