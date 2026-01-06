<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\BankSoal;
use App\Models\Guru;
use App\Models\Mapel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BankSoalController extends Controller
{
    // Helper: Ambil data Guru yang sedang login
    private function getGuru()
    {
        return Guru::where('user_id', Auth::id())->firstOrFail();
    }

    public function index()
    {
        $guru = $this->getGuru();

        // Ambil daftar file soal yang sudah diupload guru ini
        $files = BankSoal::with('mapel')
            ->where('guru_id', $guru->id)
            ->latest()
            ->get();

        return Inertia::render('Guru/BankSoal/Index', [
            'files' => $files,
            'mapels' => Mapel::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'mapel_id' => 'required|exists:mapels,id',
            'judul_soal' => 'required|string|max:255',
            'file_soal' => 'required|mimes:pdf,doc,docx|max:10240', // Max 10MB
        ], [
            'file_soal.mimes' => 'Format file harus PDF atau Word (doc, docx).',
            'file_soal.max' => 'Ukuran file maksimal 10MB.',
        ]);

        $guru = $this->getGuru();
        $file = $request->file('file_soal');

        // Simpan File ke Storage Public
        $path = $file->store('bank-soal-files', 'public');
        $size = round($file->getSize() / 1024) . ' KB'; // Hitung ukuran file (KB)
        $extension = $file->getClientOriginalExtension();

        BankSoal::create([
            'guru_id' => $guru->id,
            'mapel_id' => $request->mapel_id,
            'judul_soal' => $request->judul_soal,
            'file_soal' => $path,
            'tipe_file' => $extension,
            'ukuran_file' => $size
        ]);

        return redirect()->back()->with('message', 'Berkas soal berhasil diunggah.');
    }

    public function destroy($id)
    {
        $guru = $this->getGuru();
        $bankSoal = BankSoal::where('id', $id)->where('guru_id', $guru->id)->firstOrFail();

        // Hapus file fisik
        if (Storage::disk('public')->exists($bankSoal->file_soal)) {
            Storage::disk('public')->delete($bankSoal->file_soal);
        }

        $bankSoal->delete();

        return redirect()->back()->with('message', 'Berkas soal berhasil dihapus.');
    }
}
