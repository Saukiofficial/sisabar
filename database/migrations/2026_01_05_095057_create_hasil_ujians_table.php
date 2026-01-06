<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Tabel Header Hasil (Rekap Nilai)
        Schema::create('hasil_ujians', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ujian_id')->constrained('ujians')->onDelete('cascade');
            $table->foreignId('siswa_id')->constrained('siswas')->onDelete('cascade');

            $table->decimal('nilai_akhir', 5, 2)->default(0); // Skala 0-100
            $table->dateTime('waktu_mulai');
            $table->dateTime('waktu_selesai')->nullable();
            $table->enum('status', ['Mengerjakan', 'Selesai'])->default('Mengerjakan');

            $table->timestamps();
        });

        // 2. Tabel Detail Jawaban (Per butir soal)
        Schema::create('jawaban_siswas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hasil_ujian_id')->constrained('hasil_ujians')->onDelete('cascade');
            $table->foreignId('ujian_soal_id')->constrained('ujian_soals')->onDelete('cascade');

            $table->text('jawaban')->nullable(); // 'A', 'B' atau Teks Essay
            $table->boolean('ragu_ragu')->default(false);
            $table->integer('nilai_poin')->default(0); // Poin yang didapat dari soal ini

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jawaban_siswas');
        Schema::dropIfExists('hasil_ujians');
    }
};
