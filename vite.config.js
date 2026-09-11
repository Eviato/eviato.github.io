import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'docs',
    // mermaid's diagram renderers are dynamically imported and only fetched
    // by posts that actually use a diagram, so their chunk size doesn't
    // affect the app's normal load path.
    chunkSizeWarningLimit: 1600,
  },
})
