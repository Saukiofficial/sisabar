<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Tabel Header Ujian (Paket Soal)
        Schema::create('ujians', function (Blueprint $table) {
            $table->id();

            // Relasi
            $table->foreignId('guru_id')->constrained('gurus')->onDelete('cascade');
            $table->foreignId('mapel_id')->constrained('mapels')->onDelete('cascade');
            $table->foreignId('kelas_id')->constrained('kelas')->onDelete('cascade'); // Ujian ini untuk kelas mana

            // Info Ujian
            $table->string('judul'); // Cth: "UTS Semester Ganjil"
            $table->enum('jenis_soal', ['Pilihan Ganda', 'Uraian', 'Campuran']);
            $table->enum('status', ['Draft', 'Terbit'])->default('Draft');

            $table->date('tanggal_ujian')->nullable(); // Kapan ujian dimulai
            $table->integer('durasi_menit')->default(60); // Durasi pengerjaan

            $table->timestamps();
        });

        // 2. Tabel Butir Soal
        Schema::create('ujian_soals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ujian_id')->constrained('ujians')->onDelete('cascade');

            $table->enum('tipe', ['Pilihan Ganda', 'Uraian']); // Per butir soal
            $table->longText('pertanyaan');
            $table->string('gambar')->nullable(); // Opsional

            // Opsi PG (Nullable jika Uraian)
            $table->text('opsi_a')->nullable();
            $table->text('opsi_b')->nullable();
            $table->text('opsi_c')->nullable();
            $table->text('opsi_d')->nullable();
            $table->text('opsi_e')->nullable();

            // Kunci Jawaban
            $table->text('kunci_jawaban'); // Bisa 'A' atau teks panjang untuk uraian
            $table->integer('bobot')->default(1); // Bobot nilai per soal

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ujian_soals');
        Schema::dropIfExists('ujians');
    }
};
