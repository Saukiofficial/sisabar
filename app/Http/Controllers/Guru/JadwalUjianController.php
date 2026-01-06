<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\JadwalUjian;
use App\Models\Ujian;
use App\Models\Kelas;
use App\Models\Guru;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Str;

class JadwalUjianController extends Controller
{
    private function getGuru() {
        return Guru::where('user_id', Auth::id())->firstOrFail();
    }

    public function index()
    {
        $guru = $this->getGuru();

        $jadwals = JadwalUjian::with(['ujian', 'kelas'])
            ->where('guru_id', $guru->id)
            ->latest()
            ->get();

        return Inertia::render('Guru/ManajemenUlangan/Index', [
            'jadwals' => $jadwals,
            // Kirim daftar paket soal yang sudah status 'Terbit' (Siap diujikan)
            'paket_soals' => Ujian::where('guru_id', $guru->id)->where('status', 'Terbit')->get(),
            'kelas_list' => Kelas::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'ujian_id' => 'required|exists:ujians,id',
            'kelas_id' => 'required|exists:kelas,id',
            'nama_ujian' => 'required|string',
            'waktu_mulai' => 'required|date',
            'waktu_selesai' => 'required|date|after:waktu_mulai',
            'durasi_menit' => 'required|integer|min:1',
        ]);

        $guru = $this->getGuru();

        // Generate Token Random 5 Karakter
        $token = strtoupper(Str::random(5));

        JadwalUjian::create([
            'guru_id' => $guru->id,
            'ujian_id' => $request->ujian_id,
            'kelas_id' => $request->kelas_id,
            'nama_ujian' => $request->nama_ujian,
            'waktu_mulai' => $request->waktu_mulai,
            'waktu_selesai' => $request->waktu_selesai,
            'durasi_menit' => $request->durasi_menit,
            'token_ujian' => $token,
            'status' => 'Belum Mulai'
        ]);

        return redirect()->back()->with('message', 'Jadwal ujian berhasil dibuat. Token: ' . $token);
    }

    public function destroy($id)
    {
        $guru = $this->getGuru();
        JadwalUjian::where('id', $id)->where('guru_id', $guru->id)->delete();
        return redirect()->back()->with('message', 'Jadwal ujian dihapus.');
    }

    // Fitur Reset Token
    public function resetToken($id)
    {
        $guru = $this->getGuru();
        $jadwal = JadwalUjian::where('id', $id)->where('guru_id', $guru->id)->firstOrFail();

        $newToken = strtoupper(Str::random(5));
        $jadwal->update(['token_ujian' => $newToken]);

        return redirect()->back()->with('message', 'Token ujian diperbarui: ' . $newToken);
    }
}
