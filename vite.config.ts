import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { defineConfig } from 'vite';
import { nitro } from 'nitro/vite';
import viteReact from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // Import Tailwind v4 plugin
import tsconfigPaths from 'vite-tsconfig-paths'; // Import path resolver
import path from 'path';

export default defineConfig({
  plugins: [
    tanstackStart(), 
    tsconfigPaths(), // Automatically handles the @/ alias from tsconfig
    tailwindcss(),   // Injects and compiles Tailwind v4 styles
    nitro({ preset: 'vercel' }), 
    viteReact()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
