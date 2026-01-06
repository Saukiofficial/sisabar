<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\Ujian;
use App\Models\UjianSoal;
use App\Models\Guru;
use App\Models\Kelas;
use App\Models\Mapel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UjianController extends Controller
{
    // Helper: Ambil data guru yang sedang login
    private function getGuru() {
        return Guru::where('user_id', Auth::id())->firstOrFail();
    }

    // 1. HALAMAN UTAMA (DAFTAR UJIAN)
    public function index()
    {
        $guru = $this->getGuru();

        // Ambil ujian milik guru ini, load relasi mapel & kelas, hitung jumlah soal
        $ujians = Ujian::with(['mapel', 'kelas'])
            ->withCount('soals')
            ->where('guru_id', $guru->id)
            ->latest()
            ->get();

        return Inertia::render('Guru/ManajemenSoal/Index', [
            'ujians' => $ujians,
            'mapels' => Mapel::all(),
            'kelas_list' => Kelas::all()
        ]);
    }

    // 2. SIMPAN PAKET UJIAN BARU (HEADER)
    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required',
            'mapel_id' => 'required',
            'kelas_id' => 'required',
            'jenis_soal' => 'required|in:Pilihan Ganda,Uraian,Campuran',
            'tanggal_ujian' => 'required|date',
            'durasi_menit' => 'required|numeric',
            'status' => 'required|in:Draft,Terbit'
        ]);

        $guru = $this->getGuru();

        Ujian::create([
            'guru_id' => $guru->id,
            'mapel_id' => $request->mapel_id,
            'kelas_id' => $request->kelas_id,
            'judul' => $request->judul,
            'jenis_soal' => $request->jenis_soal,
            'tanggal_ujian' => $request->tanggal_ujian,
            'durasi_menit' => $request->durasi_menit,
            'status' => $request->status,
        ]);

        return redirect()->back()->with('message', 'Paket ujian berhasil dibuat. Silakan kelola soal.');
    }

    // 3. UPDATE STATUS UJIAN (PUBLISH/DRAFT)
    public function update(Request $request, $id)
    {
        $guru = $this->getGuru();

        // Pastikan ujian ini milik guru yang login
        $ujian = Ujian::where('id', $id)->where('guru_id', $guru->id)->firstOrFail();

        $request->validate([
            'status' => 'required|in:Draft,Terbit',
        ]);

        $ujian->update([
            'status' => $request->status
        ]);

        return redirect()->back()->with('message', 'Status ujian berhasil diperbarui menjadi ' . $request->status);
    }

    // 4. HALAMAN EDIT SOAL (DETAIL UJIAN)
    public function edit($id)
    {
        $guru = $this->getGuru();
        $ujian = Ujian::with('soals') // Load soal-soal di dalamnya
            ->where('id', $id)
            ->where('guru_id', $guru->id)
            ->firstOrFail();

        return Inertia::render('Guru/ManajemenSoal/Edit', [
            'ujian' => $ujian,
            'soals' => $ujian->soals
        ]);
    }

    // 5. HAPUS PAKET UJIAN
    public function destroy($id)
    {
        $guru = $this->getGuru();
        // Hapus ujian milik guru tersebut
        Ujian::where('id', $id)->where('guru_id', $guru->id)->delete();

        // PERBAIKAN 1: Redirect ke halaman Index, BUKAN back()
        // Ini mencegah error "id on null" saat menghapus paket ujian dari halaman edit
        return redirect()->route('manajemen-soal.index')->with('message', 'Paket ujian berhasil dihapus.');
    }

    // --- FITUR BUTIR SOAL ---

    // 6. SIMPAN BUTIR SOAL BARU
    public function storeSoal(Request $request, $ujian_id)
    {
        $request->validate([
            'tipe' => 'required|in:Pilihan Ganda,Uraian',
            'pertanyaan' => 'required',
            'bobot' => 'required|numeric',
            // Validasi Opsi jika PG
            'opsi_a' => 'required_if:tipe,Pilihan Ganda',
            'opsi_b' => 'required_if:tipe,Pilihan Ganda',
            'kunci_jawaban' => 'required',
        ]);

        // Cek kepemilikan ujian dulu biar aman
        $guru = $this->getGuru();
        $ujian = Ujian::where('id', $ujian_id)->where('guru_id', $guru->id)->firstOrFail();

        UjianSoal::create([
            'ujian_id' => $ujian->id,
            'tipe' => $request->tipe,
            'pertanyaan' => $request->pertanyaan,
            'opsi_a' => $request->opsi_a,
            'opsi_b' => $request->opsi_b,
            'opsi_c' => $request->opsi_c,
            'opsi_d' => $request->opsi_d,
            'opsi_e' => $request->opsi_e,
            'kunci_jawaban' => $request->kunci_jawaban,
            'bobot' => $request->bobot,
        ]);

        return redirect()->back()->with('message', 'Butir soal berhasil ditambahkan.');
    }

    // 7. HAPUS BUTIR SOAL
    public function destroySoal($id)
    {
        // PERBAIKAN 2: Gunakan helper $this->getGuru() agar lebih aman
        // Kode lama "Auth::user()->guru->id" bisa error jika relasi guru null
        $guru = $this->getGuru();

        // Cari soal dan pastikan milik guru yg login (via relasi ujian)
        $soal = UjianSoal::whereHas('ujian', function($q) use ($guru) {
            $q->where('guru_id', $guru->id);
        })->findOrFail($id);

        $soal->delete();

        return redirect()->back()->with('message', 'Soal berhasil dihapus.');
    }
}
