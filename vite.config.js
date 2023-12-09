import { resolve } from "path";
import { defineConfig } from "vite";

const root = resolve(__dirname,'src')
const outDir = resolve(__dirname,'dist')

// https://vitejs.dev/config/
export default defineConfig({
  root,
  server: {
    hmr:
      process.env.CODESANDBOX_SSE || process.env.GITPOD_WORKSPACE_ID
        ? 443
        : undefined,
  },
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(root,'index.html'),
        states: resolve(root,'states','index.html'),
        initial_zip: resolve(root, 'initial_zip','index.html')
      }
    }
  }
});
