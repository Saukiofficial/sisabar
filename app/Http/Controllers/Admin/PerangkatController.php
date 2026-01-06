<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PerangkatPembelajaran;
use App\Models\Guru;
use App\Models\Mapel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PerangkatController extends Controller
{
    public function index(Request $request)
    {
        // Query data perangkat dengan relasi Guru & Mapel
        $query = PerangkatPembelajaran::with(['guru.user', 'mapel'])
            ->latest();

        // Filter by Guru
        if ($request->has('guru_id') && $request->guru_id != '') {
            $query->where('guru_id', $request->guru_id);
        }

        // Filter by Mapel
        if ($request->has('mapel_id') && $request->mapel_id != '') {
            $query->where('mapel_id', $request->mapel_id);
        }

        // Search by Judul / Jenis
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('judul', 'like', '%' . $search . '%')
                  ->orWhere('jenis_perangkat', 'like', '%' . $search . '%');
            });
        }

        return Inertia::render('Admin/Perangkat/Index', [
            'perangkats' => $query->paginate(10)->withQueryString(),
            'gurus' => Guru::with('user')->get(),
            'mapels' => Mapel::all(),
            'filters' => $request->only(['guru_id', 'mapel_id', 'search'])
        ]);
    }

    public function destroy($id)
    {
        $perangkat = PerangkatPembelajaran::findOrFail($id);

        if (Storage::disk('public')->exists($perangkat->file_path)) {
            Storage::disk('public')->delete($perangkat->file_path);
        }

        $perangkat->delete();

        return redirect()->back()->with('message', 'Perangkat ajar berhasil dihapus oleh Admin.');
    }
}
