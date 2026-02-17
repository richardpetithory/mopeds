import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import * as path from "node:path"
import {defineConfig} from "vite"

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@catalyst": path.resolve(__dirname, "catalyst"),
    },
  },
})
