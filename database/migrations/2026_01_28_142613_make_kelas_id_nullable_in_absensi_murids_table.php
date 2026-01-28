<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Ubah kolom kelas_id menjadi nullable (boleh kosong)
     */
    public function up()
    {
        Schema::table('absensi_murids', function (Blueprint $table) {
            // Pastikan kolom kelas_id ada sebelum diubah
            if (Schema::hasColumn('absensi_murids', 'kelas_id')) {
                // Ubah menjadi nullable
                $table->unsignedBigInteger('kelas_id')->nullable()->change();
            }
        });
    }

    /**
     * Kembalikan ke keadaan semula (wajib isi)
     */
    public function down()
    {
        Schema::table('absensi_murids', function (Blueprint $table) {
            // Kembalikan ke nullable(false) jika perlu rollback
            // $table->unsignedBigInteger('kelas_id')->nullable(false)->change();
        });
    }
};
