<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\Jadwal;
use App\Models\Guru;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class JadwalController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $guru = Guru::where('user_id', $user->id)->first();

        if (!$guru) {
            return redirect()->route('dashboard');
        }

        // Ambil jadwal khusus guru yang login
        // Urutkan berdasarkan Hari (Senin-Sabtu) dan Jam
        $jadwals = Jadwal::with(['kelas', 'mapel'])
            ->where('guru_id', $guru->id)
            ->orderByRaw("FIELD(hari, 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu')")
            ->orderBy('jam_mulai')
            ->get();

        return Inertia::render('Guru/Jadwal/Index', [
            'jadwals' => $jadwals
        ]);
    }
}
