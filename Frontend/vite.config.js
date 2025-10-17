import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { analyzer } from "vite-bundle-analyzer";

export default defineConfig({
  plugins: [
    react(),
    analyzer({
      analyzerMode: "static",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@common": path.resolve(__dirname, "../Common"),
    },
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
  },
});
