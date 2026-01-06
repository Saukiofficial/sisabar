@extends('pdf.layout')

@section('title', 'Laporan Absensi Guru')

@section('content')
    <p><strong>Nama Guru:</strong> {{ $guru->user->name }}</p>
    <p><strong>Bulan:</strong> {{ $bulan }}</p>

    <table>
        <thead>
            <tr>
                <th>Tanggal</th>
                <th>Jam Masuk</th>
                <th>Jam Pulang</th>
                <th>Lokasi</th>
                <th>Keterangan</th>
            </tr>
        </thead>
        <tbody>
            @foreach($absensis as $absen)
            <tr>
                <td>{{ \Carbon\Carbon::parse($absen->tanggal)->format('d/m/Y') }}</td>
                <td>{{ $absen->jam_masuk ?? '-' }}</td>
                <td>{{ $absen->jam_pulang ?? '-' }}</td>
                <td>{{ $absen->lokasi ?? '-' }}</td>
                <td>
                    @if($absen->jam_masuk && $absen->jam_pulang)
                        Hadir Lengkap
                    @else
                        Belum Pulang/Lupa Absen
                    @endif
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
@endsection
