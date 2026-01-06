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
    Schema::create('absensi_gurus', function (Blueprint $table) {
        $table->id();
        $table->foreignId('guru_id')->constrained('gurus')->onDelete('cascade');
        $table->date('tanggal');
        $table->time('jam_masuk')->nullable();
        $table->time('jam_pulang')->nullable();
        $table->string('device_info')->nullable(); // Merk HP / Browser
        $table->string('lokasi')->nullable(); // Koordinat Latitude,Longitude
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('absensi_gurus');
    }
};
