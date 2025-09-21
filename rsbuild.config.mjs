import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSass } from "@rsbuild/plugin-sass";

export default defineConfig({
  plugins: [pluginReact(), pluginSass()],
  resolve: {
    alias: {
      "@": "./src",
      "@/styles": "./src/styles",
    },
  },
});
