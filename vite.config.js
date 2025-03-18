import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/virtual_staging_demo/',
  plugins: [react()],
})