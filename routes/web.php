<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

// --- MODELS ---
use App\Models\User;
use App\Models\Guru;
use App\Models\Siswa;
use App\Models\Kelas;
use App\Models\Jurnal;
use App\Models\AbsensiGuru;

// --- CONTROLLERS ADMIN ---
use App\Http\Controllers\Admin\GuruController;
use App\Http\Controllers\Admin\KelasController;
use App\Http\Controllers\Admin\MapelController;
use App\Http\Controllers\Admin\SiswaController;
use App\Http\Controllers\Admin\JadwalController;
use App\Http\Controllers\Admin\BankSoalController as AdminBankSoalController;
// Pastikan file app/Http/Controllers/Admin/PerangkatController.php sudah Anda buat
use App\Http\Controllers\Admin\PerangkatController as AdminPerangkatController;

// --- CONTROLLERS GURU ---
use App\Http\Controllers\Guru\JurnalController;
use App\Http\Controllers\Guru\AbsensiMuridController;
use App\Http\Controllers\Guru\AbsensiGuruController;
use App\Http\Controllers\Guru\JadwalController as GuruJadwalController;
// Pastikan file app/Http/Controllers/Guru/PerangkatGuruController.php sudah Anda buat
use App\Http\Controllers\Guru\PerangkatGuruController;
use App\Http\Controllers\Guru\BankSoalController;
use App\Http\Controllers\Guru\UjianController;
use App\Http\Controllers\Guru\JadwalUjianController;

// --- CONTROLLERS SISWA ---
use App\Http\Controllers\Siswa\UjianController as SiswaUjianController;

// --- CONTROLLERS KEPALA SEKOLAH ---
use App\Http\Controllers\Kepsek\DashboardController as KepsekDashboardController;
// [BARU] Import Controller Supervisi Kepsek (Pastikan file sudah dibuat)
use App\Http\Controllers\Kepsek\PerangkatKepsekController;

// --- CONTROLLERS UTILITY ---
use App\Http\Controllers\ExportPdfController;

/*
|--------------------------------------------------------------------------
| Web Routes (Aplikasi Sekolah)
|--------------------------------------------------------------------------
*/

// 1. Redirect Halaman Depan ke Login
Route::get('/', function () {
    return redirect()->route('login');
});

// 2. Logic Redirect Dashboard Berdasarkan Role
Route::get('/dashboard', function () {
    /** @var \App\Models\User $user */
    $user = Auth::user();

    if ($user->hasRole('Super Admin')) {
        return redirect()->route('admin.dashboard');
    }
    elseif ($user->hasRole('Guru')) {
        return redirect()->route('guru.dashboard');
    }
    elseif ($user->hasRole('Siswa')) {
        return redirect()->route('siswa.dashboard');
    }
    elseif ($user->hasRole('Kepala Sekolah')) {
        return redirect()->route('kepsek.dashboard');
    }

    return Inertia::render('Dashboard'); // Fallback
})->middleware(['auth', 'verified'])->name('dashboard');


// 3. Group Route Auth
Route::middleware('auth')->group(function () {

    // --- PROFILE ---
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // =================================================================
    // GROUP SUPER ADMIN (Prefix: /admin)
    // =================================================================
    Route::prefix('admin')->group(function () {
        // Dashboard Admin
        Route::get('/dashboard', function() {
            $stats = [
                'total_guru' => Guru::count(),
                'total_siswa' => Siswa::count(),
                'total_kelas' => Kelas::count(),
                'jurnal_hari_ini' => Jurnal::whereDate('tanggal', Carbon::today())->count(),
                'guru_hadir' => AbsensiGuru::whereDate('tanggal', Carbon::today())->count(),
            ];
            return Inertia::render('Admin/DashboardSuperAdmin', ['stats' => $stats]);
        })->name('admin.dashboard');

        // Master Data
        Route::resource('kelas', KelasController::class);
        Route::resource('mapels', MapelController::class);
        Route::resource('gurus', GuruController::class);
        Route::resource('siswas', SiswaController::class);
        Route::resource('jadwals', JadwalController::class);

        // Monitoring Bank Soal (Gudang Berkas)
        Route::get('/bank-soal-guru', [AdminBankSoalController::class, 'index'])->name('admin.bank-soal.index');
        Route::delete('/bank-soal-guru/{id}', [AdminBankSoalController::class, 'destroy'])->name('admin.bank-soal.destroy');

        // Monitoring Perangkat Ajar
        Route::get('/perangkat-ajar', [AdminPerangkatController::class, 'index'])->name('admin.perangkat.index');
        Route::delete('/perangkat-ajar/{id}', [AdminPerangkatController::class, 'destroy'])->name('admin.perangkat.destroy');

        // QR Code Generator
        Route::get('/generate-qr', [AbsensiGuruController::class, 'generateQr'])->name('admin.qr.generate');
    });

    // =================================================================
    // GROUP GURU (Prefix: /guru)
    // =================================================================
    Route::prefix('guru')->group(function () {
        // Dashboard
        Route::get('/dashboard', function() {
            return Inertia::render('Guru/DashboardGuru');
        })->name('guru.dashboard');

        // Jurnal Mengajar
        Route::get('/jurnal', [JurnalController::class, 'index'])->name('guru.jurnal.index');
        Route::post('/jurnal', [JurnalController::class, 'store'])->name('guru.jurnal.store');

        // Absensi Siswa
        Route::get('/absensi', [AbsensiMuridController::class, 'index'])->name('guru.absensi.index');
        Route::post('/absensi', [AbsensiMuridController::class, 'store'])->name('guru.absensi.store');

        // Absensi Guru (Scan QR)
        Route::get('/absensi-saya', [AbsensiGuruController::class, 'index'])->name('guru.absensi-saya.index');
        Route::post('/absensi-saya/scan', [AbsensiGuruController::class, 'store'])->name('guru.absensi-saya.store');

        // Jadwal Mengajar Rutin
        Route::get('/jadwal', [GuruJadwalController::class, 'index'])->name('guru.jadwal.index');

        // --- MANAJEMEN PERANGKAT GURU ---
        Route::get('/perangkat', [PerangkatGuruController::class, 'index'])->name('guru.perangkat.index');
        Route::post('/perangkat', [PerangkatGuruController::class, 'store'])->name('guru.perangkat.store');
        Route::delete('/perangkat/{id}', [PerangkatGuruController::class, 'destroy'])->name('guru.perangkat.destroy');
        Route::get('/perangkat/{id}/cetak', [PerangkatGuruController::class, 'cetakLembarPengesahan'])->name('guru.perangkat.cetak');

        // Bank Soal (Gudang Berkas)
        Route::get('/bank-soal', [BankSoalController::class, 'index'])->name('guru.bank-soal.index');
        Route::post('/bank-soal', [BankSoalController::class, 'store'])->name('guru.bank-soal.store');
        Route::delete('/bank-soal/{id}', [BankSoalController::class, 'destroy'])->name('guru.bank-soal.destroy');

        // Manajemen Ujian (Pembuatan Soal Interaktif)
        Route::get('/manajemen-soal', [UjianController::class, 'index'])->name('guru.ujian.index');
        Route::post('/manajemen-soal', [UjianController::class, 'store'])->name('guru.ujian.store');
        Route::get('/manajemen-soal/{id}/edit', [UjianController::class, 'edit'])->name('guru.ujian.edit');
        Route::put('/manajemen-soal/{id}', [UjianController::class, 'update'])->name('guru.ujian.update'); // Update Status
        Route::delete('/manajemen-soal/{id}', [UjianController::class, 'destroy'])->name('guru.ujian.destroy');

        // Butir Soal (Sub-resource Ujian)
        Route::post('/manajemen-soal/{id}/soal', [UjianController::class, 'storeSoal'])->name('guru.ujian.soal.store');
        Route::delete('/manajemen-soal/soal/{id}', [UjianController::class, 'destroySoal'])->name('guru.ujian.soal.destroy');

        // Manajemen Ulangan (Penjadwalan)
        Route::get('/manajemen-ulangan', [JadwalUjianController::class, 'index'])->name('guru.ulangan.index');
        Route::post('/manajemen-ulangan', [JadwalUjianController::class, 'store'])->name('guru.ulangan.store');
        Route::delete('/manajemen-ulangan/{id}', [JadwalUjianController::class, 'destroy'])->name('guru.ulangan.destroy');
        Route::put('/manajemen-ulangan/{id}/token', [JadwalUjianController::class, 'resetToken'])->name('guru.ulangan.token');
    });

    // =================================================================
    // GROUP SISWA (Prefix: /siswa)
    // =================================================================
    Route::prefix('siswa')->group(function () {
        // Dashboard
        Route::get('/dashboard', function() {
            return Inertia::render('Siswa/DashboardSiswa');
        })->name('siswa.dashboard');

        // Jadwal Ulangan
        Route::get('/jadwal-ulangan', [SiswaUjianController::class, 'index'])->name('siswa.ujian.index');

        // Proses Pengerjaan Ujian
        Route::get('/ujian/persiapan/{id}', [SiswaUjianController::class, 'showPersiapan'])->name('siswa.ujian.persiapan');
        Route::post('/ujian/mulai/{id}', [SiswaUjianController::class, 'mulaiKerjakan'])->name('siswa.ujian.mulai');
        Route::get('/ujian/lembar-kerja/{id}', [SiswaUjianController::class, 'showSoal'])->name('siswa.ujian.soal');
        Route::post('/ujian/simpan-jawaban/{id}', [SiswaUjianController::class, 'simpanJawaban'])->name('siswa.ujian.simpan');
        Route::post('/ujian/selesai/{id}', [SiswaUjianController::class, 'selesai'])->name('siswa.ujian.selesai');

        // Riwayat Nilai
        Route::get('/nilai', [SiswaUjianController::class, 'indexNilai'])->name('siswa.nilai.index');
    });

    // =================================================================
    // GROUP KEPALA SEKOLAH (Prefix: /kepsek)
    // =================================================================
    Route::prefix('kepsek')->group(function () {
        Route::get('/dashboard', [KepsekDashboardController::class, 'index'])->name('kepsek.dashboard');

        // --- [BARU] FITUR SUPERVISI PERANGKAT GURU ---
        Route::get('/supervisi-perangkat', [PerangkatKepsekController::class, 'index'])->name('kepsek.supervisi.index');
        Route::put('/supervisi-perangkat/{id}', [PerangkatKepsekController::class, 'update'])->name('kepsek.supervisi.update');

        Route::get('/monitoring-jurnal', [KepsekDashboardController::class, 'monitoringJurnal'])->name('kepsek.jurnal');
        Route::get('/monitoring-absensi', [KepsekDashboardController::class, 'monitoringAbsensi'])->name('kepsek.absensi');
        Route::get('/laporan-siswa', [KepsekDashboardController::class, 'laporanSiswa'])->name('kepsek.laporan-siswa');
    });

    // =================================================================
    // GROUP EXPORT (PDF)
    // =================================================================
    Route::prefix('export')->group(function () {
        Route::get('/jurnal', [ExportPdfController::class, 'jurnal'])->name('export.jurnal');
        Route::get('/absensi-guru', [ExportPdfController::class, 'absensiGuru'])->name('export.absensi-guru');
        Route::get('/absensi-murid', [ExportPdfController::class, 'absensiMurid'])->name('export.absensi-murid');
    });

});

require __DIR__.'/auth.php';
