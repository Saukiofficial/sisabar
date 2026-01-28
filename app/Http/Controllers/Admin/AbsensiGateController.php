<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Siswa;
use App\Models\Guru;
use App\Models\Absensi;
use App\Models\User; // Pastikan Model User di-import
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class AbsensiGateController extends Controller
{
    // =========================================================================
    // FITUR 1: SCANNER GERBANG (KAMERA)
    // =========================================================================
    public function index()
    {
        return Inertia::render('Admin/Absensi/OrDisplay');
    }

    public function store(Request $request)
    {
        // 1. Validasi Input
        $request->validate(['qr_code' => 'required']);
        $kode = trim($request->qr_code); // Bersihkan spasi

        // DEBUG: Catat apa yang discan
        Log::info("SCANNER MENERIMA DATA: " . $kode);

        // --- PENGECEKAN KHUSUS ERROR "NO NIP" ---
        // Ini menangkap kasus QR Code yang salah cetak karena NIP kosong
        if (strtoupper($kode) === 'NO NIP' || strtoupper($kode) === 'NONIP') {
            return response()->json([
                'status' => 'error',
                'message' => 'QR Code Salah Cetak! Isinya "No NIP". Harap cetak ulang QR menggunakan Username atau Nama.',
                'debug_code' => $kode
            ], 404);
        }

        $hariIni = Carbon::today();
        $jamSekarang = Carbon::now('Asia/Jakarta');

        $userType = '';
        $dataUser = null;
        $userId = null;

        // ---------------------------------------------------------
        // TAHAP 1: CEK SISWA (Prioritas NIS)
        // ---------------------------------------------------------
        $siswa = Siswa::with(['user', 'kelas'])
                    ->where('nis', $kode)
                    ->orWhereHas('user', function($q) use ($kode) {
                        $q->where('username', $kode);
                    })
                    ->first();

        if ($siswa) {
            $userType = 'Siswa';
            $dataUser = $siswa;
            $userId = $siswa->user_id;
            $infoTambahan = $siswa->kelas ? $siswa->kelas->nama_kelas : 'Tanpa Kelas';
        }

        // ---------------------------------------------------------
        // TAHAP 2: CEK GURU (Logika Multi-Fallback Lengkap)
        // ---------------------------------------------------------
        else {
            // Cari User berdasarkan berbagai kemungkinan kolom
            $userQuery = User::where('username', $kode)
                             ->orWhere('email', $kode)
                             ->orWhere('name', $kode); // [BARU] Cari berdasarkan Nama (misal: "Pak Fhadol, S.Pd")

            // Jika kode angka, cari ID
            if (is_numeric($kode)) {
                $userQuery->orWhere('id', $kode);
            }

            $userFound = $userQuery->first();

            // Validasi Role Guru
            if ($userFound && $userFound->hasRole('Guru')) {
                $guru = Guru::where('user_id', $userFound->id)->first();

                $userType = 'Guru';
                $dataUser = $guru ? $guru : (object) ['user' => $userFound];

                if (!isset($dataUser->user)) {
                    $dataUser->user = $userFound;
                }

                $userId = $userFound->id;
                $infoTambahan = 'Guru Pengajar';
            }
        }

        // ---------------------------------------------------------
        // TAHAP 3: VALIDASI HASIL PENCARIAN
        // ---------------------------------------------------------
        if (!$userId) {
            Log::warning("GAGAL MENEMUKAN USER: " . $kode);
            return response()->json([
                'status' => 'error',
                'message' => 'QR Code tidak terdaftar di sistem!',
                'debug_code' => $kode
            ], 404);
        }

        Log::info("USER DITEMUKAN: " . ($dataUser->user->name ?? 'User') . " ($userType)");

        // ---------------------------------------------------------
        // TAHAP 4: PROSES ABSENSI
        // ---------------------------------------------------------
        $absensi = Absensi::where('user_id', $userId)
            ->whereDate('tanggal', $hariIni)
            ->first();

        // [SKENARIO A: CHECK IN]
        if (!$absensi) {
            $batasMasuk = Carbon::createFromTime(7, 15, 0, 'Asia/Jakarta');
            $status = $jamSekarang->greaterThan($batasMasuk) ? 'Terlambat' : 'Hadir';
            $keterangan = $status == 'Terlambat' ? 'Terlambat (' . $jamSekarang->format('H:i') . ')' : 'Tepat Waktu';

            Absensi::create([
                'user_id' => $userId,
                'tanggal' => $hariIni,
                'waktu_masuk' => $jamSekarang->toTimeString(),
                'status' => $status,
                'keterangan' => $keterangan
            ]);

            return response()->json([
                'status' => 'success',
                'mode' => 'MASUK',
                'message' => 'Selamat Datang, ' . $userType,
                'siswa' => [
                    'nama' => $dataUser->user->name ?? 'User',
                    'kelas' => $infoTambahan,
                    'jam' => $jamSekarang->format('H:i:s'),
                ]
            ]);
        }

        // [SKENARIO B: CHECK OUT]
        elseif ($absensi->waktu_pulang == null) {
            $waktuMasuk = Carbon::parse($absensi->waktu_masuk);
            if ($jamSekarang->diffInMinutes($waktuMasuk) < 1) {
                return response()->json([
                    'status' => 'warning',
                    'message' => 'Baru saja absen masuk. Tunggu sebentar.',
                    'siswa' => [
                        'nama' => $dataUser->user->name ?? 'User',
                        'kelas' => $infoTambahan,
                        'jam' => '-',
                    ]
                ]);
            }

            $absensi->update(['waktu_pulang' => $jamSekarang->toTimeString()]);

            return response()->json([
                'status' => 'success',
                'mode' => 'PULANG',
                'message' => 'Hati-hati di jalan, ' . $userType,
                'siswa' => [
                    'nama' => $dataUser->user->name ?? 'User',
                    'kelas' => $infoTambahan,
                    'jam' => $jamSekarang->format('H:i:s'),
                ]
            ]);
        }

        // [SKENARIO C: SELESAI]
        else {
            return response()->json([
                'status' => 'warning',
                'message' => 'Sudah absen pulang hari ini.',
                'siswa' => [
                    'nama' => $dataUser->user->name ?? 'User',
                    'kelas' => $infoTambahan,
                    'jam' => Carbon::parse($absensi->waktu_pulang)->format('H:i:s'),
                ]
            ]);
        }
    }

    // =========================================================================
    // FITUR 2: GENERATOR QR
    // =========================================================================
    public function generateQr()
    {
        $siswas = Siswa::with(['user', 'kelas'])->get();
        $gurus = Guru::with('user')->get();

        return Inertia::render('Admin/Absensi/GenerateQr', [
            'siswas' => $siswas,
            'gurus' => $gurus
        ]);
    }
}
