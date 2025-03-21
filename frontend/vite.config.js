import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./", // Ensures correct paths for assets
  build: {
    outDir: "dist", // Ensures Vite outputs files to 'dist'
  },
});
