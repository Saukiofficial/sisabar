<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // GANTI 'absensis' MENJADI 'absensi_murids' (atau tabel yang sesuai)
        Schema::table('absensi_murids', function (Blueprint $table) {
            // 1. Tambahkan kolom user_id jika belum ada
            if (!Schema::hasColumn('absensi_murids', 'user_id')) {
                $table->foreignId('user_id')->nullable()->after('id')->constrained('users')->onDelete('cascade');
            }

            // 2. Ubah kolom siswa_id agar boleh null (nullable) atau hapus
            // Kita buat nullable dulu agar data lama tidak hilang/error
            if (Schema::hasColumn('absensi_murids', 'siswa_id')) {
                $table->unsignedBigInteger('siswa_id')->nullable()->change();
            }

            // 3. Pastikan kolom lain ada
            if (!Schema::hasColumn('absensi_murids', 'waktu_masuk')) {
                $table->time('waktu_masuk')->nullable();
            }
            if (!Schema::hasColumn('absensi_murids', 'waktu_pulang')) {
                $table->time('waktu_pulang')->nullable();
            }
            // Kolom status sudah ditangani di migrasi sebelumnya, tapi tidak ada salahnya cek
            if (!Schema::hasColumn('absensi_murids', 'status')) {
                $table->string('status', 50)->default('Alpha');
            }
            if (!Schema::hasColumn('absensi_murids', 'keterangan')) {
                $table->string('keterangan')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Tidak perlu rollback kompleks untuk fix ini
    }
};
