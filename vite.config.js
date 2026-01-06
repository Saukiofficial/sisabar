import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            outDir: 'public/build',
            scope: '/',
            base: '/',
            manifest: {
                name: 'Smart School System',
                short_name: 'SmartSchool',
                description: 'Sistem Jurnal dan Absensi Sekolah Digital',
                theme_color: '#4F46E5', // Sesuaikan warna tema (Indigo-600)
                background_color: '#ffffff',
                display: 'standalone',
                orientation: 'portrait',
                start_url: '/dashboard', // Saat dibuka langsung ke dashboard
                icons: [
                    {
                        src: '/images/icons/logosisabar.png', // Fallback icon (jika Anda malas resize)
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable' // Penting agar icon full di Android
                    },
                    {
                        src: '/images/icons/icon-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: '/images/icons/icon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            },
            workbox: {
                // Cache aset statis agar cepat
                globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg}'],
                navigateFallback: null,
                cleanupOutdatedCaches: true
            }
        })
    ],
});
