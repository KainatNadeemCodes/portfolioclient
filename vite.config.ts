import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { defineConfig } from 'vite';
import { nitro } from 'nitro/vite';
import viteReact from '@vitejs/plugin-react';
import path from 'path'; // 1. Import path

export default defineConfig({
  plugins: [
    tanstackStart(), 
    nitro({ preset: 'vercel' }), 
    viteReact()
  ],
  resolve: {
    alias: {
      // 2. Define the alias to point to your src directory
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
