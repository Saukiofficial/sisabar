<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead

        <!-- PWA Meta Tags -->
        <meta name="theme-color" content="#4F46E5"/>
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black">
        <meta name="apple-mobile-web-app-title" content="Jurnal Guru">
        <link rel="apple-touch-icon" href="/images/icons/icon-192x192.png">

        <!-- Script Auto Reload saat Update (Opsional tapi bagus) -->
        <script>
            if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/sw.js');
                });
            }
        </script>
        <!-- PWA Icons -->
    <link rel="apple-touch-icon" href="/images/icons/icons.png">
    <link rel="icon" type="image/png" sizes="512x512" href="/images/icons/icons.png">
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
