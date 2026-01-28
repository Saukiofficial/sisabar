<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Siswa;

class ProfileController extends Controller
{
    /**
     * Menampilkan halaman Profil khusus Siswa
     * Menampilkan data user + data akademik (NIS, Kelas, dll)
     */
    public function index()
    {
        $user = Auth::user();

        // Ambil data siswa berdasarkan user yang login
        // Menggunakan firstOrFail agar jika bukan siswa, muncul 404
        $siswa = Siswa::with('kelas')->where('user_id', $user->id)->firstOrFail();

        return Inertia::render('Siswa/Profile', [
            'auth' => [
                'user' => $user,
            ],
            'siswa' => $siswa
        ]);
    }
}
