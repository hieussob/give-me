import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    // Produce smaller, more cache-friendly chunks
    rollupOptions: {
      output: {
        // rolldown-vite expects manualChunks as a function
        manualChunks(id) {
          if (/[\\/]node_modules[\\/](vue|@vue|vue-router)[\\/]/.test(id)) {
            return 'vendor-vue'
          }
        }
      }
    },
    // Increase the chunk-size warning threshold (medicine data chunks are intentionally large)
    chunkSizeWarningLimit: 600,
  }
})
