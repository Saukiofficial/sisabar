<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
// Note: Anda perlu melengkapi logic di AdminController & GuruController
// agar return response()->json(...) sesuai kebutuhan mobile app nantinya.
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\GuruController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Endpoint ini untuk akses via Mobile App / Postman.
| Header Wajib: Accept: application/json
|
*/

// --- 1. AUTH ---
Route::post('/login', [AuthController::class, 'login']);

// Group Protected (Butuh Token Bearer)
Route::middleware('auth:sanctum')->group(function () {

    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // Cek User Profile
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // --- 2. ADMIN ENDPOINTS ---
    // (Akses: Hanya user dengan role Super Admin)
    Route::prefix('admin')->group(function () {
        // Contoh: Ambil semua data master
        Route::get('/dashboard-stats', [AdminController::class, 'stats']);
        Route::get('/gurus', [AdminController::class, 'gurus']);
        Route::get('/kelas', [AdminController::class, 'kelas']);
        Route::post('/gurus', [AdminController::class, 'storeGuru']);
    });

    // --- 3. GURU ENDPOINTS ---
    Route::prefix('guru')->group(function () {
        // Jurnal
        Route::get('/jurnals', [GuruController::class, 'jurnalList']);
        Route::post('/jurnals', [GuruController::class, 'jurnalStore']);

        // Absensi Siswa
        Route::get('/siswa-by-kelas/{kelas_id}', [GuruController::class, 'getSiswa']);
        Route::post('/absensi-siswa', [GuruController::class, 'storeAbsensiSiswa']);

        // Absensi Diri Sendiri (History)
        Route::get('/absensi-saya', [GuruController::class, 'historyAbsensi']);
    });

    // --- 4. KEPSEK ENDPOINTS ---
    Route::prefix('kepsek')->group(function () {
        // Biasanya Kepsek hanya view-only (Read Report)
        Route::get('/laporan-harian', [AdminController::class, 'laporanHarian']);
    });

    // --- 5. QR CODE ENDPOINTS ---
    Route::prefix('qr')->group(function () {
        // Generate QR String (Untuk Admin Display)
        Route::get('/generate', [AdminController::class, 'generateQrString']);

        // Scan QR (Untuk Guru)
        Route::post('/scan', [GuruController::class, 'scanQr']);
    });

    // --- 6. EXPORT ENDPOINTS ---
    // (Biasanya API me-return URL download PDF)
    Route::prefix('export')->group(function () {
        Route::get('/jurnal/pdf', [GuruController::class, 'exportJurnalUrl']);
    });

});
