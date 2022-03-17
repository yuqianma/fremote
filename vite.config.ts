import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 22113,
    host: true,
    open: true,
    proxy: {
      // '/api': 'http://localhost:22315',
    }
  },
  plugins: [preact()],
})
