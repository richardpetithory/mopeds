import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import * as path from "node:path"
import {defineConfig} from "vite"

const DEVELOPMENT_MODE = process.env.NODE_ENV === "development"

export default defineConfig({
  base: DEVELOPMENT_MODE ? "/" : "/static/",
  plugins: [
    tailwindcss(),
    react(),
    {
      name: "index-html-env",
      async transformIndexHtml(html) {
        if (DEVELOPMENT_MODE) {
          html = html.replace(/{%.*?%}/, "")
          html = html.replace(/<base\s+href=".*?"\s+\/>/, "")
        }
        return html
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
})
