import {defineConfig} from "vite";
import react from "@vitejs/plugin-react-swc";
import {URL, fileURLToPath} from "node:url";

export default defineConfig({
  server: {
    port: 3000, // Or your desired port
    strictPort: true,
    host: true, // This allows access from outside the container
    watch: {
      usePolling: true, // Essential for HMR in Docker environments
      interval: 100,
    },
    hmr: {
      host: "127.0.0.1", // Or a specific IP if needed for HMR connection
      port: 3000, // Or your custom HMR port
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  plugins: [react()],
});
