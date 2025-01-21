import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

export default defineConfig({
    root: 'src',
    base: './',
    server: {
        port: 3000,
        https: {
            key: fs.readFileSync(path.resolve(__dirname, 'localhost.key')),
            cert: fs.readFileSync(path.resolve(__dirname, 'localhost.crt'))
        },
        host: '0.0.0.0' // This allows you to access the server from your iPhone using the IP address
    },
    build: {
        outDir: '../dist',
        emptyOutDir: true
    }
}); 