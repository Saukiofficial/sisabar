<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Jurnal;
use App\Models\Guru;
use App\Models\Siswa;
use App\Models\AbsensiMurid;
use App\Models\AbsensiGuru;
use Carbon\Carbon;

class GuruController extends Controller
{
    // Helper: Get Current Guru
    private function getGuru()
    {
        return Guru::where('user_id', Auth::id())->first();
    }

    // --- JURNAL ---

    // GET /api/guru/jurnals
    public function jurnalList()
    {
        $guru = $this->getGuru();
        if(!$guru) return response()->json(['message' => 'Unauthorized'], 403);

        $jurnals = Jurnal::with(['kelas', 'mapel'])
            ->where('guru_id', $guru->id)
            ->latest()
            ->paginate(10);

        return response()->json(['success' => true, 'data' => $jurnals]);
    }

    // POST /api/guru/jurnals
    public function jurnalStore(Request $request)
    {
        $request->validate([
            'kelas_id' => 'required',
            'mapel_id' => 'required',
            'materi' => 'required',
        ]);

        $guru = $this->getGuru();

        // Handle upload foto jika ada
        $path = null;
        if ($request->hasFile('dokumentasi')) {
            $path = $request->file('dokumentasi')->store('jurnal-docs', 'public');
        }

        $jurnal = Jurnal::create([
            'guru_id' => $guru->id,
            'tanggal' => now(),
            'kelas_id' => $request->kelas_id,
            'mapel_id' => $request->mapel_id,
            'materi' => $request->materi,
            'catatan' => $request->catatan,
            'dokumentasi' => $path,
        ]);

        return response()->json(['success' => true, 'message' => 'Jurnal saved', 'data' => $jurnal]);
    }

    // --- ABSENSI SISWA ---

    // GET /api/guru/siswa-by-kelas/{id}
    public function getSiswa($kelas_id)
    {
        $siswas = Siswa::where('kelas_id', $kelas_id)->orderBy('nama')->get();
        return response()->json(['success' => true, 'data' => $siswas]);
    }

    // POST /api/guru/absensi-siswa
    public function storeAbsensiSiswa(Request $request)
    {
        $request->validate([
            'kelas_id' => 'required',
            'absensi' => 'required|array', // [{siswa_id: 1, status: 'Hadir'}, ...]
        ]);

        $guru = $this->getGuru();
        $tanggal = date('Y-m-d');

        foreach ($request->absensi as $absen) {
            AbsensiMurid::updateOrCreate(
                ['siswa_id' => $absen['siswa_id'], 'tanggal' => $tanggal, 'kelas_id' => $request->kelas_id],
                ['guru_id' => $guru->id, 'status' => $absen['status']]
            );
        }

        return response()->json(['success' => true, 'message' => 'Absensi siswa berhasil']);
    }

    // --- SCAN QR (ABSENSI DIRI SENDIRI) ---

    // POST /api/qr/scan
    public function scanQr(Request $request)
    {
        $request->validate(['qr_token' => 'required']);

        $validToken = 'ABSEN-' . date('Y-m-d') . '-SEKOLAH-ID';

        if ($request->qr_token !== $validToken) {
            return response()->json(['success' => false, 'message' => 'QR Invalid/Expired'], 400);
        }

        $guru = $this->getGuru();
        $today = date('Y-m-d');
        $now = date('H:i:s');

        $absen = AbsensiGuru::where('guru_id', $guru->id)->where('tanggal', $today)->first();

        if (!$absen) {
            AbsensiGuru::create([
                'guru_id' => $guru->id,
                'tanggal' => $today,
                'jam_masuk' => $now,
                'device_info' => $request->header('User-Agent'),
                'lokasi' => $request->lokasi
            ]);
            return response()->json(['success' => true, 'message' => 'Check-in Berhasil']);
        } else {
            if ($absen->jam_pulang == null) {
                $absen->update(['jam_pulang' => $now]);
                return response()->json(['success' => true, 'message' => 'Check-out Berhasil']);
            }
            return response()->json(['success' => false, 'message' => 'Sudah absen lengkap hari ini']);
        }
    }
}
