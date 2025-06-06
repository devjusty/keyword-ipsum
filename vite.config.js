import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    headers: {
      // Commented out during dev
      "Strict-Transport-Security": "max-age=86400; includeSubDomains",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "SAMEORIGIN",
      "X-XSS-Protection": "1; mode=block",
      "Content-Security-Policy": "default-src 'self' https://api.datamuse.com; upgrade-insecure-requests",
    },
    // Add proxy configuration for local development
    proxy: {
      "/api/datamuse": {
        target: "https://api.datamuse.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/datamuse/, ""),
      },
    },
  },
  // Modify how CSP is handled in development
  define: {
    // eslint-disable-next-line no-undef
    "import.meta.env.CSP_ENABLED": JSON.stringify(process.env.NODE_ENV !== "development"),
  },
});
