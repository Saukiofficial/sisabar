<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Jadwal;
use App\Models\Kelas;
use App\Models\Mapel;
use App\Models\Guru;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JadwalController extends Controller
{
    public function index(Request $request)
    {
        $query = Jadwal::with(['kelas', 'mapel', 'guru.user'])
            ->orderByRaw("FIELD(hari, 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu')")
            ->orderBy('jam_mulai');

        if ($request->has('kelas_id') && $request->kelas_id != '') {
            $query->where('kelas_id', $request->kelas_id);
        }

        return Inertia::render('Admin/Jadwal/Index', [
            'jadwals' => $query->paginate(10)->withQueryString(),
            'kelas' => Kelas::all(),
            'mapels' => Mapel::all(),
            'gurus' => Guru::with('user')->where('status_aktif', true)->get(),
            'filters' => $request->only(['kelas_id'])
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'hari' => 'required',
            'kelas_id' => 'required',
            'mapel_id' => 'required',
            'guru_id' => 'required',
            'jam_mulai' => 'required',
            'jam_selesai' => 'required',
        ]);

        Jadwal::create($request->all());

        return redirect()->back()->with('message', 'Jadwal berhasil ditambahkan.');
    }

    // --- FUNGSI UPDATE (BARU) ---
    public function update(Request $request, Jadwal $jadwal)
    {
        $request->validate([
            'hari' => 'required',
            'kelas_id' => 'required',
            'mapel_id' => 'required',
            'guru_id' => 'required',
            'jam_mulai' => 'required',
            'jam_selesai' => 'required',
        ]);

        $jadwal->update($request->all());

        return redirect()->back()->with('message', 'Jadwal berhasil diperbarui.');
    }

    public function destroy(Jadwal $jadwal)
    {
        $jadwal->delete();
        return redirect()->back()->with('message', 'Jadwal berhasil dihapus.');
    }
}
