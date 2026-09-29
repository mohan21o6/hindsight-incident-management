import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createHindsightMiddleware } from './server/hindsightProxy.js';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'hindsight-api-server',
      configureServer(server) {
        server.middlewares.use(createHindsightMiddleware());
      },
      configurePreviewServer(server) {
        server.middlewares.use(createHindsightMiddleware());
      },
    },
  ],
  server: {
    port: 3000,
    host: true,
  },
});
