import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

import * as path from "node:path"
import {defineConfig} from "vite"

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
})
