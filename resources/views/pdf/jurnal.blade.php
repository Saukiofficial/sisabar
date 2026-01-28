@extends('pdf.layout')

@section('title', 'Laporan Jurnal Mengajar')

@section('content')
    <style>
        /* Style untuk kop surat yang konsisten dengan Index.jsx */
        .kop-surat {
            margin-bottom: 20px;
            border: 3px solid #000;
            border-left: 8px solid #1e4d7b;
            overflow: hidden;
        }

        .kop-container {
            display: table;
            width: 100%;
            table-layout: fixed;
        }

        .kop-logo-section {
            display: table-cell;
            width: 160px;
            background: linear-gradient(135deg, #1e4d7b 0%, #2d6a9f 100%);
            padding: 20px;
            text-align: center;
            vertical-align: middle;
        }

        .kop-logo {
            width: 120px;
            height: 120px;
            margin: 0 auto;
        }

        .kop-logo img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        .kop-content {
            display: table-cell;
            padding: 10px 15px;
            background: white;
            vertical-align: middle;
        }

        .kop-nama-yayasan {
            font-size: 10px;
            font-weight: 700;
            color: #000;
            margin: 0 0 3px 0;
            line-height: 1.3;
            font-family: Arial, sans-serif;
        }

        .kop-nama-sekolah {
            font-size: 24px;
            font-weight: 700;
            color: #1e5a96;
            margin: 5px 0;
            letter-spacing: 2px;
            font-family: Arial, sans-serif;
            line-height: 1.2;
        }

        .kop-nsm-npsn {
            font-size: 10px;
            font-weight: 600;
            color: #000;
            margin: 5px 0;
            font-family: Arial, sans-serif;
        }

        .kop-status {
            background-color: #1e5a96;
            color: white;
            font-size: 12px;
            font-weight: 700;
            padding: 4px 20px;
            display: inline-block;
            margin: 6px 0;
            font-family: Arial, sans-serif;
        }

        .kop-contact {
            font-size: 9px;
            color: #000;
            margin-top: 8px;
            font-family: Arial, sans-serif;
        }

        .kop-contact-item {
            display: inline-block;
            margin-right: 20px;
        }

        .kop-icon {
            display: inline-block;
            width: 14px;
            height: 14px;
            background-color: #ff6600;
            border-radius: 50%;
            text-align: center;
            line-height: 14px;
            font-size: 9px;
            color: white;
            margin-right: 5px;
        }

        .kop-alamat {
            display: table-cell;
            width: 130px;
            font-size: 8px;
            color: #000;
            font-style: italic;
            text-align: right;
            line-height: 1.5;
            padding: 8px 8px;
            vertical-align: middle;
            font-family: Arial, sans-serif;
        }

        .info-laporan {
            margin: 20px 0;
            padding: 10px;
            background-color: #f8f9fa;
            border-left: 4px solid #0c5280;
        }

        .info-laporan p {
            margin: 5px 0;
            font-size: 12px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            font-size: 11px;
        }

        table thead {
            background-color: #0c5280;
            color: white;
        }

        table th {
            padding: 10px 8px;
            text-align: left;
            font-weight: bold;
        }

        table td {
            padding: 8px;
            border-bottom: 1px solid #ddd;
        }

        table tbody tr:nth-child(even) {
            background-color: #f8f9fa;
        }

        table tbody tr:hover {
            background-color: #e9ecef;
        }
    </style>

    {{-- Kop Surat dengan Desain Baru --}}
    <div class="kop-surat">
        <div class="kop-container">
            {{-- Logo Section --}}
            <div class="kop-logo-section">
                <div class="kop-logo">
                    <img src="{{ public_path('images/logosekolah.png') }}" alt="Logo Sekolah">
                </div>
            </div>

            {{-- Konten Utama --}}
            <div class="kop-content">
                <p class="kop-nama-yayasan">YAYASAN SYEKH ABDURRAHMAN BUJU' AGUNG RABAH (YASYRAH)</p>
                <h1 class="kop-nama-sekolah">MA. SYEKH ABDURRAHMAN</h1>
                <p class="kop-nsm-npsn">NSM: 131235280108&nbsp;&nbsp;&nbsp;&nbsp;NPSN: 69994782</p>
                <div class="kop-status">TERAKREDITASI</div>
                <div class="kop-contact">
                    <span class="kop-contact-item">
                        <span class="kop-icon">🌐</span>www.sabar.or.id
                    </span>
                    <span class="kop-contact-item">
                        <span class="kop-icon">✉</span>ma.syekhabdurrahman@gmail.com
                    </span>
                    <span class="kop-contact-item">
                        <span class="kop-icon">📞</span>+6282334240445
                    </span>
                </div>
            </div>

            {{-- Alamat Kanan --}}
            <div class="kop-alamat">
                <i>Jl. Asta Rabah,<br>
                Kompleks PP<br>
                Syekh Abdurrahman<br>
                Rabah Sumedangan,<br>
                Pademawu,<br>
                Pamekasan<br>
                69321</i>
            </div>
        </div>
    </div>

    {{-- Informasi Laporan --}}
    <div class="info-laporan">
        <p><strong>Guru:</strong> {{ $guru->user->name }}</p>
        <p><strong>Periode:</strong> {{ $bulan }}</p>
    </div>

    {{-- Tabel Jurnal --}}
    <table>
        <thead>
            <tr>
                <th style="width: 12%">Tanggal</th>
                <th style="width: 15%">Kelas</th>
                <th style="width: 18%">Mapel</th>
                <th style="width: 30%">Materi</th>
                <th style="width: 25%">Catatan</th>
            </tr>
        </thead>
        <tbody>
            @foreach($jurnals as $jurnal)
            <tr>
                <td>{{ \Carbon\Carbon::parse($jurnal->tanggal)->format('d/m/Y') }}</td>
                <td>{{ $jurnal->kelas->nama_kelas }}</td>
                <td>{{ $jurnal->mapel->nama_mapel }}</td>
                <td>{{ $jurnal->materi }}</td>
                <td>{{ $jurnal->catatan ?? '-' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
@endsection
