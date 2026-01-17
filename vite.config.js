import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    middlewareMode: false,
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (
          req.url?.startsWith("/reset-password/") ||
          req.url?.startsWith("/verify-otp") ||
          req.url?.includes("/")
        ) {
          // add more deep paths if needed
          req.url = "/";
        }
        next();
      });
    },
  },
});
