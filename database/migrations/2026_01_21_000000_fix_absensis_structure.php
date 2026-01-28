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
        Schema::table('absensis', function (Blueprint $table) {
            // 1. Tambahkan kolom user_id jika belum ada
            if (!Schema::hasColumn('absensis', 'user_id')) {
                $table->foreignId('user_id')->nullable()->after('id')->constrained('users')->onDelete('cascade');
            }

            // 2. Ubah kolom siswa_id agar boleh null (nullable) atau hapus
            // Kita buat nullable dulu agar data lama tidak hilang/error
            if (Schema::hasColumn('absensis', 'siswa_id')) {
                $table->unsignedBigInteger('siswa_id')->nullable()->change();
            }

            // 3. Pastikan kolom lain ada
            if (!Schema::hasColumn('absensis', 'waktu_masuk')) {
                $table->time('waktu_masuk')->nullable();
            }
            if (!Schema::hasColumn('absensis', 'waktu_pulang')) {
                $table->time('waktu_pulang')->nullable();
            }
            if (!Schema::hasColumn('absensis', 'status')) {
                $table->string('status')->default('Alpha');
            }
            if (!Schema::hasColumn('absensis', 'keterangan')) {
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
