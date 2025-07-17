import { defineConfig, loadEnv } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());

    return {
        server: {
            host: '0.0.0.0', // Allow access from any host (localhost, 127.0.0.1, etc.)
            port: 5173,
            strictPort: true,
            hmr: {
                host: 'localhost', // Match the URL you're using in browser
                port: 5173
            },
            watch: {
                usePolling: true // Better file watching for CSS changes
            }
        },
        plugins: [
            laravel({
                input: 'resources/js/app.js',
                refresh: true,
            }),
            vue({
                template: {
                    transformAssetUrls: {
                        base: null,
                        includeAbsolute: false,
                    },
                },
            }),
        ],
        // Ensure proper asset handling
        build: {
            manifest: true,
            outDir: 'public/build',
            rollupOptions: {
                input: 'resources/js/app.js'
            }
        }
    };
});