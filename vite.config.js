import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite"; // Import `loadEnv`

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode (e.g., development or production)
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      // Inject the environment variable into your application
      'process.env.VITE_REACT': JSON.stringify(env.VITE_REACT),
    },
  };
});
