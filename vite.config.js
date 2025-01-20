import { defineConfig } from 'vite';

export default defineConfig({
    root: 'src',
    base: '/ar-physics-lab/',
    server: {
        port: 3000
    },
    build: {
        outDir: '../dist',
        emptyOutDir: true
    }
}); 