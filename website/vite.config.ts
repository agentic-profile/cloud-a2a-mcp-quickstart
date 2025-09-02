import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    base: process.env.VITE_BASE_URL || '/',
    build: {
        outDir: 'www',
    },
    css: {
        postcss: './postcss.config.js',
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
})
