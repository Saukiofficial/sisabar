<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    // POST /api/login
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        // Cek kredensial
        if (!Auth::attempt($request->only('username', 'password'))) {
            return response()->json([
                'success' => false,
                'message' => 'Username atau Password salah'
            ], 401);
        }

        $user = User::where('username', $request->username)->first();

        // Cek Role untuk info response
        $role = 'User';
        if ($user->hasRole('Super Admin')) $role = 'Super Admin';
        else if ($user->hasRole('Guru')) $role = 'Guru';
        else if ($user->hasRole('Kepala Sekolah')) $role = 'Kepala Sekolah';

        // Hapus token lama (opsional, agar 1 device 1 token)
        // $user->tokens()->delete();

        // Buat Token Baru
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login Berhasil',
            'data' => [
                'user' => $user,
                'role' => $role,
                'token' => $token,
                'token_type' => 'Bearer'
            ]
        ]);
    }

    // POST /api/logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['success' => true, 'message' => 'Logout berhasil']);
    }

    // GET /api/user
    public function profile(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => $request->user()
        ]);
    }
}
