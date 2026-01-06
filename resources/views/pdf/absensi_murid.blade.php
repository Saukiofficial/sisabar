@extends('pdf.layout')

@section('title', 'Laporan Rekap Absensi Siswa')

@section('content')
    <p><strong>Kelas:</strong> {{ $kelas->nama_kelas }}</p>
    <p><strong>Periode:</strong> {{ $bulan }}</p>

    <table>
        <thead>
            <tr>
                <th>Nama Siswa</th>
                <th class="text-center">Hadir</th>
                <th class="text-center">Sakit</th>
                <th class="text-center">Izin</th>
                <th class="text-center">Alpha</th>
                <th class="text-center">Total %</th>
            </tr>
        </thead>
        <tbody>
            @foreach($rekap as $data)
            <tr>
                <td>{{ $data['nama'] }}</td>
                <td class="text-center">{{ $data['H'] }}</td>
                <td class="text-center">{{ $data['S'] }}</td>
                <td class="text-center">{{ $data['I'] }}</td>
                <td class="text-center">{{ $data['A'] }}</td>
                <td class="text-center">{{ number_format($data['persentase'], 1) }}%</td>
            </tr>
            @endforeach
        </tbody>
    </table>
@endsection
