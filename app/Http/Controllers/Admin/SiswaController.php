<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Siswa;
use App\Models\Kelas;
use App\Models\User;
use App\Models\Role;
// [PERBAIKAN] Hapus Absensi, Gunakan AbsensiMurid
use App\Models\AbsensiMurid;
use App\Imports\SiswaImport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use Inertia\Inertia;
use Carbon\Carbon;

class SiswaController extends Controller
{
    /**
     * Menampilkan daftar siswa dengan filter pencarian dan kelas.
     */
    public function index(Request $request)
    {
        $query = Siswa::with(['kelas', 'user'])->orderBy('kelas_id')->orderBy('nama');

        if ($request->has('kelas_id') && $request->kelas_id != '') {
            $query->where('kelas_id', $request->kelas_id);
        }

        if ($request->has('search') && $request->search != '') {
            $query->where(function($q) use ($request) {
                $q->where('nama', 'like', '%' . $request->search . '%')
                  ->orWhere('nis', 'like', '%' . $request->search . '%');
            });
        }

        return Inertia::render('Admin/Siswa/Index', [
            'siswas' => $query->paginate(10)->withQueryString(),
            'kelas_list' => Kelas::all(),
            'filters' => $request->only(['kelas_id', 'search'])
        ]);
    }

    /**
     * Menyimpan data siswa baru beserta pembuatan akun user secara otomatis.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'nis' => 'required|unique:siswas,nis|unique:users,username',
            'kelas_id' => 'required|exists:kelas,id',
            'jenis_kelamin' => 'required|in:L,P',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
        ]);

        DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->nama,
                'username' => $request->nis,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            $roleSiswa = Role::where('name', 'Siswa')->first();
            if ($roleSiswa) {
                $user->roles()->attach($roleSiswa->id);
            }

            Siswa::create([
                'user_id' => $user->id,
                'nama' => $request->nama,
                'nis' => $request->nis,
                'kelas_id' => $request->kelas_id,
                'jenis_kelamin' => $request->jenis_kelamin,
            ]);
        });

        return redirect()->back()->with('message', 'Data siswa dan akun berhasil ditambahkan.');
    }

    public function show($id)
    {
        if (request()->wantsJson()) {
            $siswa = Siswa::with(['kelas', 'user'])->findOrFail($id);
            return response()->json($siswa);
        }
        return redirect()->route('siswas.index');
    }

    public function update(Request $request, Siswa $siswa)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'nis' => 'required|unique:siswas,nis,' . $siswa->id . '|unique:users,username,' . $siswa->user_id,
            'kelas_id' => 'required|exists:kelas,id',
            'jenis_kelamin' => 'required|in:L,P',
            'email' => 'required|email|unique:users,email,' . $siswa->user_id,
            'password' => 'nullable|min:6',
        ]);

        DB::transaction(function () use ($request, $siswa) {
            $siswa->update([
                'nama' => $request->nama,
                'nis' => $request->nis,
                'kelas_id' => $request->kelas_id,
                'jenis_kelamin' => $request->jenis_kelamin,
            ]);

            if ($siswa->user) {
                $userData = [
                    'name' => $request->nama,
                    'username' => $request->nis,
                    'email' => $request->email,
                ];

                if ($request->password) {
                    $userData['password'] = Hash::make($request->password);
                }

                $siswa->user->update($userData);
            }
        });

        return redirect()->back()->with('message', 'Data siswa berhasil diperbarui.');
    }

    public function destroy(Siswa $siswa)
    {
        if ($siswa->user) {
            $siswa->user->delete();
        } else {
            $siswa->delete();
        }

        return redirect()->back()->with('message', 'Data siswa dan akun berhasil dihapus.');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:2048'
        ]);

        try {
            Excel::import(new SiswaImport, $request->file('file'));
            return redirect()->back()->with('message', 'Proses impor data siswa selesai!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['file' => 'Terjadi kesalahan saat impor: ' . $e->getMessage()]);
        }
    }

    public function downloadTemplate()
    {
        $fileName = 'template_import_siswa.csv';
        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$fileName",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $columns = ['nis', 'nama_lengkap', 'kelas', 'jenis_kelamin', 'email', 'password'];

        $callback = function() use ($columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);
            fputcsv($file, ['1001', 'Budi Santoso', 'X IPA 1', 'L', 'budi@sekolah.sch.id', '123456']);
            fclose($file);
        };

        if (ob_get_length()) ob_end_clean();

        return response()->stream($callback, 200, $headers);
    }

    /**
     * API untuk mengambil data rekap absensi per semester (Untuk Side Panel).
     * [DIPERBARUI] Menggunakan AbsensiMurid & menghitung status 'Disetujui'
     */
    public function getRekapAbsensi($id)
    {
        $siswa = Siswa::with(['user', 'kelas'])->findOrFail($id);

        $bulanSekarang = Carbon::now()->month;
        $tahunSekarang = Carbon::now()->year;

        if ($bulanSekarang >= 7) {
            $start = Carbon::create($tahunSekarang, 7, 1);
            $end = Carbon::create($tahunSekarang, 12, 31);
            $semesterLabel = "Ganjil " . $tahunSekarang . "/" . ($tahunSekarang + 1);
        } else {
            $start = Carbon::create($tahunSekarang, 1, 1);
            $end = Carbon::create($tahunSekarang, 6, 30);
            $semesterLabel = "Genap " . ($tahunSekarang - 1) . "/" . $tahunSekarang;
        }

        // [PERBAIKAN UTAMA] Gunakan AbsensiMurid::where(...)

        $rekap = [
            'Hadir' => AbsensiMurid::where('user_id', $siswa->user_id)
                ->whereBetween('tanggal', [$start, $end])
                ->where('status', 'Hadir')
                ->count(),

            'Sakit' => AbsensiMurid::where('user_id', $siswa->user_id)
                ->whereBetween('tanggal', [$start, $end])
                ->where(function($q) {
                    $q->where('status', 'Sakit')
                      ->orWhere(function($sub) {
                          $sub->whereIn('status', ['Disetujui', 'Menunggu Verifikasi'])
                              ->where('jenis', 'Sakit');
                      });
                })->count(),

            'Izin' => AbsensiMurid::where('user_id', $siswa->user_id)
                ->whereBetween('tanggal', [$start, $end])
                ->where(function($q) {
                    $q->where('status', 'Izin')
                      ->orWhere(function($sub) {
                          $sub->whereIn('status', ['Disetujui', 'Menunggu Verifikasi'])
                              ->whereIn('jenis', ['Izin', 'Lainnya']);
                      });
                })->count(),

            'Alpha' => AbsensiMurid::where('user_id', $siswa->user_id)
                ->whereBetween('tanggal', [$start, $end])
                ->where('status', 'Alpha')
                ->count(),

            'Terlambat' => AbsensiMurid::where('user_id', $siswa->user_id)
                ->whereBetween('tanggal', [$start, $end])
                ->where('status', 'Terlambat')
                ->count(),
        ];

        $riwayatTerakhir = AbsensiMurid::where('user_id', $siswa->user_id)
            ->whereBetween('tanggal', [$start, $end])
            ->latest('tanggal')
            ->take(5)
            ->get();

        return response()->json([
            'siswa' => [
                'nama' => $siswa->nama,
                'nis' => $siswa->nis,
                'kelas' => $siswa->kelas
            ],
            'semester' => $semesterLabel,
            'rekap' => $rekap,
            'riwayat' => $riwayatTerakhir
        ]);
    }
}
