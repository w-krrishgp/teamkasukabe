import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import { fileURLToPath, URL } from 'node:url'

function crossDeviceBroadcastPlugin(): Plugin {
  return {
    name: 'cross-device-broadcast-plugin',
    configureServer(server) {
      server.ws.on('harvestguard:outbreak_broadcast', (data) => {
        // Broadcast to all connected devices (phones, laptops, tablets)
        server.ws.send({
          type: 'custom',
          event: 'harvestguard:outbreak_receive',
          data,
        })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), crossDeviceBroadcastPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    host: true, // enables local network preview for testing on physical Android devices
  },
})

