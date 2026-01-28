<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Mengubah kolom status menjadi VARCHAR(50) agar bisa menampung 'Menunggu Verifikasi'
     */
    public function up()
    {
        Schema::table('absensis', function (Blueprint $table) {
            // Ubah tipe kolom status menjadi string sepanjang 50 karakter
            // Default null agar aman
            $table->string('status', 50)->nullable()->change();
        });
    }

    /**
     * Kembalikan ke keadaan semula (Opsional, sesuaikan dengan ENUM lama Anda jika perlu)
     */
    public function down()
    {
        Schema::table('absensis', function (Blueprint $table) {
            // Kembalikan ke string pendek atau ENUM jika perlu rollback
            // $table->enum('status', ['Hadir', 'Izin', 'Sakit', 'Alpha'])->change();
        });
    }
};
