import { defineConfig } from "vite";

export default defineConfig({
  build: {
    minify: false,
  },
  esbuild: {
    jsxFactory: "h",
    jsxFragment: "Fragment",
  },
});
