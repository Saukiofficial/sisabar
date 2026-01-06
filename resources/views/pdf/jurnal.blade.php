@extends('pdf.layout')

@section('title', 'Laporan Jurnal Mengajar')

@section('content')
    <p><strong>Guru:</strong> {{ $guru->user->name }}</p>
    <p><strong>Periode:</strong> {{ $bulan }}</p>

    <table>
        <thead>
            <tr>
                <th>Tanggal</th>
                <th>Kelas</th>
                <th>Mapel</th>
                <th>Materi</th>
                <th>Catatan</th>
            </tr>
        </thead>
        <tbody>
            @foreach($jurnals as $jurnal)
            <tr>
                <td>{{ \Carbon\Carbon::parse($jurnal->tanggal)->format('d/m/Y') }}</td>
                <td>{{ $jurnal->kelas->nama_kelas }}</td>
                <td>{{ $jurnal->mapel->nama_mapel }}</td>
                <td>{{ $jurnal->materi }}</td>
                <td>{{ $jurnal->catatan }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
@endsection
