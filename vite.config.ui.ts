// Used when developing or building just the UI minus Figma context 
import { defineConfig } from "vite";
import path from "path";

import { viteSingleFile } from "vite-plugin-singlefile";
import vue from "@vitejs/plugin-vue";
import postcssUrl from "postcss-url";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), viteSingleFile()],
    root: path.resolve(__dirname, "./src/ui/"),
    build: {
        outDir: path.resolve(__dirname, "./dist"),
        rollupOptions: {
            input: {
                ui: path.relative(__dirname, "./src/ui/index.html"),
            },
            output: {
                entryFileNames: "[name].js",
            },
        },
    },
    css: {
        postcss: {
            plugins: [postcssUrl({ url: "inline" })],
        },
    },
    resolve: {
        alias: {
            "@common": path.resolve(__dirname, "./src/common"),
            "@ui": path.resolve(__dirname, "./src/ui"),
        },
    },
});