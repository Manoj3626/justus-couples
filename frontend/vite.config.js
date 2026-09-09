import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function htmlCacheBuster() {
  return {
    name: 'html-cache-buster',
    transformIndexHtml(html) {
      const version = Date.now()
      return html.replace(/(href|src)="(\/assets\/[^"]+)"/g, `$1="$2?v=${version}"`)
    },
  }
}

export default defineConfig({
  plugins: [react(), htmlCacheBuster()],
  server: {
    host: true, // Listens on all network interfaces for mobile testing
    port: 3000,
    allowedHosts: true, // Allows localtunnel and external domains
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/socket.io': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        ws: true,
        secure: false,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'lucide-react', 'socket.io-client'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})

