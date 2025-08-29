import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  build: {
    minify: mode === 'production' ? 'terser' : false,
    terserOptions: {
      compress: {
        drop_debugger: mode === 'production',
        pure_funcs: mode === 'production' ? ['console.log', 'console.warn'] : [],
      },
      mangle: {
        safari10: true,
      },
    },
    rollupOptions: {
      output: {
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop()?.split('.')[0] || 'chunk'
            : 'chunk';
          return mode === 'production' ? `assets/[hash]-${facadeModuleId.toLowerCase()}.js` : `assets/[name]-[hash].js`;
        },
        entryFileNames: mode === 'production' ? 'assets/[hash].js' : 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (mode === 'production') {
            if (assetInfo.name?.endsWith('.css')) {
              return 'assets/[hash].css';
            }
            return 'assets/[hash].[ext]';
          }
          return 'assets/[name]-[hash].[ext]';
        },
      },
    },
    cssMinify: mode === 'production',
    sourcemap: mode === 'development',
  },
}));
