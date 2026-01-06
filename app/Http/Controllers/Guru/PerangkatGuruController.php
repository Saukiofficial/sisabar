<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\PerangkatPembelajaran;
use App\Models\Guru;
use App\Models\Mapel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PerangkatGuruController extends Controller
{
    private function getGuru() {
        return Guru::where('user_id', Auth::id())->firstOrFail();
    }

    public function index()
    {
        $guru = $this->getGuru();

        $perangkats = PerangkatPembelajaran::with('mapel')
            ->where('guru_id', $guru->id)
            ->latest()
            ->get();

        return Inertia::render('Guru/Perangkat/Index', [
            'perangkats' => $perangkats,
            'mapels' => Mapel::all(),

            // --- UPDATE DAFTAR JENIS DOKUMEN ---
            // Sesuaikan dengan item yang ada di Checklist PDF agar Guru tidak bingung
            'jenis_list' => [
                'Perangkat Pembelajaran Lengkap (Gabungan)', // Opsi utama jika upload 1 file besar
                'Modul Ajar / RPP',
                'Alur Tujuan Pembelajaran (ATP)',
                'Program Tahunan (Prota)',
                'Program Semester (Prosem)',
                'Bahan Ajar / Materi',
                'Instrumen Asesmen',
                'Lainnya'
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'mapel_id' => 'required|exists:mapels,id',
            'jenis_perangkat' => 'required|string',
            'judul' => 'required|string|max:255',
            'file_file' => 'required|file|mimes:pdf,doc,docx,zip,rar|max:20480', // Tambah support ZIP & Max 20MB
            'keterangan' => 'nullable|string'
        ]);

        $guru = $this->getGuru();

        $path = $request->file('file_file')->store('perangkat_pembelajaran', 'public');

        PerangkatPembelajaran::create([
            'guru_id' => $guru->id,
            'mapel_id' => $request->mapel_id,
            'jenis_perangkat' => $request->jenis_perangkat,
            'judul' => $request->judul,
            'file_path' => $path,
            'keterangan' => $request->keterangan,
            'status' => 'Menunggu',
        ]);

        return redirect()->back()->with('message', 'Berkas berhasil diupload! Menunggu validasi Kepala Sekolah.');
    }

    public function destroy($id)
    {
        $guru = $this->getGuru();

        $perangkat = PerangkatPembelajaran::where('id', $id)
            ->where('guru_id', $guru->id)
            ->firstOrFail();

        if (Storage::disk('public')->exists($perangkat->file_path)) {
            Storage::disk('public')->delete($perangkat->file_path);
        }

        $perangkat->delete();

        return redirect()->back()->with('message', 'Berkas berhasil dihapus.');
    }

    public function cetakLembarPengesahan($id)
    {
        $guru = $this->getGuru();

        $perangkat = PerangkatPembelajaran::with(['guru.user', 'mapel'])
            ->where('id', $id)
            ->where('guru_id', $guru->id)
            ->where('status', 'Valid')
            ->firstOrFail();

        // Data dummy Kepsek (Bisa diganti ambil dari DB user role kepsek)
        $kepsek = [
            'nama' => 'Dr. Kepala Sekolah, M.Pd',
            'nip' => '19800101 200001 1 001',
            'ttd_path' => asset('img/ttd_kepsek_placeholder.png')
        ];

        return view('print.lembar_pengesahan', compact('perangkat', 'kepsek'));
    }
}
