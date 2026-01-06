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
        Schema::create('perangkat_pembelajarans', function (Blueprint $table) {
            $table->id();

            // Relasi (Tetap pertahankan mapel_id sesuai struktur Anda)
            $table->foreignId('guru_id')->constrained('gurus')->onDelete('cascade');
            $table->foreignId('mapel_id')->constrained('mapels')->onDelete('cascade');

            // Jenis Perangkat & Identitas
            $table->string('jenis_perangkat'); // Contoh: "RPP", "Silabus", "Modul Ajar"
            $table->string('judul');
            $table->string('file_path');
            $table->string('keterangan')->nullable();

            // --- KOLOM TAMBAHAN UNTUK SUPERVISI DIGITAL ---
            $table->string('tahun_ajaran')->nullable(); // Misal: "2024/2025"
            $table->enum('semester', ['Ganjil', 'Genap'])->nullable();

            // Status Validasi Kepala Sekolah
            $table->enum('status', ['Menunggu', 'Revisi', 'Valid'])->default('Menunggu');
            $table->text('catatan_revisi')->nullable(); // Pesan dari Kepsek jika ditolak

            // Info Tanda Tangan Digital
            $table->dateTime('tanggal_validasi')->nullable(); // Kapan disetujui
            $table->string('nama_validator')->nullable(); // Nama Kepsek yang memvalidasi

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('perangkat_pembelajarans');
    }
};
