import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES === 'true' ? '/sedu-somar-alfa-2/' : '/',
  server: {
    port: 5173,
    open: true
  },
  optimizeDeps: {
    include: ['primereact/breadcrumb', 'primereact/button', 'primereact/dropdown', 'primereact/datatable', 'primereact/column', 'primereact/dialog']
  }
})

