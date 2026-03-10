import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [inspectAttr(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api/groq': {
        target: 'https://api.groq.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/groq/, ''),
        headers: {
          'Origin': 'https://api.groq.com',
          'Referer': 'https://api.groq.com'
        }
      },
      '/api/scores': {
        target: 'http://localhost:8888/.netlify/functions/scores',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/scores/, ''),
      }
    }
  }
});
