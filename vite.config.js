import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig(({ mode }) => {
  // Get the current working directory
  const root = fileURLToPath(new URL(".", import.meta.url));

  // Load environment variables based on mode
  loadEnv(mode, root, "");

  // Development-specific configuration
  const isDevelopment = mode === "development";

  // Base configuration
  const config = {
    plugins: [react(), tailwindcss()],
    server: {
      // Development headers (less restrictive)
      headers: isDevelopment
        ? {
            // Basic security headers that won't break development
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "SAMEORIGIN",
            // More permissive CSP for development
            "Content-Security-Policy": [
              "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:",
              "connect-src 'self' https://api.datamuse.com ws://localhost:* wss://localhost:*",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https: http:",
              "font-src 'self' data: https: http:",
              "media-src 'self' data: blob:",
              "frame-src 'self' https://www.googletagmanager.com",
            ].join("; "),
          }
        : {
            // Production headers (more secure)
            "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "SAMEORIGIN",
            "X-XSS-Protection": "1; mode=block",
            "Content-Security-Policy": [
              "default-src 'self'",
              "connect-src 'self' https://api.datamuse.com",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https:",
              "font-src 'self' data: https:",
              "media-src 'self'",
              "frame-src 'self' https://www.googletagmanager.com",
            ].join("; "),
          },
      // Proxy configuration for API requests
      proxy: {
        "/api/datamuse": {
          target: "https://api.datamuse.com",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api\/datamuse/, ""),
        },
      },
      // Enable CORS in development
      cors: isDevelopment
        ? {
            origin: true,
            credentials: true,
          }
        : false,
      // Enable HMR (Hot Module Replacement)
      hmr: isDevelopment
        ? {
            overlay: true,
          }
        : false,
    },
    // Environment variables
    define: {
      // Make environment variables available in the client
      "import.meta.env.PROD": JSON.stringify(!isDevelopment),
      "import.meta.env.DEV": JSON.stringify(isDevelopment),
    },
  };

  // Development-specific overrides
  if (isDevelopment) {
    // Add source maps for better debugging
    config.build = {
      sourcemap: true,
    };

    // Disable minification for faster builds
    config.esbuild = {
      minify: false,
    };
  }

  return config;
});
