<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Absensi;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class AdminIzinController extends Controller
{
    /**
     * Menampilkan daftar pengajuan izin siswa yang perlu diverifikasi
     */
    public function index()
    {
        // Ambil data Absensi yang jenisnya 'Sakit', 'Izin', atau 'Lainnya'
        // Kita juga memuat relasi ke User -> Siswa -> Kelas untuk menampilkan identitas
        $pengajuans = Absensi::with(['user.siswa.kelas'])
            ->whereIn('jenis', ['Sakit', 'Izin', 'Lainnya'])
            ->orderBy('created_at', 'desc') // Yang terbaru di atas
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'user' => $item->user, // Data user (nama, dll)
                    'jenis' => $item->jenis,
                    'tanggal_mulai' => $item->tanggal_mulai,
                    'tanggal_selesai' => $item->tanggal_selesai,
                    'keterangan' => $item->keterangan,
                    'status' => $item->status, // Menunggu Verifikasi, Disetujui, Ditolak
                    'created_at' => $item->created_at->format('d M Y H:i'),
                ];
            });

        return Inertia::render('Admin/VerifikasiIzin', [
            'pengajuans' => $pengajuans
        ]);
    }

    /**
     * Memproses persetujuan atau penolakan izin
     * URL: /admin/verifikasi-izin/{id}/{status}
     */
    public function verifikasi($id, $status)
    {
        // Validasi status hanya boleh 'Disetujui' atau 'Ditolak' untuk keamanan
        if (!in_array($status, ['Disetujui', 'Ditolak'])) {
            return Redirect::back()->with('error', 'Status tidak valid.');
        }

        $pengajuan = Absensi::findOrFail($id);

        // Update status di database
        $pengajuan->update([
            'status' => $status
        ]);

        // Kirim pesan sukses
        $pesan = $status === 'Disetujui' ? 'Pengajuan berhasil disetujui.' : 'Pengajuan berhasil ditolak.';

        return Redirect::back()->with('success', $pesan);
    }
}
