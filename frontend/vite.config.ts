import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
    host: true,
    allowedHosts: [
      "whatsappaiagent-production-9ff9.up.railway.app"
    ]
  }
})