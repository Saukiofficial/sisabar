<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Tabel Jadwal Ujian (Menghubungkan Paket Soal ke Kelas & Waktu)
        Schema::create('jadwal_ujians', function (Blueprint $table) {
            $table->id();

            $table->foreignId('ujian_id')->constrained('ujians')->onDelete('cascade'); // Paket Soal mana?
            $table->foreignId('kelas_id')->constrained('kelas')->onDelete('cascade');   // Untuk kelas mana?
            $table->foreignId('guru_id')->constrained('gurus')->onDelete('cascade');    // Siapa yang set jadwal?

            $table->string('nama_ujian'); // Cth: "UAS Matematika X-A"
            $table->dateTime('waktu_mulai');
            $table->dateTime('waktu_selesai');
            $table->integer('durasi_menit'); // Durasi pengerjaan timer

            $table->enum('status', ['Belum Mulai', 'Berlangsung', 'Selesai'])->default('Belum Mulai');
            $table->boolean('is_active')->default(true); // Tombol ON/OFF manual

            $table->string('token_ujian')->nullable(); // Token masuk (opsional)

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jadwal_ujians');
    }
};
