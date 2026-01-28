<!DOCTYPE html>
<html>
<head>
    <title>Data Guru - {{ $guru->user->name }}</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; }
        .header h1 { margin: 0; font-size: 18px; text-transform: uppercase; }
        .header p { margin: 2px 0; font-size: 10px; }

        .content { margin: 20px; }
        .table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .table td { padding: 8px; vertical-align: top; }
        .label { width: 150px; font-weight: bold; }
        .separator { width: 20px; text-align: center; }

        .card-container {
            border: 1px solid #ccc;
            padding: 20px;
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
        }

        .footer { margin-top: 50px; text-align: right; }
        .ttd-box { display: inline-block; text-align: center; width: 200px; }
        .ttd-space { height: 60px; }
    </style>
</head>
<body>

    <div class="header">
        <h1>{{ $sekolah['nama'] ?? 'SMA SMART CLASS' }}</h1>
        <p>{{ $sekolah['alamat'] ?? 'Alamat Sekolah' }}</p>
    </div>

    <div class="card-container">
        <h3 style="text-align: center; text-decoration: underline;">BIODATA PENGAJAR</h3>

        <table class="table">
            <tr>
                <td class="label">Nama Lengkap</td>
                <td class="separator">:</td>
                <td>{{ $guru->user->name }}</td>
            </tr>
            <tr>
                <td class="label">Username / NIP</td>
                <td class="separator">:</td>
                <td>{{ $guru->user->username }}</td>
            </tr>
            <tr>
                <td class="label">Email</td>
                <td class="separator">:</td>
                <td>{{ $guru->user->email }}</td>
            </tr>
            <tr>
                <td class="label">Mata Pelajaran</td>
                <td class="separator">:</td>
                <td>{{ $guru->mapel ? $guru->mapel->nama_mapel : '-' }}</td>
            </tr>
            <tr>
                <td class="label">Wali Kelas</td>
                <td class="separator">:</td>
                <td>{{ $guru->kelas ? $guru->kelas->nama_kelas : '-' }}</td>
            </tr>
            <tr>
                <td class="label">Status Akun</td>
                <td class="separator">:</td>
                <td>{{ $guru->status_aktif ? 'Aktif' : 'Non-Aktif' }}</td>
            </tr>
        </table>
    </div>

    <div class="footer">
        <div class="ttd-box">
            <p>Kota Belajar, {{ date('d F Y') }}</p>
            <p>Kepala Sekolah,</p>
            <div class="ttd-space"></div>
            <p><strong>( ........................... )</strong></p>
            <p>NIP. ...........................</p>
        </div>
    </div>

</body>
</html>
