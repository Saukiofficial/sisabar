<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
// [PERBAIKAN] Gunakan model yang benar
use App\Models\AbsensiMurid;
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

        // Ambil Roles agar Sidebar muncul
        $roles = $user->roles->pluck('name');

        // [PERBAIKAN] Gunakan AbsensiMurid
        $history = AbsensiMurid::where('user_id', $user->id)
            ->whereIn('jenis', ['Sakit', 'Izin', 'Lainnya'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Siswa/PengajuanIzin', [
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

        // [PERBAIKAN] Gunakan AbsensiMurid
        AbsensiMurid::create([
            'user_id' => $user->id,
            'jenis' => $request->jenis,
            'tanggal_mulai' => $request->tanggal_mulai,
            'tanggal_selesai' => $request->tanggal_selesai,
            'keterangan' => $request->keterangan,
            'status' => 'Menunggu Verifikasi',
            // Isi kolom 'tanggal' dengan hari pertama izin agar kompatibel dengan rekap harian
            'tanggal' => $request->tanggal_mulai,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        return redirect()->back()->with('success', 'Pengajuan berhasil dikirim.');
    }
}
