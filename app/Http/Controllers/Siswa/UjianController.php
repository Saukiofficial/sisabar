<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\JadwalUjian;
use App\Models\HasilUjian;
use App\Models\JawabanSiswa;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Carbon\Carbon;

class UjianController extends Controller
{
    private function getSiswa() {
        return Siswa::where('user_id', Auth::id())->firstOrFail();
    }

    public function index()
    {
        $siswa = $this->getSiswa();

        try {
            $now = Carbon::now('Asia/Jakarta');
        } catch (\Exception $e) {
            $now = Carbon::now();
        }

        $jadwals = JadwalUjian::with(['ujian.mapel', 'guru.user'])
            ->where('kelas_id', $siswa->kelas_id)
            ->where('status', '!=', 'Selesai')
            ->orderBy('waktu_mulai', 'asc')
            ->get()
            ->map(function ($jadwal) use ($siswa, $now) {
                try {
                    // PERBAIKAN TIMEZONE:
                    // Paksa interpretasi string dari DB sebagai Asia/Jakarta
                    // Jangan gunakan setTimezone() karena akan menggeser jam jika DB dianggap UTC
                    $waktuMulai = Carbon::parse($jadwal->waktu_mulai, 'Asia/Jakarta');
                    $waktuSelesai = Carbon::parse($jadwal->waktu_selesai, 'Asia/Jakarta');

                    if ($now->lessThan($waktuMulai)) {
                        $jadwal->status_waktu = 'MENUNGGU (' . $waktuMulai->format('d M H:i') . ')';
                        $jadwal->bisa_mulai = false;
                    } elseif ($now->greaterThan($waktuSelesai)) {
                        $jadwal->status_waktu = 'TELAT/BERAKHIR';
                        $jadwal->bisa_mulai = false;
                    } else {
                        $jadwal->status_waktu = 'SEKARANG';
                        $jadwal->bisa_mulai = true;
                    }
                } catch (\Exception $e) {
                    $jadwal->status_waktu = 'ERROR TANGGAL';
                    $jadwal->bisa_mulai = false;
                }

                $hasil = HasilUjian::where('ujian_id', $jadwal->ujian_id)
                    ->where('siswa_id', $siswa->id)
                    ->first();

                $jadwal->status_pengerjaan = $hasil ? $hasil->status : 'Belum';
                return $jadwal;
            });

        return Inertia::render('Siswa/Ujian/Index', [
            'jadwals' => $jadwals,
            'server_time' => $now->format('Y-m-d H:i:s')
        ]);
    }

    public function showPersiapan($id)
    {
        $jadwal = JadwalUjian::with(['ujian.mapel', 'guru.user'])->findOrFail($id);

        $now = Carbon::now('Asia/Jakarta');
        // PERBAIKAN TIMEZONE: Interpretasikan waktu DB sebagai WIB
        $waktuMulai = Carbon::parse($jadwal->waktu_mulai, 'Asia/Jakarta');
        $waktuSelesai = Carbon::parse($jadwal->waktu_selesai, 'Asia/Jakarta');

        if ($now->lessThan($waktuMulai)) {
            return redirect()->back()->with('error', 'Ujian belum dimulai. Dimulai: ' . $waktuMulai->format('H:i'));
        }
        if ($now->greaterThan($waktuSelesai)) {
            return redirect()->back()->with('error', 'Waktu ujian telah berakhir.');
        }

        return Inertia::render('Siswa/Ujian/Persiapan', [
            'jadwal' => $jadwal
        ]);
    }

    public function mulaiKerjakan(Request $request, $id)
    {
        $request->validate(['token' => 'required']);

        $jadwal = JadwalUjian::findOrFail($id);

        // Log untuk debugging jika redirect back terjadi
        Log::info("Siswa Login Ujian ID: $id | Token: {$request->token}");

        // 1. Validasi Waktu (Dengan Fix Timezone)
        $now = Carbon::now('Asia/Jakarta');
        $waktuMulai = Carbon::parse($jadwal->waktu_mulai, 'Asia/Jakarta');
        $waktuSelesai = Carbon::parse($jadwal->waktu_selesai, 'Asia/Jakarta');

        // Toleransi waktu 1 menit untuk beda detik server
        if ($now->lessThan($waktuMulai->subMinute())) {
            return redirect()->back()->with('error', 'Ujian belum dimulai! (Waktu Server: '.$now->format('H:i').')');
        }
        if ($now->greaterThan($waktuSelesai)) {
            return redirect()->back()->with('error', 'Waktu ujian sudah habis!');
        }

        // 2. Validasi Token
        if (strtoupper(trim($request->token)) !== strtoupper(trim($jadwal->token_ujian))) {
            return redirect()->back()->with('error', 'Token ujian salah! Silakan cek kembali.');
        }

        $siswa = $this->getSiswa();

        // 3. Buat/Ambil Sesi Ujian
        $hasil = HasilUjian::firstOrCreate(
            [
                'ujian_id' => $jadwal->ujian_id,
                'siswa_id' => $siswa->id
            ],
            [
                'waktu_mulai' => now(),
                'status' => 'Mengerjakan',
                'nilai_akhir' => 0
            ]
        );

        // 4. Redirect dengan parameter eksplisit 'id'
        // Masalah "Missing parameter: id" selesai di sini
        return redirect()->route('siswa.ujian.soal', ['id' => $hasil->id]);
    }

    public function showSoal($id) {
         $hasil = HasilUjian::with(['ujian.soals', 'ujian.mapel'])->findOrFail($id);

         $siswa = $this->getSiswa();
         if ($hasil->siswa_id !== $siswa->id) abort(403);

         // Jika status sudah selesai, lempar ke halaman nilai
         if ($hasil->status === 'Selesai') {
             return redirect()->route('siswa.nilai.index')->with('message', 'Anda sudah menyelesaikan ujian ini.');
         }

         $saved_jawabans = JawabanSiswa::where('hasil_ujian_id', $hasil->id)
             ->pluck('jawaban', 'ujian_soal_id');

         return Inertia::render('Siswa/Ujian/LembarKerja', [
             'hasil' => $hasil,
             'soals' => $hasil->ujian->soals,
             'saved_jawabans' => $saved_jawabans
         ]);
    }

    public function simpanJawaban(Request $request, $hasil_id) {
        $hasil = HasilUjian::findOrFail($hasil_id);

        if ($hasil->status !== 'Mengerjakan') {
             return response()->json(['status' => 'error', 'message' => 'Waktu habis'], 400);
        }

        JawabanSiswa::updateOrCreate(
            ['hasil_ujian_id' => $hasil_id, 'ujian_soal_id' => $request->soal_id],
            ['jawaban' => $request->jawaban]
        );
        return response()->json(['status' => 'saved']);
    }

    public function selesai($hasil_id) {
        $hasil = HasilUjian::with('ujian.soals')->findOrFail($hasil_id);

        $totalSkor = 0;
        $totalBobot = 0;

        foreach ($hasil->ujian->soals as $soal) {
             $totalBobot += $soal->bobot;
             $jawaban = JawabanSiswa::where('hasil_ujian_id', $hasil->id)
                        ->where('ujian_soal_id', $soal->id)
                        ->value('jawaban');

             if ($soal->tipe == 'Pilihan Ganda' && strtoupper($jawaban) == strtoupper($soal->kunci_jawaban)) {
                 $totalSkor += $soal->bobot;
             }
        }

        $nilai = $totalBobot > 0 ? ($totalSkor / $totalBobot) * 100 : 0;

        $hasil->update([
            'status' => 'Selesai',
            'waktu_selesai' => now(),
            'nilai_akhir' => round($nilai, 2)
        ]);

        return redirect()->route('siswa.nilai.index');
    }

    public function indexNilai()
    {
        $siswa = $this->getSiswa();
        $riwayats = HasilUjian::with(['ujian.mapel'])
            ->where('siswa_id', $siswa->id)
            ->where('status', 'Selesai')
            ->latest()
            ->get();

        return Inertia::render('Siswa/Nilai/Index', [
            'riwayats' => $riwayats
        ]);
    }
}
