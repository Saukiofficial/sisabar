<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Menambahkan kolom jenis, tanggal_mulai, tanggal_selesai ke tabel absensi_murids
     */
    public function up()
    {
        // GANTI 'absensis' MENJADI 'absensi_murids'
        Schema::table('absensi_murids', function (Blueprint $table) {
            // [PERBAIKAN] Cek dulu apakah kolom 'user_id' ada.
            // Jika tidak ada, buat dulu (opsional, tergantung struktur Anda)
            // Atau cukup hapus 'after' agar kolom baru ditaruh di paling belakang.

            // Disini saya hapus ->after('user_id') agar aman dari error "Column not found".

            if (!Schema::hasColumn('absensi_murids', 'jenis')) {
                $table->string('jenis', 50)->nullable()->comment('Sakit, Izin, Lainnya');
            }

            if (!Schema::hasColumn('absensi_murids', 'tanggal_mulai')) {
                $table->date('tanggal_mulai')->nullable();
            }

            if (!Schema::hasColumn('absensi_murids', 'tanggal_selesai')) {
                $table->date('tanggal_selesai')->nullable();
            }

            if (!Schema::hasColumn('absensi_murids', 'keterangan')) {
                $table->text('keterangan')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('absensi_murids', function (Blueprint $table) {
            $table->dropColumn(['jenis', 'tanggal_mulai', 'tanggal_selesai', 'keterangan']);
        });
    }
};
