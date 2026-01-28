<!DOCTYPE html>
<html>
<head>
    <title>Kartu Pelajar</title>
    <style>
        @page { margin: 0px; }
        body {
            margin: 0px;
            font-family: Arial, Helvetica, sans-serif;
            background-color: #f3f4f6;
        }
        .card {
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
            color: white;
            padding: 10px;
            box-sizing: border-box;
            position: relative;
            overflow: hidden;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid rgba(255,255,255,0.3);
            padding-bottom: 5px;
            margin-bottom: 10px;
        }
        .header h2 {
            margin: 0;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .header p {
            margin: 0;
            font-size: 8px;
            color: #dbeafe;
        }
        .content {
            display: table;
            width: 100%;
        }
        .photo-area {
            display: table-cell;
            width: 70px;
            vertical-align: top;
        }
        .photo-box {
            width: 60px;
            height: 70px;
            background-color: #fff;
            border: 2px solid white;
            border-radius: 4px;
            overflow: hidden;
        }
        .photo-box img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .info-area {
            display: table-cell;
            vertical-align: top;
            padding-left: 5px;
        }
        .info-row {
            margin-bottom: 2px;
        }
        .label {
            font-size: 8px;
            color: #bfdbfe;
            text-transform: uppercase;
        }
        .value {
            font-size: 11px;
            font-weight: bold;
        }
        .qr-area {
            position: absolute;
            bottom: 10px;
            right: 10px;
            background: white;
            padding: 2px;
            border-radius: 4px;
        }
        .footer-stripe {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 5px;
            background-color: #fbbf24;
        }
    </style>
</head>
<body>
    <div class="card">
        <!-- HEADER -->
        <div class="header">
            <h2>KARTU PELAJAR</h2>
            <p>{{ $sekolah['nama'] }}</p>
        </div>

        <!-- CONTENT -->
        <div class="content">
            <!-- FOTO -->
            <div class="photo-area">
                <div class="photo-box">
                    @if($user->avatar)
                        {{-- Gunakan public_path untuk gambar lokal agar terbaca dompdf --}}
                        <img src="{{ public_path('storage/' . $user->avatar) }}" alt="Foto">
                    @else
                        {{-- Placeholder jika tidak ada foto --}}
                        <div style="width:100%; height:100%; background:#ccc; display:flex; align-items:center; justify-content:center; color:#555; font-size:8px;">
                            NO FOTO
                        </div>
                    @endif
                </div>
            </div>

            <!-- DATA -->
            <div class="info-area">
                <div class="info-row">
                    <div class="label">Nama Lengkap</div>
                    <div class="value">{{ strtoupper($siswa->nama) }}</div>
                </div>
                <div class="info-row">
                    <div class="label">Nomor Induk Siswa</div>
                    <div class="value">{{ $siswa->nis }}</div>
                </div>
                <div class="info-row">
                    <div class="label">Kelas</div>
                    <div class="value">{{ $siswa->kelas ? $siswa->kelas->nama_kelas : '-' }}</div>
                </div>
            </div>
        </div>

        <!-- QR CODE (Nanti discan di Gerbang) -->
        <div class="qr-area">
            {{-- Generate QR Code gambar base64 --}}
            <img src="data:image/png;base64, {{ base64_encode(QrCode::format('png')->size(60)->generate($siswa->nis)) }} ">
        </div>

        <div class="footer-stripe"></div>
    </div>
</body>
</html>
