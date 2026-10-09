import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  // VITE_BASE = pasta onde o site fica publicado (ex.: "/vhconceptstore/"). Em domínio próprio, deixe "/".
  base: process.env.VITE_BASE ?? "/",
  plugins: [react()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});
