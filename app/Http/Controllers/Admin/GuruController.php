<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Guru;
use App\Models\User;
use App\Models\Role;
use App\Models\Mapel;
use App\Models\Kelas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class GuruController extends Controller
{
    public function index()
    {
        // Eager load user, mapel, kelas untuk ditampilkan di tabel
        $gurus = Guru::with(['user', 'mapel', 'kelas'])->latest()->get();

        // Kita butuh data mapel & kelas untuk dropdown form
        return Inertia::render('Admin/Guru/Index', [
            'gurus' => $gurus,
            'mapels' => Mapel::all(),
            'kelas' => Kelas::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'password' => 'required|string|min:8',
            'mapel_id' => 'nullable|exists:mapels,id',
            'kelas_id' => 'nullable|exists:kelas,id',
        ]);

        DB::transaction(function () use ($request) {
            // 1. Buat User Login
            $user = User::create([
                'name' => $request->name,
                'username' => $request->username,
                'email' => $request->username . '@sekolah.id', // Email dummy jika tidak diinput
                'password' => Hash::make($request->password),
            ]);

            // 2. Assign Role Guru
            $roleGuru = Role::where('name', 'Guru')->first();
            $user->roles()->attach($roleGuru->id);

            // 3. Buat Profil Guru
            Guru::create([
                'user_id' => $user->id,
                'mapel_id' => $request->mapel_id,
                'kelas_id' => $request->kelas_id,
                'status_aktif' => true,
            ]);
        });

        return redirect()->back()->with('message', 'Guru berhasil ditambahkan');
    }

    public function update(Request $request, Guru $guru)
    {
        // Logic update (bisa update user name/password atau data mapel)
        // Untuk ringkas, update mapel/kelas/status saja di sini
        $guru->update([
            'mapel_id' => $request->mapel_id,
            'kelas_id' => $request->kelas_id,
            'status_aktif' => $request->status_aktif ?? $guru->status_aktif
        ]);

        // Jika ingin update nama di tabel users
        if($request->name) {
            $guru->user->update(['name' => $request->name]);
        }

        // Jika password diisi, update password
        if($request->password) {
            $guru->user->update(['password' => Hash::make($request->password)]);
        }

        return redirect()->back();
    }

    public function destroy(Guru $guru)
    {
        // Hapus User-nya juga
        $guru->user->delete();
        // Guru profile otomatis terhapus karena cascade delete di migration (opsional)
        // atau hapus manual:
        // $guru->delete();

        return redirect()->back();
    }
}
