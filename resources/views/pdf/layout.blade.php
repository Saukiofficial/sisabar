<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid black; padding-bottom: 10px; }
        h1, h2 { margin: 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #333; padding: 5px; text-align: left; }
        th { background-color: #f2f2f2; }
        .text-center { text-align: center; }
    </style>
</head>
<body>
    <header>
        <h1>SMART SCHOOL SYSTEM</h1>
        <p>Jl. Pendidikan No. 123, Kota Pelajar, Indonesia</p>
        <h3>@yield('title')</h3>
    </header>

    <div class="content">
        @yield('content')
    </div>

    <div style="margin-top: 30px; text-align: right;">
        <p>Dicetak pada: {{ date('d-m-Y H:i') }}</p>
    </div>
</body>
</html>
