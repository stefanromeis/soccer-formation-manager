import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/soccer-formation-manager/',
  server: {
    port: 7000,
    open: true
  }
})
