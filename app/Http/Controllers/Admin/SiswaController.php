<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Siswa;
use App\Models\Kelas;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SiswaController extends Controller
{
    public function index(Request $request)
    {
        // Eager load 'user' untuk menampilkan email jika perlu
        $query = Siswa::with(['kelas', 'user'])->orderBy('kelas_id')->orderBy('nama');

        if ($request->has('kelas_id') && $request->kelas_id != '') {
            $query->where('kelas_id', $request->kelas_id);
        }

        if ($request->has('search') && $request->search != '') {
            $query->where('nama', 'like', '%' . $request->search . '%');
        }

        return Inertia::render('Admin/Siswa/Index', [
            'siswas' => $query->paginate(10)->withQueryString(),
            'kelas_list' => Kelas::all(),
            'filters' => $request->only(['kelas_id', 'search'])
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'nis' => 'required|unique:siswas,nis|unique:users,username', // NIS jadi Username
            'kelas_id' => 'required|exists:kelas,id',
            'jenis_kelamin' => 'required|in:L,P',
            'email' => 'required|email|unique:users,email', // Tambahan Email
            'password' => 'required|min:6', // Tambahan Password
        ]);

        DB::transaction(function () use ($request) {
            // 1. Buat Akun User
            $user = User::create([
                'name' => $request->nama,
                'username' => $request->nis, // Gunakan NIS sebagai username login
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            // 2. Assign Role Siswa
            $roleSiswa = Role::where('name', 'Siswa')->first();
            if ($roleSiswa) {
                $user->roles()->attach($roleSiswa->id);
            }

            // 3. Buat Data Siswa
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

    public function update(Request $request, Siswa $siswa)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'nis' => 'required|unique:siswas,nis,' . $siswa->id,
            'kelas_id' => 'required|exists:kelas,id',
            'jenis_kelamin' => 'required|in:L,P',
            'email' => 'required|email|unique:users,email,' . $siswa->user_id,
            'password' => 'nullable|min:6', // Password opsional saat update
        ]);

        DB::transaction(function () use ($request, $siswa) {
            // 1. Update Data Siswa
            $siswa->update([
                'nama' => $request->nama,
                'nis' => $request->nis,
                'kelas_id' => $request->kelas_id,
                'jenis_kelamin' => $request->jenis_kelamin,
            ]);

            // 2. Update Akun User
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
        // Hapus usernya, maka siswa akan terhapus otomatis (cascade)
        if ($siswa->user) {
            $siswa->user->delete();
        } else {
            $siswa->delete(); // Fallback jika user_id null
        }

        return redirect()->back()->with('message', 'Data siswa dan akun berhasil dihapus.');
    }
}
