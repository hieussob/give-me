import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    // Produce smaller, more cache-friendly chunks
    rollupOptions: {
      output: {
        manualChunks: {
          // Vue runtime in its own chunk
          'vendor-vue': ['vue', 'vue-router'],
        }
      }
    },
    // Increase the chunk-size warning threshold (medicine data chunks are intentionally large)
    chunkSizeWarningLimit: 600,
  }
})
