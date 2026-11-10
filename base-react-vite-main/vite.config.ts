import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
// https://vite.dev/config/
export default defineConfig({
  define: {
    'process.env.SC_DISABLE_SPEEDY': 'true',
    'SC_DISABLE_SPEEDY': 'true',
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@config": path.resolve(__dirname, "src/config"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@constants": path.resolve(__dirname, "src/shared/constants"),
      "@layouts": path.resolve(__dirname, "src/layouts"),
      "@features": path.resolve(__dirname, "src/features"),
      "@guards": path.resolve(__dirname, "src/guards"),
      "@shared": path.resolve(__dirname, "src/shared"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://be-bookphim-production.up.railway.app',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-antd': ['antd', '@ant-design/cssinjs'],
          'vendor-styled': ['styled-components'],
          'vendor-icons': ['lucide-react', 'react-icons'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-animation': ['gsap'],
        },
      },
    },
  },
});
