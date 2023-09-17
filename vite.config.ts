import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
  ],
  server: {
    host: '0.0.0.0',
    proxy: {
      "/hzh": {
        target: 'http://localhost:3660',
        secure: false,
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/hzh/, "/"),
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
