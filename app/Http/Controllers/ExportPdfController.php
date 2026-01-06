<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Jurnal;
use App\Models\AbsensiMurid;
use App\Models\AbsensiGuru;
use App\Models\Guru;
use App\Models\Kelas;
use App\Models\Siswa;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class ExportPdfController extends Controller
{
    // 1. EXPORT JURNAL MENGAJAR
    public function jurnal(Request $request)
    {
        // Default bulan ini jika tidak ada filter
        $month = $request->input('month', date('m'));
        $year = $request->input('year', date('Y'));

        $user = Auth::user();
        // Cari profil guru dari user yang login
        $guru = Guru::where('user_id', $user->id)->first();

        if (!$guru) return abort(403, 'Akses Ditolak');

        $jurnals = Jurnal::with(['kelas', 'mapel'])
            ->where('guru_id', $guru->id)
            ->whereMonth('tanggal', $month)
            ->whereYear('tanggal', $year)
            ->orderBy('tanggal')
            ->get();

        $pdf = Pdf::loadView('pdf.jurnal', [
            'jurnals' => $jurnals,
            'guru' => $guru,
            'bulan' => Carbon::create($year, $month)->translatedFormat('F Y')
        ]);

        return $pdf->stream('Laporan-Jurnal.pdf');
    }

    // 2. EXPORT REKAP ABSENSI MURID (PER KELAS)
    public function absensiMurid(Request $request)
    {
        $kelas_id = $request->kelas_id;
        $month = $request->input('month', date('m'));
        $year = $request->input('year', date('Y'));

        $kelas = Kelas::findOrFail($kelas_id);
        $siswas = Siswa::where('kelas_id', $kelas_id)->orderBy('nama')->get();

        $rekap = [];

        foreach ($siswas as $siswa) {
            // Hitung jumlah kehadiran
            $hadir = AbsensiMurid::where('siswa_id', $siswa->id)
                ->whereMonth('tanggal', $month)->whereYear('tanggal', $year)->where('status', 'Hadir')->count();
            $sakit = AbsensiMurid::where('siswa_id', $siswa->id)
                ->whereMonth('tanggal', $month)->whereYear('tanggal', $year)->where('status', 'Sakit')->count();
            $izin = AbsensiMurid::where('siswa_id', $siswa->id)
                ->whereMonth('tanggal', $month)->whereYear('tanggal', $year)->where('status', 'Izin')->count();
            $alpha = AbsensiMurid::where('siswa_id', $siswa->id)
                ->whereMonth('tanggal', $month)->whereYear('tanggal', $year)->where('status', 'Alpha')->count();

            $total_hari = 20; // Asumsi hari efektif sekolah, atau hitung dynamic
            $persentase = ($hadir / $total_hari) * 100;

            $rekap[] = [
                'nama' => $siswa->nama,
                'H' => $hadir,
                'S' => $sakit,
                'I' => $izin,
                'A' => $alpha,
                'persentase' => $persentase
            ];
        }

        $pdf = Pdf::loadView('pdf.absensi_murid', [
            'rekap' => $rekap,
            'kelas' => $kelas,
            'bulan' => Carbon::create($year, $month)->translatedFormat('F Y')
        ]);

        return $pdf->stream('Rekap-Absensi-Siswa.pdf');
    }

    // 3. EXPORT ABSENSI GURU (PRIBADI)
    public function absensiGuru(Request $request)
    {
        $month = $request->input('month', date('m'));
        $year = $request->input('year', date('Y'));

        $user = Auth::user();
        $guru = Guru::where('user_id', $user->id)->first();

        if (!$guru) return abort(403);

        $absensis = AbsensiGuru::where('guru_id', $guru->id)
            ->whereMonth('tanggal', $month)
            ->whereYear('tanggal', $year)
            ->orderBy('tanggal')
            ->get();

        $pdf = Pdf::loadView('pdf.absensi_guru', [
            'absensis' => $absensis,
            'guru' => $guru,
            'bulan' => Carbon::create($year, $month)->translatedFormat('F Y')
        ]);

        return $pdf->stream('Laporan-Absensi-Guru.pdf');
    }
}
