<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\Jurnal;
use App\Models\Kelas;
use App\Models\Mapel;
use App\Models\Guru;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class JurnalController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $guru = Guru::where('user_id', $user->id)->first();

        if (!$guru) {
            return redirect()->route('dashboard');
        }

        $jurnals = Jurnal::with(['kelas', 'mapel'])
            ->where('guru_id', $guru->id)
            ->latest()
            ->get();

        return Inertia::render('Guru/Jurnal/Index', [
            'jurnals' => $jurnals,
            'kelas' => Kelas::all(),
            'mapels' => Mapel::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'kelas_id' => 'required',
            'mapel_id' => 'required',
            'materi' => 'required',
            // PERBAIKAN DI SINI: Ganti 'image' menjadi 'mimes:jpg,jpeg,png,pdf,doc,docx'
            'dokumentasi' => 'nullable|mimes:jpg,jpeg,png,pdf,doc,docx|max:5120', // Max 5MB
        ], [
            // Custom Error Messages (Opsional, agar lebih jelas)
            'dokumentasi.mimes' => 'Format file harus berupa Foto (JPG/PNG) atau Dokumen (PDF).',
            'dokumentasi.max' => 'Ukuran file maksimal 5MB.',
        ]);

        $guru = Guru::where('user_id', Auth::id())->first();
        $path = null;

        if ($request->hasFile('dokumentasi')) {
            $path = $request->file('dokumentasi')->store('jurnal-docs', 'public');
        }

        Jurnal::create([
            'guru_id' => $guru->id,
            'tanggal' => now(),
            'kelas_id' => $request->kelas_id,
            'mapel_id' => $request->mapel_id,
            'materi' => $request->materi,
            'catatan' => $request->catatan,
            'dokumentasi' => $path,
        ]);

        return redirect()->back()->with('message', 'Jurnal berhasil disimpan!');
    }
}
