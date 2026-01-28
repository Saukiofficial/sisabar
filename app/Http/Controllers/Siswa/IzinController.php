<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Absensi;
use Carbon\Carbon;

class IzinController extends Controller
{
    /**
     * Menampilkan halaman formulir dan riwayat izin
     */
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // [PENTING] Ambil Roles agar Sidebar AuthenticatedLayout muncul
        // Kita gunakan pluck('name') karena logic di AuthenticatedLayout mengecek array string
        $roles = $user->roles->pluck('name');

        // Ambil riwayat pengajuan izin milik siswa
        $history = Absensi::where('user_id', $user->id)
            ->whereIn('jenis', ['Sakit', 'Izin', 'Lainnya'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Siswa/PengajuanIzin', [
            // Kirim struktur auth lengkap dengan roles agar Sidebar tidak hilang
            'auth' => [
                'user' => $user,
                'roles' => $roles
            ],
            'history' => $history
        ]);
    }

    /**
     * Menyimpan pengajuan izin
     */
    public function store(Request $request)
    {
        $request->validate([
            'jenis' => 'required',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'keterangan' => 'required|string',
        ]);

        $user = Auth::user();
        $now = Carbon::now('Asia/Jakarta');

        Absensi::create([
            'user_id' => $user->id,
            'jenis' => $request->jenis,
            'tanggal_mulai' => $request->tanggal_mulai,
            'tanggal_selesai' => $request->tanggal_selesai,
            'keterangan' => $request->keterangan,
            'status' => 'Menunggu Verifikasi',
            // Kita isi kolom 'tanggal' dengan hari ini agar kompatibel dengan struktur tabel lama
            'tanggal' => $now->format('Y-m-d'),
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        return redirect()->back()->with('success', 'Pengajuan berhasil dikirim.');
    }
}
