<?php

namespace App\Http\Controllers\Kepsek;

use App\Http\Controllers\Controller;
use App\Models\PerangkatPembelajaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class PerangkatKepsekController extends Controller
{
    /**
     * Menampilkan halaman daftar perangkat guru untuk disupervisi.
     */
    public function index(Request $request)
    {
        // Query untuk mengambil perangkat dengan relasi Guru & Mapel
        // Logic: Tampilkan yang statusnya 'Menunggu' di paling atas agar segera diperiksa.
        $query = PerangkatPembelajaran::with(['guru.user', 'mapel'])
            ->orderByRaw("FIELD(status, 'Menunggu', 'Revisi', 'Valid')")
            ->latest();

        // Fitur Pencarian (Nama Guru atau Judul Dokumen)
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->whereHas('guru.user', function($subQ) use ($search) {
                    $subQ->where('name', 'like', '%' . $search . '%');
                })->orWhere('judul', 'like', '%' . $search . '%');
            });
        }

        return Inertia::render('Kepsek/Supervisi/Index', [
            'perangkats' => $query->paginate(10)->withQueryString(),
            'filters' => $request->only(['search'])
        ]);
    }

    /**
     * Memproses Validasi atau Revisi dari Kepala Sekolah.
     * Termasuk menyimpan checklist kelengkapan.
     */
    public function update(Request $request, $id)
    {
        // Validasi input dari form modal
        $request->validate([
            'status' => 'required|in:Valid,Revisi',
            'catatan_revisi' => 'required_if:status,Revisi', // Wajib isi catatan jika status Revisi
            'checklist' => 'nullable|array' // Data checklist dikirim sebagai array
        ]);

        $perangkat = PerangkatPembelajaran::findOrFail($id);

        // Siapkan data yang akan diupdate
        $dataUpdate = [
            'status' => $request->status,
            // Jika Valid, hapus catatan revisi lama. Jika Revisi, simpan catatan baru.
            'catatan_revisi' => ($request->status == 'Valid') ? null : $request->catatan_revisi,
        ];

        // LOGIC KHUSUS JIKA VALID
        if ($request->status == 'Valid') {
            $dataUpdate['tanggal_validasi'] = Carbon::now();
            $dataUpdate['nama_validator'] = Auth::user()->name; // Nama Kepsek

            // Simpan Checklist ke database (kolom JSON)
            // Pastikan di Model PerangkatPembelajaran sudah ada: protected $casts = ['checklist' => 'array'];
            $dataUpdate['checklist'] = $request->checklist;

        } else {
            // LOGIC JIKA REVISI (RESET)
            $dataUpdate['tanggal_validasi'] = null;
            $dataUpdate['nama_validator'] = null;
            $dataUpdate['checklist'] = null; // Reset checklist jika dikembalikan untuk revisi
        }

        // Eksekusi update ke database
        $perangkat->update($dataUpdate);

        // Pesan notifikasi
        $msg = ($request->status == 'Valid')
            ? 'Dokumen berhasil divalidasi & checklist tersimpan.'
            : 'Dokumen dikembalikan ke guru untuk direvisi.';

        return redirect()->back()->with('message', $msg);
    }
}
