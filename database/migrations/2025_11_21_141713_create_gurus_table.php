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
    Schema::create('gurus', function (Blueprint $table) {
        $table->id();
        // Relasi ke tabel users (untuk login)
        $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

        // Data spesifik guru
        // Kita buat nullable jika guru belum diassign mapel/kelas
        $table->foreignId('mapel_id')->nullable()->constrained('mapels')->nullOnDelete();
        $table->foreignId('kelas_id')->nullable()->constrained('kelas')->nullOnDelete(); // Jika wali kelas

        $table->boolean('status_aktif')->default(true);
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gurus');
    }
};
