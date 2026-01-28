<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Menambahkan kolom jenis, tanggal_mulai, tanggal_selesai ke tabel absensis
     */
    public function up()
    {
        Schema::table('absensis', function (Blueprint $table) {
            // Cek apakah kolom 'jenis' sudah ada, jika belum, tambahkan
            if (!Schema::hasColumn('absensis', 'jenis')) {
                $table->string('jenis', 50)->nullable()->after('user_id')->comment('Sakit, Izin, Lainnya');
            }

            // Tambahkan kolom tanggal mulai & selesai untuk rentang izin
            if (!Schema::hasColumn('absensis', 'tanggal_mulai')) {
                $table->date('tanggal_mulai')->nullable()->after('jenis');
            }
            if (!Schema::hasColumn('absensis', 'tanggal_selesai')) {
                $table->date('tanggal_selesai')->nullable()->after('tanggal_mulai');
            }

            // Pastikan kolom keterangan ada (biasanya tipe TEXT)
            if (!Schema::hasColumn('absensis', 'keterangan')) {
                $table->text('keterangan')->nullable()->after('status');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('absensis', function (Blueprint $table) {
            $table->dropColumn(['jenis', 'tanggal_mulai', 'tanggal_selesai', 'keterangan']);
        });
    }
};
