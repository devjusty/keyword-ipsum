import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import netlify from "@netlify/vite-plugin";

export default defineConfig(({ mode }) => {
  const isDevelopment = mode === "development";

  return {
    plugins: [react(), tailwindcss(), netlify()],
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
    build: {
      ...(isDevelopment && {
        sourcemap: true,
      }),
      rolldownOptions: {
        onwarn(warning, defaultHandler) {
          if (
            warning.code === "INVALID_ANNOTATION" &&
            warning.id?.includes("/node_modules/zod/v4/core/") &&
            warning.message.includes(
              "contains an annotation that Rollup cannot interpret due to the position",
            )
          ) {
            return;
          }

          defaultHandler(warning);
        },
      },
    },
  };
});
