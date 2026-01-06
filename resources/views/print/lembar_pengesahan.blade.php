<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Lembar Pengesahan - {{ $perangkat->judul }}</title>
    <style>
        body {
            font-family: 'Times New Roman', serif;
            font-size: 12pt;
            margin: 0;
            padding: 2cm; /* Margin standar surat resmi */
            color: #000;
        }
        /* KOP SURAT */
        .header {
            text-align: center;
            border-bottom: 3px double black; /* Garis ganda kop surat */
            padding-bottom: 10px;
            margin-bottom: 25px;
        }
        .header h1 { margin: 0; font-size: 16pt; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
        .header h2 { margin: 0; font-size: 14pt; font-weight: bold; text-transform: uppercase; }
        .header p { margin: 0; font-size: 11pt; font-style: italic; }

        /* JUDUL DOKUMEN */
        .title-section { text-align: center; margin-bottom: 30px; }
        .title-section h3 { margin: 5px 0; text-decoration: underline; text-transform: uppercase; font-size: 14pt; font-weight: bold; }
        .title-section p { margin: 5px 0; font-size: 12pt; }

        /* SECTION HEADERS */
        .section-header { font-weight: bold; margin-top: 20px; margin-bottom: 10px; font-size: 12pt; }

        /* TABEL INFO GURU */
        .info-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        .info-table td { padding: 4px 0; vertical-align: top; }
        .label-col { width: 220px; }
        .colon-col { width: 20px; text-align: center; }

        /* TABEL CHECKLIST */
        .checklist-table { width: 100%; border-collapse: collapse; font-size: 11pt; margin-top: 10px; }
        .checklist-table th, .checklist-table td { border: 1px solid black; padding: 6px; }
        .checklist-table th { background-color: #f0f0f0; text-align: center; font-weight: bold; vertical-align: middle; }
        .checklist-table .category-row { background-color: #e8e8e8; font-weight: bold; font-style: italic; }
        .checklist-table .center { text-align: center; }

        /* Simbol Centang */
        .check { font-family: DejaVu Sans, sans-serif; font-size: 14pt; font-weight: bold; }

        /* TANDA TANGAN */
        .ttd-container { margin-top: 50px; width: 100%; display: table; }
        .ttd-column { display: table-cell; width: 50%; text-align: center; vertical-align: top; }
        .ttd-space { height: 90px; } /* Ruang untuk tanda tangan basah/digital */
        .ttd-image { height: 90px; width: auto; display: block; margin: 0 auto; }
        .name { font-weight: bold; text-decoration: underline; margin-bottom: 4px; }
        .nip { font-size: 11pt; }

        /* PRINT MODE */
        @media print {
            @page { size: A4; margin: 2cm; }
            body { padding: 0; -webkit-print-color-adjust: exact; }
            .header { border-bottom: 3px double black !important; }
            .checklist-table th { background-color: #f0f0f0 !important; }
        }
    </style>
</head>
<body onload="window.print()">

    <!-- 1. KOP SURAT (Sesuaikan Nama Sekolah) -->
    <div class="header">
        <h1>MA SYEKH ABDURRAHMAN </h1>
        <h2>KEMENTERIAN AGAMA REPUBLIK INDONESIA</h2>
        <p>Jl.Rabah Sumenedangan Pademau Pamekasan</p>
    </div>

    <!-- 2. JUDUL LEMBAR PENGESAHAN -->
    <div class="title-section">
        <h3>LEMBAR PENGESAHAN & SUPERVISI</h3>
        <h3>PERANGKAT PEMBELAJARAN GURU</h3>
        <p>TAHUN PELAJARAN {{ date('Y') }}/{{ date('Y')+1 }}</p>
    </div>

    <!-- 3. DATA GURU -->
    <div class="section-header">I. Data Guru dan Perangkat Pembelajaran</div>
    <table class="info-table">
        <tr>
            <td class="label-col">Nama Guru</td>
            <td class="colon-col">:</td>
            <td>{{ $perangkat->guru->user->name }}</td>
        </tr>
        <tr>
            <td class="label-col">NIP / NUPTK</td>
            <td class="colon-col">:</td>
            <td>{{ $perangkat->guru->nip ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label-col">Mata Pelajaran</td>
            <td class="colon-col">:</td>
            <td>{{ $perangkat->mapel->nama_mapel }}</td>
        </tr>
        <tr>
            <td class="label-col">Kelas / Fase</td>
            <td class="colon-col">:</td>
            <td>-</td> <!-- Bisa ambil data kelas jika sudah ada relasinya -->
        </tr>
        <tr>
            <td class="label-col">Judul Dokumen</td>
            <td class="colon-col">:</td>
            <td>{{ $perangkat->judul }}</td>
        </tr>
        <tr>
            <td class="label-col">Tanggal Validasi</td>
            <td class="colon-col">:</td>
            <td>{{ $perangkat->tanggal_validasi ? \Carbon\Carbon::parse($perangkat->tanggal_validasi)->translatedFormat('d F Y') : '-' }}</td>
        </tr>
    </table>

    <!-- 4. TABEL CHECKLIST (Bagian II) -->
    <div class="section-header">II. Kelengkapan Bahan Ajar dan Dokumen Pendukung</div>
    <table class="checklist-table">
        <thead>
            <tr>
                <th rowspan="2" width="30">No</th>
                <th rowspan="2">Aspek yang Dinilai</th>
                <th colspan="2">Kelengkapan</th>
                <th rowspan="2" width="120">Catatan</th>
            </tr>
            <tr>
                <th width="60">Ada</th>
                <th width="60">Tidak</th>
            </tr>
        </thead>
        <tbody>
            @php
                // Ambil data checklist dari database
                // Decode JSON jika formatnya string, atau pakai langsung jika array
                $checkedItems = is_array($perangkat->checklist) ? $perangkat->checklist : json_decode($perangkat->checklist, true) ?? [];

                // Struktur Checklist Sesuai PDF
                $categories = [
                    'A. Perangkat Pembelajaran' => [
                        'Capaian Pembelajaran (CP)',
                        'Tujuan Pembelajaran (TP)',
                        'Alur Tujuan Pembelajaran (ATP)',
                        'Modul Ajar / RPP',
                        'Silabus / Kerangka Modul',
                        'Program Tahunan (Prota)',
                        'Program Semester (Prosem)'
                    ],
                    'B. Kelengkapan Dokumen Modul Ajar' => [
                        'Identitas Modul',
                        'Komponen Inti',
                        'Komponen Asesmen',
                        'Pengayaan dan Remedial',
                        'Refleksi Guru & Peserta Didik'
                    ],
                    'C. Materi / Sumber Ajar Pendukung' => [
                        'Buku Teks / Panduan Guru',
                        'Lembar Kerja Peserta Didik (LKPD)',
                        'Bahan Tayang (PPT, Video, dll)',
                        'Media Pembelajaran'
                    ]
                ];
                $no = 1;
            @endphp

            @foreach($categories as $categoryName => $items)
                <!-- Baris Kategori (Abu-abu) -->
                <tr class="category-row">
                    <td></td>
                    <td colspan="4" style="text-align: left; padding-left: 10px;">{{ $categoryName }}</td>
                </tr>
                <!-- Loop Item Checklist -->
                @foreach($items as $item)
                    <tr>
                        <td class="center">{{ $no++ }}</td>
                        <td>{{ $item }}</td>
                        <!-- Kolom Ada/Lengkap (v) -->
                        <td class="center check">
                            {{ in_array($item, $checkedItems) ? '✓' : '' }}
                        </td>
                        <!-- Kolom Tidak Ada (v) jika tidak dicentang -->
                        <td class="center check">
                            {{ !in_array($item, $checkedItems) ? '✓' : '' }}
                        </td>
                        <td></td> <!-- Kolom Catatan Kosong -->
                    </tr>
                @endforeach
            @endforeach
        </tbody>
    </table>

    <!-- 5. TANDA TANGAN -->
    <div class="ttd-container">
        <!-- Kolom Guru -->
        <div class="ttd-column">
            <p>Guru Mata Pelajaran,</p>
            <div class="ttd-space"></div> <!-- Tempat Tanda Tangan Basah Guru -->
            <p class="name">{{ $perangkat->guru->user->name }}</p>
            <p class="nip">NIP. {{ $perangkat->guru->nip ?? '-' }}</p>
        </div>

        <!-- Kolom Kepala Sekolah -->
        <div class="ttd-column">
            <p>Mengetahui,</p>
            <p>MA Syekh Abdurrahman </p>

            <!-- Gambar Tanda Tangan Digital Kepsek -->
            @if(isset($kepsek['ttd_path']) && $kepsek['ttd_path'])
                <img src="{{ $kepsek['ttd_path'] }}" alt="TTD Kepsek" class="ttd-image">
            @else
                <div class="ttd-space"></div>
            @endif

            <p class="name">{{ $kepsek['nama'] ?? '.........................' }}</p>
            <p class="nip">NIP. {{ $kepsek['nip'] ?? '.........................' }}</p>
        </div>
    </div>

</body>
</html>
