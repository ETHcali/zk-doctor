import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      buffer: 'buffer',
      events: 'events',
      util: 'util'
    }
  },
  define: {
    'process.env': {},
    global: 'globalThis',
    'process.version': JSON.stringify('v18.0.0')
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    },
    include: ['buffer', 'events', 'util']
  }
})
