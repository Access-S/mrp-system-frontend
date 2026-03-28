// BLOCK 1: Imports
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// BLOCK 2: Vite Configuration
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    hmr: {
        clientPort: 443
    },
    allowedHosts: [
        '5173-accesss-mrp-h4fgsbefng0.ws-us121.gitpod.io'
    ],
    proxy: {
      '/api': {
        target: 'https://3001-accesss-mrp-h4fgsbefng0.ws-us121.gitpod.io',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-ui': [
            '@floating-ui/react',
            '@heroicons/react',
            'clsx',
            'use-debounce',
          ],
          'vendor-charts': ['apexcharts', 'react-apexcharts'],
          'vendor-supabase': ['@supabase/supabase-js'],
        },
      },
      plugins: [
        visualizer({
          open: true,
          filename: 'dist/stats.html',
          gzipSize: true,
          brotliSize: true, 
        }),
      ],
    },
    chunkSizeWarningLimit: 1000,
  },
})