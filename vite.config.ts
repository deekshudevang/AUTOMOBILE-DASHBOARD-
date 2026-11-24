import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@autoverse/shared-types': path.resolve(__dirname, './packages/shared-types/src'),
      '@autoverse/gta-compat': path.resolve(__dirname, './packages/gta-compat/src'),
      '@autoverse/vehicle-registry': path.resolve(__dirname, './packages/vehicle-registry/src'),
      '@autoverse/json-intelligence': path.resolve(__dirname, './packages/json-intelligence/src'),
      '@autoverse/vehicle-generation-engine': path.resolve(__dirname, './packages/vehicle-generation-engine/src'),
      '@autoverse/vehicle-asset-pipeline': path.resolve(__dirname, './packages/vehicle-asset-pipeline/src'),
      '@autoverse/vehicle-exporter': path.resolve(__dirname, './packages/vehicle-exporter/src'),
      '@autoverse/authentic-geometry-engine': path.resolve(__dirname, './packages/authentic-geometry-engine/src')
    }
  },
  server: {
    port: 5173,
    host: true
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three/')) {
            return 'vendor-three';
          }
          if (id.includes('node_modules')) {
            return 'vendor-core';
          }
          if (id.includes('/packages/vehicle-exporter/') || id.includes('/packages/authentic-geometry-engine/')) {
            return 'engine-cad-export';
          }
          if (id.includes('/packages/vehicle-generation-engine/')) {
            return 'engine-vehicle-gen';
          }
        }
      }
    }
  }
});
