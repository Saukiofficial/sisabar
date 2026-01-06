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
        // Hapus tabel lama jika ada biar tidak konflik
        Schema::dropIfExists('bank_soals');

        Schema::create('bank_soals', function (Blueprint $table) {
            $table->id();

            // Relasi ke Guru (Pengupload) & Mapel
            $table->foreignId('guru_id')->constrained('gurus')->onDelete('cascade');
            $table->foreignId('mapel_id')->constrained('mapels')->onDelete('cascade');

            // Info Berkas
            $table->string('judul_soal'); // Contoh: "UTS Matematika Kelas 10"
            $table->string('file_soal');  // Path penyimpanan file (PDF/DOCX)
            $table->string('tipe_file')->nullable(); // pdf, docx, etc
            $table->string('ukuran_file')->nullable(); // misal: 2MB

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bank_soals');
    }
};
