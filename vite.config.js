import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const isDevelopment = mode === "development";

  return {
    plugins: [react(), tailwindcss()],
    test: {
      include: ["src/**/*.{test,spec}.{js,jsx}"],
    },
    server: {
      // Only development-specific server config
      ...(isDevelopment && {
        // Proxy configuration for API requests in development
        proxy: {
          "/api/datamuse": {
            target: "https://api.datamuse.com",
            changeOrigin: true,
            secure: false,
            rewrite: (path) => path.replace(/^\/api\/datamuse/, ""),
          },
        },
        // Enable CORS in development
        cors: {
          origin: true,
          credentials: true,
        },
        // Enable HMR with overlay
        hmr: {
          overlay: true,
        },
      }),
    },
    // Development-specific build config
    build: isDevelopment
      ? {
          sourcemap: true,
        }
      : {},
    // Development-specific esbuild config
    esbuild: isDevelopment
      ? {
          minify: false,
        }
      : {},
  };
});
