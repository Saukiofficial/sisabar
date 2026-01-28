<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\AbsensiGuru;
use Carbon\Carbon;
use Inertia\Inertia;

class AbsensiGuruController extends Controller
{
    public function index()
    {
        return Inertia::render('Guru/Absensi/Index', [
            'user' => Auth::user()
        ]);
    }

    public function store(Request $request)
    {
        // 1. Validasi Input (Hanya pastikan string dikirim, jangan cek exists ke DB dulu)
        $request->validate([
            'nip_or_username' => 'required|string',
        ]);

        $scannedValue = $request->nip_or_username;
        $now = Carbon::now('Asia/Jakarta');
        $today = $now->format('Y-m-d');

        // --- PERBAIKAN LOGIKA PENCARIAN (ANTI ERROR NIP) ---
        // Kita cari User, BUKAN Guru. Karena tabel gurus tidak punya NIP.

        // Cek 1: Cari berdasarkan USERNAME
        $user = User::where('username', $scannedValue)->first();

        // Cek 2: Jika username tidak ketemu, dan inputnya angka, coba cari ID User
        if (!$user && is_numeric($scannedValue)) {
            $user = User::find($scannedValue);
        }

        // Jika User Masih Tidak Ditemukan
        if (!$user) {
            return response()->json([
                'message' => 'Data tidak ditemukan! QR Code tidak valid.',
                'status' => 'error'
            ], 404);
        }

        // Cek 3: Pastikan User tersebut punya role Guru
        if (!$user->hasRole('Guru')) {
            return response()->json([
                'message' => 'QR Code valid, tapi ini bukan akun Guru!',
                'status' => 'error'
            ], 403);
        }

        // 2. Cek Apakah Sudah Absen Hari Ini?
        $sudahAbsen = AbsensiGuru::where('user_id', $user->id)
            ->whereDate('tanggal', $today)
            ->exists();

        if ($sudahAbsen) {
            return response()->json([
                'message' => 'Anda sudah melakukan absensi hari ini.',
                'guru' => $user->name,
                'waktu' => $now->format('H:i'),
                'status' => 'warning'
            ], 200);
        }

        // 3. Tentukan Status Kehadiran
        // Contoh aturan: Lewat jam 07:15 dianggap Terlambat
        $jamMasuk = $now->format('H:i:s');
        $statusKehadiran = $jamMasuk > '07:15:00' ? 'Terlambat' : 'Hadir';

        // 4. Simpan Data Absensi
        AbsensiGuru::create([
            'user_id' => $user->id,
            'tanggal' => $today,
            'waktu_masuk' => $jamMasuk,
            'status' => $statusKehadiran,
        ]);

        return response()->json([
            'message' => 'Absensi Berhasil! Selamat mengajar.',
            'guru' => $user->name,
            'waktu' => $jamMasuk,
            'status' => 'success'
        ], 200);
    }
}
