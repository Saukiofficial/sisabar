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
use App\Http\Controllers\Admin\PerangkatController as AdminPerangkatController;
use App\Http\Controllers\Admin\AbsensiGateController;
use App\Http\Controllers\Admin\RiwayatAbsensiController;
use App\Http\Controllers\Admin\AdminIzinController; // [BARU] Verifikasi Izin

// --- CONTROLLERS GURU ---
use App\Http\Controllers\Guru\JurnalController;
use App\Http\Controllers\Guru\AbsensiMuridController;
use App\Http\Controllers\Guru\AbsensiGuruController;
use App\Http\Controllers\Guru\JadwalController as GuruJadwalController;
use App\Http\Controllers\Guru\PerangkatGuruController;
use App\Http\Controllers\Guru\BankSoalController;
use App\Http\Controllers\Guru\UjianController;
use App\Http\Controllers\Guru\JadwalUjianController;

// --- CONTROLLERS SISWA ---
use App\Http\Controllers\Siswa\UjianController as SiswaUjianController;
use App\Http\Controllers\Siswa\DashboardController as SiswaDashboardController;
use App\Http\Controllers\Siswa\ProfileController as SiswaProfileController;
use App\Http\Controllers\Siswa\ExportPdfController as SiswaExportController;
use App\Http\Controllers\Siswa\IzinController; // [BARU] Pengajuan Izin

// --- CONTROLLERS KEPALA SEKOLAH ---
use App\Http\Controllers\Kepsek\DashboardController as KepsekDashboardController;
use App\Http\Controllers\Kepsek\PerangkatKepsekController;

// --- CONTROLLERS UTILITY ---
use App\Http\Controllers\ExportPdfController;

/*
|--------------------------------------------------------------------------
| Web Routes (Smart Class System)
|--------------------------------------------------------------------------
*/

// Halaman Utama / Redirect ke Login
Route::get('/', function () {
    return redirect()->route('login');
});

// Logic Redirect Dashboard Berdasarkan Role User
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

    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');


Route::middleware('auth')->group(function () {

    // --- PROFIL UMUM ---
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // =================================================================
    // GROUP SUPER ADMIN (Prefix: /admin)
    // =================================================================
    Route::prefix('admin')->group(function () {
        // Dashboard Stats
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

        // Master Data (Resources)
        Route::resource('kelas', KelasController::class);
        Route::resource('mapels', MapelController::class);

        // --- MANAJEMEN GURU ---
        // [PENTING] Tambahkan route cetak DI ATAS resource agar tidak dianggap ID
        Route::get('/gurus/{id}/cetak', [GuruController::class, 'cetak'])->name('gurus.cetak');
        Route::resource('gurus', GuruController::class);

        Route::resource('jadwals', JadwalController::class);

        // --- MANAJEMEN SISWA ---
        // Route custom harus DI ATAS resource agar tidak dianggap sebagai {id}
        Route::post('/siswas/import', [SiswaController::class, 'import'])->name('admin.siswas.import');
        Route::get('/siswas/template', [SiswaController::class, 'downloadTemplate'])->name('admin.siswas.template');
        Route::get('/siswas/{id}/rekap-absensi', [SiswaController::class, 'getRekapAbsensi'])->name('admin.siswas.rekap');

        // Resource Siswa (CRUD Standar)
        Route::resource('siswas', SiswaController::class);

        // Monitoring Akademik
        Route::get('/bank-soal-guru', [AdminBankSoalController::class, 'index'])->name('admin.bank-soal.index');
        Route::delete('/bank-soal-guru/{id}', [AdminBankSoalController::class, 'destroy'])->name('admin.bank-soal.destroy');
        Route::get('/perangkat-ajar', [AdminPerangkatController::class, 'index'])->name('admin.perangkat.index');
        Route::delete('/perangkat-ajar/{id}', [AdminPerangkatController::class, 'destroy'])->name('admin.perangkat.destroy');

        // --- MANAJEMEN ABSENSI & QR ---
        // 1. Scanner Gerbang (Halaman OrDisplay)
        Route::get('/scan-gate', [AbsensiGateController::class, 'index'])->name('admin.absensi.gate');
        Route::post('/scan-gate/store', [AbsensiGateController::class, 'store'])->name('admin.absensi.store');

        // 2. Generator QR (Cetak Massal)
        Route::get('/generate-qr', [AbsensiGateController::class, 'generateQr'])->name('admin.qr.generate');

        // 3. Log Riwayat Absensi Seluruh User
        Route::get('/riwayat-absensi', [RiwayatAbsensiController::class, 'index'])->name('admin.absensi.riwayat');

        // --- [BARU] VERIFIKASI IZIN SISWA ---
        Route::get('/verifikasi-izin', [AdminIzinController::class, 'index'])->name('admin.izin.index');
        Route::post('/verifikasi-izin/{id}/{status}', [AdminIzinController::class, 'verifikasi'])->name('admin.izin.verifikasi');
    });

    // =================================================================
    // GROUP GURU (Prefix: /guru)
    // =================================================================
    Route::prefix('guru')->group(function () {
        Route::get('/dashboard', function() {
            return Inertia::render('Guru/DashboardGuru');
        })->name('guru.dashboard');

        Route::get('/jurnal', [JurnalController::class, 'index'])->name('guru.jurnal.index');
        Route::post('/jurnal', [JurnalController::class, 'store'])->name('guru.jurnal.store');
        Route::get('/absensi', [AbsensiMuridController::class, 'index'])->name('guru.absensi.index');
        Route::post('/absensi', [AbsensiMuridController::class, 'store'])->name('guru.absensi.store');

        Route::get('/absensi-saya', [AbsensiGuruController::class, 'index'])->name('guru.absensi-saya.index');
        Route::post('/absensi-saya/scan', [AbsensiGuruController::class, 'store'])->name('guru.absensi-saya.store');

        Route::get('/jadwal', [GuruJadwalController::class, 'index'])->name('guru.jadwal.index');
        Route::get('/perangkat', [PerangkatGuruController::class, 'index'])->name('guru.perangkat.index');
        Route::post('/perangkat', [PerangkatGuruController::class, 'store'])->name('guru.perangkat.store');
        Route::delete('/perangkat/{id}', [PerangkatGuruController::class, 'destroy'])->name('guru.perangkat.destroy');
        Route::get('/perangkat/{id}/cetak', [PerangkatGuruController::class, 'cetakLembarPengesahan'])->name('guru.perangkat.cetak');

        // Bank Soal & Ujian
        Route::get('/bank-soal', [BankSoalController::class, 'index'])->name('guru.bank-soal.index');
        Route::post('/bank-soal', [BankSoalController::class, 'store'])->name('guru.bank-soal.store');
        Route::delete('/bank-soal/{id}', [BankSoalController::class, 'destroy'])->name('guru.bank-soal.destroy');

        Route::get('/manajemen-soal', [UjianController::class, 'index'])->name('guru.ujian.index');
        Route::post('/manajemen-soal', [UjianController::class, 'store'])->name('guru.ujian.store');
        Route::get('/manajemen-soal/{id}/edit', [UjianController::class, 'edit'])->name('guru.ujian.edit');
        Route::put('/manajemen-soal/{id}', [UjianController::class, 'update'])->name('guru.ujian.update');
        Route::delete('/manajemen-soal/{id}', [UjianController::class, 'destroy'])->name('guru.ujian.destroy');
        Route::post('/manajemen-soal/{id}/soal', [UjianController::class, 'storeSoal'])->name('guru.ujian.soal.store');
        Route::delete('/manajemen-soal/soal/{id}', [UjianController::class, 'destroySoal'])->name('guru.ujian.soal.destroy');

        Route::get('/manajemen-ulangan', [JadwalUjianController::class, 'index'])->name('guru.ulangan.index');
        Route::post('/manajemen-ulangan', [JadwalUjianController::class, 'store'])->name('guru.ulangan.store');
        Route::delete('/manajemen-ulangan/{id}', [JadwalUjianController::class, 'destroy'])->name('guru.ulangan.destroy');
        Route::put('/manajemen-ulangan/{id}/token', [JadwalUjianController::class, 'resetToken'])->name('guru.ulangan.token');
    });

    // =================================================================
    // GROUP SISWA (Prefix: /siswa)
    // =================================================================
    Route::prefix('siswa')->group(function () {
        Route::get('/dashboard', [SiswaDashboardController::class, 'index'])->name('siswa.dashboard');
        Route::get('/profile', [SiswaProfileController::class, 'index'])->name('siswa.profile');
        Route::get('/cetak-kartu', [SiswaExportController::class, 'kartuPelajar'])->name('siswa.cetak.kartu');

        // Ujian Siswa
        Route::get('/jadwal-ulangan', [SiswaUjianController::class, 'index'])->name('siswa.ujian.index');
        Route::get('/ujian/persiapan/{id}', [SiswaUjianController::class, 'showPersiapan'])->name('siswa.ujian.persiapan');
        Route::post('/ujian/mulai/{id}', [SiswaUjianController::class, 'mulaiKerjakan'])->name('siswa.ujian.mulai');
        Route::get('/ujian/lembar-kerja/{id}', [SiswaUjianController::class, 'showSoal'])->name('siswa.ujian.soal');
        Route::post('/ujian/simpan-jawaban/{id}', [SiswaUjianController::class, 'simpanJawaban'])->name('siswa.ujian.simpan');
        Route::post('/ujian/selesai/{id}', [SiswaUjianController::class, 'selesai'])->name('siswa.ujian.selesai');

        Route::get('/nilai', [SiswaUjianController::class, 'indexNilai'])->name('siswa.nilai.index');

        // --- [BARU] PENGAJUAN IZIN ---
        Route::get('/izin', [IzinController::class, 'index'])->name('siswa.izin.index');
        Route::post('/izin', [IzinController::class, 'store'])->name('siswa.izin.store');
    });

    // =================================================================
    // GROUP KEPALA SEKOLAH (Prefix: /kepsek)
    // =================================================================
    Route::prefix('kepsek')->group(function () {
        Route::get('/dashboard', [KepsekDashboardController::class, 'index'])->name('kepsek.dashboard');
        Route::get('/supervisi-perangkat', [PerangkatKepsekController::class, 'index'])->name('kepsek.supervisi.index');
        Route::put('/supervisi-perangkat/{id}', [PerangkatKepsekController::class, 'update'])->name('kepsek.supervisi.update');
        Route::get('/monitoring-jurnal', [KepsekDashboardController::class, 'monitoringJurnal'])->name('kepsek.jurnal');

        // Monitoring Absensi (Menggunakan Riwayat Absensi Controller)
        Route::get('/monitoring-absensi', [RiwayatAbsensiController::class, 'index'])->name('kepsek.absensi');

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
