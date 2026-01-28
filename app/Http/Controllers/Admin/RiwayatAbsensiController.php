<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// [PERBAIKAN] Gunakan AbsensiMurid karena tabel 'absensis' tidak ada
use App\Models\AbsensiMurid;
use Inertia\Inertia;
use Carbon\Carbon;

class RiwayatAbsensiController extends Controller
{
    public function index(Request $request)
    {
        // [PERBAIKAN] Gunakan AbsensiMurid
        $query = AbsensiMurid::with(['user.siswa.kelas']) // Load relasi yang tersedia
            ->latest();

        // Filter Tanggal (Default Hari Ini)
        if ($request->has('tanggal') && $request->tanggal != '') {
            $query->whereDate('tanggal', $request->tanggal);
        } else {
            $query->whereDate('tanggal', Carbon::today());
        }

        // Filter Status
        if ($request->has('status') && $request->status != '') {
            $query->where('status', $request->status);
        }

        return Inertia::render('Admin/Absensi/Riwayat', [
            'absensis' => $query->paginate(20)->withQueryString(),
            'filters' => $request->only(['tanggal', 'status']),
            'tanggal_hari_ini' => Carbon::now()->format('Y-m-d')
        ]);
    }
}
