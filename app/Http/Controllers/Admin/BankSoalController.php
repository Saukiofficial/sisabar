<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BankSoal;
use App\Models\Guru;
use App\Models\Mapel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BankSoalController extends Controller
{
    public function index(Request $request)
    {
        // Query Dasar: Ambil data Bank Soal beserta relasi Guru dan Mapel
        $query = BankSoal::with(['guru.user', 'mapel'])
            ->latest(); // Urutkan dari yang terbaru

        // 1. Filter by Mapel (jika ada input mapel_id)
        if ($request->has('mapel_id') && $request->mapel_id != '') {
            $query->where('mapel_id', $request->mapel_id);
        }

        // 2. Filter by Guru (jika ada input guru_id)
        if ($request->has('guru_id') && $request->guru_id != '') {
            $query->where('guru_id', $request->guru_id);
        }

        // 3. Search by Judul Soal (jika ada input search)
        if ($request->has('search') && $request->search != '') {
            $query->where('judul_soal', 'like', '%' . $request->search . '%');
        }

        return Inertia::render('Admin/BankSoal/Index', [
            // Kirim data files dengan pagination (10 per halaman)
            'files' => $query->paginate(10)->withQueryString(),

            // Kirim data Master untuk dropdown filter
            'mapels' => Mapel::all(),
            'gurus' => Guru::with('user')->get(),

            // Kirim state filter saat ini agar tidak hilang saat reload
            'filters' => $request->only(['mapel_id', 'guru_id', 'search'])
        ]);
    }

    // Fitur: Admin menghapus file soal (misal karena salah upload atau konten tidak pantas)
    public function destroy($id)
    {
        $bankSoal = BankSoal::findOrFail($id);

        // Hapus file fisik dari storage (folder public/bank-soal-files)
        if (Storage::disk('public')->exists($bankSoal->file_soal)) {
            Storage::disk('public')->delete($bankSoal->file_soal);
        }

        // Hapus data dari database
        $bankSoal->delete();

        return redirect()->back()->with('message', 'Berkas soal berhasil dihapus oleh Admin.');
    }
}
