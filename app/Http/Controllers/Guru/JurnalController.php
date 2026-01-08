<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\Jurnal;
use App\Models\Kelas;
use App\Models\Mapel;
use App\Models\Guru;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class JurnalController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $guru = Guru::where('user_id', $user->id)->firstOrFail();

        // Load jurnal dengan relasi lengkap
        $jurnals = Jurnal::with(['kelas', 'mapel'])
            ->where('guru_id', $guru->id)
            ->latest()
            ->paginate(10); // Gunakan pagination agar halaman tidak berat

        return Inertia::render('Guru/Jurnal/Index', [
            'jurnals' => $jurnals,
            'kelas' => Kelas::all(),
            'mapels' => Mapel::all(),
        ]);
    }

    public function store(Request $request)
    {
        // Validasi input yang lebih lengkap sesuai form HTML
        $data = $request->validate([
            // Info Umum
            'kelas_id' => 'required',
            'mapel_id' => 'required',
            'tanggal' => 'required|date',
            'materi' => 'required|string', // Materi Pokok
            'sub_materi' => 'nullable|string',
            'semester' => 'required|string',
            'pertemuan_ke' => 'required|integer',
            'jam_pelajaran' => 'nullable|string',
            'ki_kd' => 'nullable|string',

            // Isi Jurnal
            'tujuan_pembelajaran' => 'nullable|string',
            'penjelasan_materi' => 'nullable|string',
            'kegiatan_pembelajaran' => 'nullable|string',
            'media_belajar' => 'nullable|string',
            'respon_siswa' => 'nullable|string',
            'jenis_penilaian' => 'nullable|string',

            // Kehadiran
            'jml_hadir' => 'required|integer|min:0',
            'jml_izin' => 'required|integer|min:0',
            'jml_sakit' => 'required|integer|min:0',
            'jml_alpa' => 'required|integer|min:0',

            // Evaluasi
            'tugas_pr' => 'nullable|string',
            'evaluasi_hasil' => 'nullable|string',
            'permasalahan_kbm' => 'nullable|string',
            'catatan' => 'nullable|string',

            // File
            'dokumentasi' => 'nullable|mimes:jpg,jpeg,png,pdf,doc,docx|max:5120',
        ]);

        $guru = Guru::where('user_id', Auth::id())->first();

        // Handle Upload File
        $path = null;
        if ($request->hasFile('dokumentasi')) {
            $path = $request->file('dokumentasi')->store('jurnal-docs', 'public');
        }

        // Simpan Data
        Jurnal::create(array_merge($data, [
            'guru_id' => $guru->id,
            'dokumentasi' => $path
        ]));

        return redirect()->back()->with('message', 'Entri jurnal lengkap berhasil disimpan!');
    }

    public function destroy($id)
    {
        $jurnal = Jurnal::findOrFail($id);
        // Hapus file jika ada
        if ($jurnal->dokumentasi && file_exists(public_path('storage/'.$jurnal->dokumentasi))) {
            unlink(public_path('storage/'.$jurnal->dokumentasi));
        }
        $jurnal->delete();

        return redirect()->back()->with('message', 'Jurnal berhasil dihapus.');
    }
}
