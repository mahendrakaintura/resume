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
    @vite(['resources/js/app.js', "resources/js/Pages/{$page['component']}.vue"])
    @inertiaHead

    <!-- Force CSS reload in development -->
    @if(app()->environment('local'))
    <script>
        // Force cache busting for CSS in development
        window.addEventListener('load', function() {
            const links = document.querySelectorAll('link[rel="stylesheet"]');
            links.forEach(link => {
                if (link.href.includes('localhost:5173')) {
                    const newLink = link.cloneNode();
                    newLink.href = link.href + '?t=' + Date.now();
                    link.parentNode.replaceChild(newLink, link);
                }
            });
        });
    </script>
    @endif
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>