import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";


export default defineConfig({
  plugins: [react(),tsconfigPaths()],
  build:{
    manifest:true,
    outDir:'build'
  },
  server:{
    https:false,
    hmr:{
      host:'localhost',
      port:3001,
      protocol:'ws',
    }
  }
})
