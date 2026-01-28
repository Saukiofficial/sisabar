<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// GANTI MODEL
use App\Models\AbsensiMurid;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class AdminIzinController extends Controller
{
    /**
     * Menampilkan daftar pengajuan izin siswa yang perlu diverifikasi
     */
    public function index()
    {
        // Gunakan AbsensiMurid
        // Load relasi user -> siswa -> kelas untuk detail info
        // Pastikan model AbsensiMurid punya relasi 'user' atau 'siswa'
        // Jika AbsensiMurid punya 'user_id', kita bisa load 'user.siswa.kelas'
        $pengajuans = AbsensiMurid::with(['user.siswa.kelas'])
            ->whereIn('jenis', ['Sakit', 'Izin', 'Lainnya'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'user' => $item->user,
                    'jenis' => $item->jenis,
                    'tanggal_mulai' => $item->tanggal_mulai,
                    'tanggal_selesai' => $item->tanggal_selesai,
                    'keterangan' => $item->keterangan,
                    'status' => $item->status,
                    'created_at' => $item->created_at->format('d M Y H:i'),
                ];
            });

        return Inertia::render('Admin/VerifikasiIzin', [
            'pengajuans' => $pengajuans
        ]);
    }

    public function verifikasi($id, $status)
    {
        if (!in_array($status, ['Disetujui', 'Ditolak'])) {
            return Redirect::back()->with('error', 'Status tidak valid.');
        }

        // Gunakan AbsensiMurid
        $pengajuan = AbsensiMurid::findOrFail($id);

        $pengajuan->update([
            'status' => $status
        ]);

        $pesan = $status === 'Disetujui' ? 'Pengajuan berhasil disetujui.' : 'Pengajuan berhasil ditolak.';

        return Redirect::back()->with('success', $pesan);
    }
}
