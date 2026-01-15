import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor libraries
          vendor: ["react", "react-dom", "react-router-dom"],
          // UI libraries
          ui: ["@radix-ui/react-label", "@radix-ui/react-select", "sonner"],
          // Animation library
          motion: ["framer-motion"],
          // Form libraries
          forms: ["react-hook-form", "@hookform/resolvers", "zod"],
          // Date utilities
          date: ["date-fns"],
          // Icons
          icons: ["lucide-react"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
