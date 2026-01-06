<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\AbsensiMurid;
use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\Guru;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AbsensiMuridController extends Controller
{
    public function index(Request $request)
    {
        // Filter berdasarkan kelas yang dipilih
        $kelasId = $request->input('kelas_id');
        $siswas = [];

        if ($kelasId) {
            $siswas = Siswa::where('kelas_id', $kelasId)
                ->orderBy('nama')
                ->get();
        }

        return Inertia::render('Guru/Absensi/Index', [
            'kelas_list' => Kelas::all(),
            'siswas' => $siswas,
            'kelas_selected' => $kelasId
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'kelas_id' => 'required',
            'tanggal' => 'required|date',
            'absensi' => 'required|array', // Array data absensi dari frontend
            'absensi.*.siswa_id' => 'required',
            'absensi.*.status' => 'required|in:Hadir,Sakit,Izin,Alpha',
        ]);

        $guru = Guru::where('user_id', Auth::id())->first();

        foreach ($request->absensi as $absen) {
            // Update or Create (agar tidak double absen di hari sama & siswa sama)
            AbsensiMurid::updateOrCreate(
                [
                    'siswa_id' => $absen['siswa_id'],
                    'tanggal' => $request->tanggal,
                    'kelas_id' => $request->kelas_id
                ],
                [
                    'guru_id' => $guru->id,
                    'status' => $absen['status']
                ]
            );
        }

        return redirect()->back()->with('message', 'Absensi berhasil disimpan.');
    }
}
