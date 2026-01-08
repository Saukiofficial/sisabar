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
        // Gunakan Schema::create karena tabel baru akan dibuat
        Schema::create('jurnals', function (Blueprint $table) {
            $table->id();

            // Foreign Keys
            $table->foreignId('guru_id')->constrained('gurus')->onDelete('cascade');
            $table->foreignId('mapel_id')->constrained('mapels')->onDelete('cascade');
            $table->foreignId('kelas_id')->constrained('kelas')->onDelete('cascade');

            // --- INFORMASI UMUM ---
            $table->date('tanggal');
            $table->string('semester')->default('Ganjil');
            $table->string('jam_pelajaran')->nullable();
            $table->integer('pertemuan_ke')->default(1);
            $table->text('materi'); // Materi Pokok
            $table->string('sub_materi')->nullable();
            $table->string('ki_kd')->nullable(); // Kompetensi Inti/Dasar

            // --- ISI JURNAL DETAIL ---
            $table->text('tujuan_pembelajaran')->nullable();
            $table->text('penjelasan_materi')->nullable();
            $table->text('kegiatan_pembelajaran')->nullable();
            $table->string('media_belajar')->nullable();
            $table->string('respon_siswa')->nullable();
            $table->string('jenis_penilaian')->nullable();

            // --- KEHADIRAN (Rekap Angka) ---
            $table->integer('jml_hadir')->default(0);
            $table->integer('jml_izin')->default(0);
            $table->integer('jml_sakit')->default(0);
            $table->integer('jml_alpa')->default(0);

            // --- EVALUASI & CATATAN ---
            $table->text('tugas_pr')->nullable();
            $table->text('evaluasi_hasil')->nullable();
            $table->text('permasalahan_kbm')->nullable();
            $table->text('catatan')->nullable();

            // --- FILE ---
            $table->string('dokumentasi')->nullable(); // Path file

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jurnals');
    }
};
