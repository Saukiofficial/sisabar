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
        // Pastikan tabelnya benar: 'absensi_murids'
        Schema::table('absensi_murids', function (Blueprint $table) {
            // Kita ubah kolom 'status' agar bisa menampung string panjang
            // seperti "Menunggu Verifikasi", "Disetujui", dll.
            // Sebelumnya mungkin ENUM atau VARCHAR pendek.
            $table->string('status', 50)->nullable()->change();
        });
    }

    /**
     * Kembalikan ke keadaan semula
     */
    public function down()
    {
        Schema::table('absensi_murids', function (Blueprint $table) {
            // Jika ingin rollback, kita kembalikan ke tipe data yang aman (string pendek)
            // atau ENUM jika Anda tahu nilai pastinya.
            // Untuk keamanan rollback, kita kembalikan ke string 255 default saja.
            $table->string('status', 255)->change();
        });
    }
};
