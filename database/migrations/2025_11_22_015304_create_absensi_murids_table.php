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
    Schema::create('absensi_murids', function (Blueprint $table) {
        $table->id();
        $table->foreignId('guru_id')->constrained('gurus')->onDelete('cascade'); // Siapa yang mengabsen
        $table->foreignId('kelas_id')->constrained('kelas')->onDelete('cascade');
        $table->foreignId('siswa_id')->constrained('siswas')->onDelete('cascade');

        $table->date('tanggal');
        // Enum status kehadiran
        $table->enum('status', ['Hadir', 'Sakit', 'Izin', 'Alpha'])->default('Hadir');

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('absensi_murids');
    }
};
